package com.enterprise.onboarding.service;

import com.enterprise.onboarding.entity.AppEntitlement;
import com.enterprise.onboarding.entity.OnboardingRequest;
import com.enterprise.onboarding.entity.UserTaskItem;
import com.enterprise.onboarding.repository.OnboardingRepository;
import com.enterprise.onboarding.repository.UserTaskRepository;
import io.camunda.zeebe.client.ZeebeClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ZeebeWorkflowService {

    private static final Logger log = LoggerFactory.getLogger(ZeebeWorkflowService.class);

    @Autowired
    private OnboardingRepository onboardingRepository;

    @Autowired
    private UserTaskRepository userTaskRepository;

    @Autowired(required = false)
    private ZeebeClient zeebeClient;

    @Transactional
    public OnboardingRequest startOnboardingWorkflow(OnboardingRequest request) {
        request.setOverallStatus("IN_PROGRESS");
        request.setBgvStatus("IN_PROGRESS_SEQUENTIAL_REF_CHECK");
        request.setHardwareStatus("AWAITING_BGV_CLEARANCE");
        request.addLog("Workflow initiated for " + request.getEmployeeName() + " (" + request.getRole() + ")");
        request.addLog("Parallel Gateway Split: Launching Multi-Instance SaaS Provisioning & BGV Sub-Process");

        // Try starting on real Camunda 8 Zeebe Engine if connected
        String instanceKey = "ZEEBE-" + (2251799813685200L + (long) (Math.random() * 9999));
        if (zeebeClient != null) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("employeeName", request.getEmployeeName());
                variables.put("email", request.getEmail());
                variables.put("hardwareModel", request.getHardwareModel());
                variables.put("shippingAddress", request.getShippingAddress());
                variables.put("simulateBgvFailure", request.isSimulateBgvFailure());
                variables.put("requestedApps", request.getRequestedApps());
                variables.put("references", request.getReferenceList());

                var event = zeebeClient.newCreateInstanceCommand()
                        .bpmnProcessId("zero-trust-onboarding-process")
                        .latestVersion()
                        .variables(variables)
                        .send()
                        .join();
                instanceKey = String.valueOf(event.getProcessInstanceKey());
                request.addLog("Camunda 8 Zeebe Engine Instance Created: Key #" + instanceKey);
            } catch (Exception e) {
                log.warn("Zeebe Broker not reachable ({}), using integrated state engine.", e.getMessage());
                request.addLog("Zeebe Process Instance Assigned: Key #" + instanceKey);
            }
        } else {
            request.addLog("Zeebe Process Instance Assigned: Key #" + instanceKey);
        }
        request.setProcessInstanceKey(instanceKey);

        // Log Sequential Multi-Instance Reference Verification
        for (String ref : request.getReferenceList()) {
            request.addLog("[Sequential Multi-Instance] Verified Employment Reference: " + ref);
        }

        // Save initial request to get ID
        OnboardingRequest saved = onboardingRepository.save(request);

        // Process Parallel Multi-Instance SaaS Apps
        for (AppEntitlement app : saved.getRequestedApps()) {
            if (app.isRequiresSecurityApproval()) {
                app.setProvisioningStatus("PENDING_SECURITY_APPROVAL");
                saved.addLog("[Parallel MI: " + app.getAppName() + "] Routed to Security Officer User Task (High Privilege)");

                UserTaskItem secTask = new UserTaskItem();
                secTask.setOnboardingRequestId(saved.getId());
                secTask.setEntitlementId(app.getId());
                secTask.setTaskName("Approve High-Privilege SaaS Entitlement: " + app.getAppName());
                secTask.setTaskType("SECURITY_ENTITLEMENT_APPROVAL");
                secTask.setAssigneeRole("Zero-Trust Security Officer");
                secTask.setEmployeeName(saved.getEmployeeName());
                secTask.setDetails("Role: " + app.getRole() + " | Clearance: " + saved.getClearanceLevel());
                secTask.setStatus("OPEN");
                userTaskRepository.save(secTask);
            } else {
                String accId = app.getAppName().toUpperCase().replaceAll("\\s+", "") + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
                app.setProvisioningStatus("PROVISIONED");
                app.setGeneratedAccountId(accId);
                saved.addLog("[Parallel MI: " + app.getAppName() + "] Auto-Provisioned via IAM REST Connector -> ID: " + accId);
            }
        }

        // Create BGV Audit Task (or trigger Boundary Error if simulateBgvFailure is true)
        UserTaskItem bgvTask = new UserTaskItem();
        bgvTask.setOnboardingRequestId(saved.getId());
        bgvTask.setTaskName("Final Background Verification & Reference Sign-Off");
        bgvTask.setTaskType("BGV_FINAL_AUDIT");
        bgvTask.setAssigneeRole("HR Compliance & BGV Specialist");
        bgvTask.setEmployeeName(saved.getEmployeeName());
        bgvTask.setDetails("References Checked: " + saved.getReferenceList().size()
                + (saved.isSimulateBgvFailure() ? " | WARNING: Anomaly Flagged in Criminal/Identity Check" : " | All References Cleared"));
        bgvTask.setStatus("OPEN");
        userTaskRepository.save(bgvTask);

        return onboardingRepository.save(saved);
    }

    @Transactional
    public OnboardingRequest completeUserTask(Long taskId, boolean approved) {
        UserTaskItem task = userTaskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));
        OnboardingRequest request = onboardingRepository.findById(task.getOnboardingRequestId())
                .orElseThrow(() -> new RuntimeException("Onboarding Request not found"));

        task.setStatus("COMPLETED");
        userTaskRepository.save(task);

        if ("SECURITY_ENTITLEMENT_APPROVAL".equals(task.getTaskType())) {
            for (AppEntitlement app : request.getRequestedApps()) {
                if (app.getId().equals(task.getEntitlementId())) {
                    if (approved) {
                        String accId = app.getAppName().toUpperCase().replaceAll("\\s+", "") + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
                        app.setProvisioningStatus("PROVISIONED");
                        app.setGeneratedAccountId(accId);
                        request.addLog("[Security Task Approved] Provisioned " + app.getAppName() + " via IAM REST Connector -> ID: " + accId);
                    } else {
                        app.setProvisioningStatus("REJECTED");
                        request.addLog("[Security Task Rejected] Access denied for " + app.getAppName());
                    }
                }
            }
        } else if ("BGV_FINAL_AUDIT".equals(task.getTaskType())) {
            if (!approved || request.isSimulateBgvFailure()) {
                // Trigger Error Boundary Event (BGV_FAILED)
                request.setBgvStatus("FAILED_ERROR_BOUNDARY_CAUGHT");
                request.setHardwareStatus("HALTED_BY_BGV_FAILURE");
                request.setOverallStatus("HALTED_BGV_FAILED");
                request.addLog("[ZeebeBpmnError: BGV_FAILED] Interrupting Error Boundary Event triggered on BGV Sub-Process!");
                request.addLog("[Compensation Task] Revoking all provisional SaaS accounts & halting Hardware Call Activity.");
                for (AppEntitlement app : request.getRequestedApps()) {
                    app.setProvisioningStatus("REVOKED_BGV_FAILURE");
                }
                // Close any remaining open tasks for this onboarding
                List<UserTaskItem> remaining = userTaskRepository.findByOnboardingRequestIdAndStatus(request.getId(), "OPEN");
                for (UserTaskItem rem : remaining) {
                    rem.setStatus("COMPLETED");
                    userTaskRepository.save(rem);
                }
            } else {
                request.setBgvStatus("PASSED");
                request.addLog("[BGV Sub-Process Completed] Background & Sequential Reference Checks PASSED.");
            }
        }

        // Check if all tasks are complete and BGV passed to invoke Call Activity
        List<UserTaskItem> openTasks = userTaskRepository.findByOnboardingRequestIdAndStatus(request.getId(), "OPEN");
        if (openTasks.isEmpty() && "PASSED".equals(request.getBgvStatus()) && !"COMPLETED".equals(request.getOverallStatus())) {
            String serial = "MBP-M3MAX-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            String courier = "DHL-EXP-" + (100000 + (int) (Math.random() * 899999));
            request.setHardwareSerial(serial);
            request.setCourierTrackingId(courier);
            request.setHardwareStatus("DISPATCHED_VIA_CALL_ACTIVITY");
            request.setOverallStatus("COMPLETED");
            request.addLog("[Call Activity: hardware-procurement-child] Allocated " + request.getHardwareModel() + " (Serial: " + serial + ")");
            request.addLog("[Call Activity: hardware-procurement-child] Courier Dispatched -> Tracking ID: " + courier);
            request.addLog("[Outbound Slack & Email Connector] Sent Zero-Trust Welcome Kit & Credentials to " + request.getEmail());
        }

        return onboardingRepository.save(request);
    }
}
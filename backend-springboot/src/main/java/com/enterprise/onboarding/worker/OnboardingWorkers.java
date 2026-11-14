package com.enterprise.onboarding.worker;

import java.util.Collections;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.camunda.zeebe.spring.client.annotation.JobWorker;
import io.camunda.zeebe.spring.client.annotation.Variable;
import io.camunda.zeebe.spring.client.exception.ZeebeBpmnError;

@Component
public class OnboardingWorkers {

    private static final Logger log = LoggerFactory.getLogger(OnboardingWorkers.class);

    @JobWorker(type = "init-zero-trust-profile")
    public Map<String, Object> initZeroTrustProfile(@Variable String employeeName, @Variable String email) {
        String zeroTrustUid = "ZT-ID-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("[Zeebe Worker] Initialized Zero-Trust Identity {} for {} ({})", zeroTrustUid, employeeName, email);
        return Map.of("zeroTrustUid", zeroTrustUid, "bgvStatus", "PENDING");
    }

    @JobWorker(type = "provision-saas-app")
    public Map<String, Object> provisionSaasApp(
            @Variable String targetAppName,
            @Variable String targetAppRole,
            @Variable String employeeEmail) {
        String accountId = targetAppName.toUpperCase().replaceAll("\\s+", "") + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        log.info("[Zeebe Multi-Instance Worker] Provisioned {} ({}) for {} -> Account ID: {}",
                targetAppName, targetAppRole, employeeEmail, accountId);
        return Map.of(
                "appProvisionStatus", "PROVISIONED",
                "generatedAccountId", accountId
        );
    }

    @JobWorker(type = "verify-employment-reference")
    public Map<String, Object> verifyEmploymentReference(@Variable Object refItem) {
        log.info("[Zeebe Sequential MI Worker] Verified employer reference: {}", refItem);
        return Map.of("referenceVerified", true);
    }

    @JobWorker(type = "verify-background-check")
    public Map<String, Object> verifyBackgroundCheck(
            @Variable String employeeName,
            @Variable Boolean simulateBgvFailure) {
        log.info("[Zeebe BGV Sub-Process Worker] Running criminal & identity check for {}", employeeName);
        if (Boolean.TRUE.equals(simulateBgvFailure)) {
            log.error("[Zeebe BGV Error] Discrepancy detected for {}! Throwing ZeebeBpmnError(BGV_FAILED)", employeeName);
            throw new ZeebeBpmnError(
                    "BGV_FAILED",
                    "Background verification failed due to credential discrepancy.",
                    Collections.emptyMap()
            );
        }
        return Map.of("bgvStatus", "PASSED");
    }

    @JobWorker(type = "revoke-onboarding-access")
    public Map<String, Object> revokeOnboardingAccess(@Variable String employeeName) {
        log.warn("[Zeebe Error Boundary Compensation] Revoking all provisional tokens & halting hardware shipping for {}", employeeName);
        return Map.of("bgvStatus", "FAILED", "hardwareStatus", "HALTED_SECURITY_BLOCK");
    }

    @JobWorker(type = "allocate-hardware-asset")
    public Map<String, Object> allocateHardwareAsset(@Variable String hardwareModel) {
        String serial = "MBP-SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        log.info("[Zeebe Call Activity Worker] Allocated hardware {} with Serial {}", hardwareModel, serial);
        return Map.of("hardwareSerial", serial);
    }

    @JobWorker(type = "dispatch-hardware-courier")
    public Map<String, Object> dispatchHardwareCourier(@Variable String shippingAddress) {
        String trackingId = "DHL-ZT-" + (100000 + (int)(Math.random() * 900000));
        log.info("[Zeebe Call Activity Worker] Dispatched courier to {} -> Tracking: {}", shippingAddress, trackingId);
        return Map.of("courierTrackingId", trackingId, "hardwareStatus", "ALLOCATED_AND_SHIPPED");
    }

    @JobWorker(type = "send-welcome-notification")
    public Map<String, Object> sendWelcomeNotification(@Variable String employeeName, @Variable String email) {
        log.info("[Zeebe Outbound Connector] Sent Slack & Email Welcome Kit to {} ({})", employeeName, email);
        return Map.of("welcomeNotificationSent", true);
    }
}
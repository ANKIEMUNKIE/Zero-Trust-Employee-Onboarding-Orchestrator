package com.enterprise.onboarding.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "onboarding_requests")
public class OnboardingRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String processInstanceKey;
    private String employeeName;
    private String email;
    private String department;
    private String role;
    private String clearanceLevel;
    private String hardwareModel;
    private String shippingAddress;
    private boolean simulateBgvFailure;

    private String overallStatus; // IN_PROGRESS, COMPLETED, HALTED_BGV_FAILED
    private String bgvStatus;     // PENDING_REFERENCES, VERIFIED_PASSED, FAILED_ANOMALY
    private String hardwareStatus; // AWAITING_BGV, ALLOCATED_AND_SHIPPED, HALTED_SECURITY_BLOCK
    private String hardwareSerial;
    private String courierTrackingId;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> referenceList = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> auditLogs = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "onboarding_id")
    private List<AppEntitlement> requestedApps = new ArrayList<>();

    public void addLog(String message) {
        this.auditLogs.add("[" + LocalDateTime.now().toLocalTime().withNano(0) + "] " + message);
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProcessInstanceKey() { return processInstanceKey; }
    public void setProcessInstanceKey(String processInstanceKey) { this.processInstanceKey = processInstanceKey; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getClearanceLevel() { return clearanceLevel; }
    public void setClearanceLevel(String clearanceLevel) { this.clearanceLevel = clearanceLevel; }
    public String getHardwareModel() { return hardwareModel; }
    public void setHardwareModel(String hardwareModel) { this.hardwareModel = hardwareModel; }
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    public boolean isSimulateBgvFailure() { return simulateBgvFailure; }
    public void setSimulateBgvFailure(boolean simulateBgvFailure) { this.simulateBgvFailure = simulateBgvFailure; }
    public String getOverallStatus() { return overallStatus; }
    public void setOverallStatus(String overallStatus) { this.overallStatus = overallStatus; }
    public String getBgvStatus() { return bgvStatus; }
    public void setBgvStatus(String bgvStatus) { this.bgvStatus = bgvStatus; }
    public String getHardwareStatus() { return hardwareStatus; }
    public void setHardwareStatus(String hardwareStatus) { this.hardwareStatus = hardwareStatus; }
    public String getHardwareSerial() { return hardwareSerial; }
    public void setHardwareSerial(String hardwareSerial) { this.hardwareSerial = hardwareSerial; }
    public String getCourierTrackingId() { return courierTrackingId; }
    public void setCourierTrackingId(String courierTrackingId) { this.courierTrackingId = courierTrackingId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<String> getReferenceList() { return referenceList; }
    public void setReferenceList(List<String> referenceList) { this.referenceList = referenceList; }
    public List<String> getAuditLogs() { return auditLogs; }
    public void setAuditLogs(List<String> auditLogs) { this.auditLogs = auditLogs; }
    public List<AppEntitlement> getRequestedApps() { return requestedApps; }
    public void setRequestedApps(List<AppEntitlement> requestedApps) { this.requestedApps = requestedApps; }
}
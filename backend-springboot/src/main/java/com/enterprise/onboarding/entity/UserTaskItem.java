package com.enterprise.onboarding.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "custom_tasklist_items")
public class UserTaskItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long onboardingRequestId;
    private Long entitlementId;
    private String taskName;
    private String taskType; // SECURITY_ENTITLEMENT_APPROVAL, BGV_FINAL_AUDIT
    private String assigneeRole;
    private String employeeName;
    private String details;
    private String status; // OPEN, COMPLETED
    private LocalDateTime createdAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getOnboardingRequestId() { return onboardingRequestId; }
    public void setOnboardingRequestId(Long onboardingRequestId) { this.onboardingRequestId = onboardingRequestId; }
    public Long getEntitlementId() { return entitlementId; }
    public void setEntitlementId(Long entitlementId) { this.entitlementId = entitlementId; }
    public String getTaskName() { return taskName; }
    public void setTaskName(String taskName) { this.taskName = taskName; }
    public String getTaskType() { return taskType; }
    public void setTaskType(String taskType) { this.taskType = taskType; }
    public String getAssigneeRole() { return assigneeRole; }
    public void setAssigneeRole(String assigneeRole) { this.assigneeRole = assigneeRole; }
    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
package com.enterprise.onboarding.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "app_entitlements")
public class AppEntitlement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String appName;
    private String role;
    private boolean requiresSecurityApproval;
    private String provisioningStatus; // PENDING_APPROVAL, PROVISIONED, REJECTED, REVOKED
    private String generatedAccountId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAppName() { return appName; }
    public void setAppName(String appName) { this.appName = appName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public boolean isRequiresSecurityApproval() { return requiresSecurityApproval; }
    public void setRequiresSecurityApproval(boolean requiresSecurityApproval) { this.requiresSecurityApproval = requiresSecurityApproval; }
    public String getProvisioningStatus() { return provisioningStatus; }
    public void setProvisioningStatus(String provisioningStatus) { this.provisioningStatus = provisioningStatus; }
    public String getGeneratedAccountId() { return generatedAccountId; }
    public void setGeneratedAccountId(String generatedAccountId) { this.generatedAccountId = generatedAccountId; }
}
package com.enterprise.onboarding.controller;

import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/mock-iam")
@CrossOrigin(origins = "*")
public class MockIamController {

    @PostMapping("/provision")
    public Map<String, Object> provisionAccount(@RequestBody Map<String, String> payload) {
        String appName = payload.getOrDefault("appName", "SAAS");
        String generatedId = appName.toUpperCase() + "-IAM-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
        return Map.of(
                "status", "ACTIVE",
                "accountId", generatedId,
                "zeroTrustPolicy", "MFA_ENFORCED_YUBIKEY"
        );
    }
}
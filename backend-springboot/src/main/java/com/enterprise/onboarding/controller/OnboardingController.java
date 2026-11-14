package com.enterprise.onboarding.controller;

import com.enterprise.onboarding.entity.OnboardingRequest;
import com.enterprise.onboarding.repository.OnboardingRepository;
import com.enterprise.onboarding.service.ZeebeWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/onboarding")
@CrossOrigin(origins = "*")
public class OnboardingController {

    @Autowired
    private ZeebeWorkflowService workflowService;

    @Autowired
    private OnboardingRepository onboardingRepository;

    @PostMapping("/start")
    public OnboardingRequest startOnboarding(@RequestBody OnboardingRequest request) {
        return workflowService.startOnboardingWorkflow(request);
    }

    @GetMapping
    public List<OnboardingRequest> getAllOnboardings() {
        return onboardingRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public OnboardingRequest getOnboardingById(@PathVariable Long id) {
        return onboardingRepository.findById(id).orElseThrow();
    }
}
package com.enterprise.onboarding.controller;

import com.enterprise.onboarding.entity.OnboardingRequest;
import com.enterprise.onboarding.entity.UserTaskItem;
import com.enterprise.onboarding.repository.UserTaskRepository;
import com.enterprise.onboarding.service.ZeebeWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class CustomTasklistController {

    @Autowired
    private UserTaskRepository userTaskRepository;

    @Autowired
    private ZeebeWorkflowService workflowService;

    @GetMapping
    public List<UserTaskItem> getOpenTasks() {
        return userTaskRepository.findByStatusOrderByCreatedAtDesc("OPEN");
    }

    @PostMapping("/{taskId}/complete")
    public OnboardingRequest completeTask(@PathVariable Long taskId, @RequestBody Map<String, Boolean> payload) {
        boolean approved = payload.getOrDefault("approved", true);
        return workflowService.completeUserTask(taskId, approved);
    }
}
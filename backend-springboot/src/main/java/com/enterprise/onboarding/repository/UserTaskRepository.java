package com.enterprise.onboarding.repository;

import com.enterprise.onboarding.entity.UserTaskItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserTaskRepository extends JpaRepository<UserTaskItem, Long> {
    List<UserTaskItem> findByStatusOrderByCreatedAtDesc(String status);
    List<UserTaskItem> findByOnboardingRequestIdAndStatus(Long onboardingRequestId, String status);
}
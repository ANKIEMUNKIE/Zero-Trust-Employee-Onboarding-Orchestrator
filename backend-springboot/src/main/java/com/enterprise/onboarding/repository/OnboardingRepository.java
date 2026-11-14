package com.enterprise.onboarding.repository;

import com.enterprise.onboarding.entity.OnboardingRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OnboardingRepository extends JpaRepository<OnboardingRequest, Long> {
    List<OnboardingRequest> findAllByOrderByCreatedAtDesc();
}
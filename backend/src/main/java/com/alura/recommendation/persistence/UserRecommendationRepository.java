package com.alura.recommendation.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRecommendationRepository extends JpaRepository<UserRecommendationEntity, Long> {

    @Query("""
            SELECT ur FROM UserRecommendationEntity ur
            JOIN FETCH ur.recommendation
            WHERE ur.userId = :userId AND ur.status = :status
            ORDER BY ur.updatedAt DESC, ur.id DESC
            """)
    List<UserRecommendationEntity> findActiveForUser(@Param("userId") String userId, @Param("status") String status);

    Optional<UserRecommendationEntity> findByUserIdAndRecommendation_IdAndStatus(
            String userId, Long recommendationId, String status);
}

package com.alura.recommendation.repository;

import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationStatus;
import com.alura.recommendation.model.UserRecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRecommendationRepository extends JpaRepository<UserRecommendationEntity, Long> {

    // Consulta adaptada para buscar por userId de tipo String (email/token)
    @Query("SELECT ur.recommendation.tipKey FROM UserRecommendationEntity ur " +
           "WHERE ur.userId = :userId AND ur.status = :status")
    List<TipKey> findTipKeysByUserIdAndStatus(@Param("userId") String userId, 
                                              @Param("status") RecommendationStatus status);
}
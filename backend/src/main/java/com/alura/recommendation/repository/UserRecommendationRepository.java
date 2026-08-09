package com.alura.recommendation.repository;

import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationStatus;
import com.alura.recommendation.model.UserRecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserRecommendationRepository extends JpaRepository<UserRecommendationEntity, Long> {

    // Esta consulta es crucial para el rendimiento. En lugar de traer entidades completas,
    // extraemos únicamente la lista de TipKeys (Enum) que el usuario tiene activas.
    @Query("SELECT ur.recommendation.tipKey FROM UserRecommendationEntity ur " +
           "WHERE ur.userId = :userId AND ur.status = :status")
    List<TipKey> findTipKeysByUserIdAndStatus(@Param("userId") Long userId, 
                                              @Param("status") RecommendationStatus status);
}
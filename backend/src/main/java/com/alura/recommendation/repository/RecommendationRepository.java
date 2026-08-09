package com.alura.recommendation.repository;

import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface RecommendationRepository extends JpaRepository<RecommendationEntity, Long> {
    
    Optional<RecommendationEntity> findByTipKey(TipKey tipKey);
    
    List<RecommendationEntity> findByTipKeyIn(List<TipKey> tipKeys);
}
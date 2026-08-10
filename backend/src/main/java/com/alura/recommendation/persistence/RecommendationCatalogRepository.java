package com.alura.recommendation.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RecommendationCatalogRepository extends JpaRepository<RecommendationCatalogEntity, Long> {

    Optional<RecommendationCatalogEntity> findByTipKeyIgnoreCase(String tipKey);
}

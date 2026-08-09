package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Catálogo estático auxiliar para compatibilidad y fallback del motor V2.
 */
@Component
public class RecommendationCatalog {

    public List<RecommendationItem> getDefaultCatalog() {
        return List.of(
                RecommendationItem.builder()
                        .tipKey(TipKey.HIGH_CONSUMPTION_BASE)
                        .type("ALERTA")
                        .priority("HIGH")
                        .build(),
                RecommendationItem.builder()
                        .tipKey(TipKey.MEDIUM_CONSUMPTION_BASE)
                        .type("OPORTUNIDAD")
                        .priority("MEDIUM")
                        .build(),
                RecommendationItem.builder()
                        .tipKey(TipKey.LOW_CONSUMPTION_BASE)
                        .type("INFO")
                        .priority("LOW")
                        .build()
        );
    }
}
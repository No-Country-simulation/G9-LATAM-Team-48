package com.alura.recommendation.dto;

import com.alura.common.enums.ConsumptionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO de respuesta que contiene las recomendaciones activas para el frontend.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private Long userId;
    private ConsumptionCategory category;
    private String categoryFrontendKey;
    private List<RecommendationItem> recommendations;
}
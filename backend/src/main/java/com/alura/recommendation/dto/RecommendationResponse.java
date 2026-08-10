package com.alura.recommendation.dto;

import com.alura.common.enums.ConsumptionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationResponse {
    private String userId; // Actualizado a String para coherencia con el request y sesión
    private ConsumptionCategory category;
    private String categoryFrontendKey;
    private List<RecommendationItem> recommendations;
}
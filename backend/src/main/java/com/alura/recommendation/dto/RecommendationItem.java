package com.alura.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationItem {
    private TipKey tipKey;
    private String type;     // "ALTA", "OPORTUNIDAD", "INFO"
    private String priority; // "HIGH", "MEDIUM", "LOW"
}
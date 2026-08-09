package com.alura.recommendation.support;

import com.alura.recommendation.dto.RecommendationRequest;
import org.springframework.stereotype.Component;

@Component
public class RecommendationRequestMapper {

    /**
     * Componente auxiliar para mapear solicitudes externas hacia el contrato del motor V2.
     */
    public RecommendationRequest map(Long userId, Object rawPayload) {
        return RecommendationRequest.builder()
                .userId(userId)
                .build();
    }
}
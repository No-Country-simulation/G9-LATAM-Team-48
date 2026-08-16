package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

@Component
public class PeakHourUsageRule implements RecommendationRule {

    @Override
    public boolean applies(RecommendationRequest request) {
        // Utilizamos la variable específica inyectada en el nuevo DTO
        return Boolean.TRUE.equals(request.usoHorarioPico());
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.PEAK;
    }
}
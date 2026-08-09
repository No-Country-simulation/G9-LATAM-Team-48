package com.alura.recommendation.rules;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

@Component
public class HighOccupantConsumptionRule implements RecommendationRule {

    private static final BigDecimal HIGH_CONSUMPTION_PER_CAPITA_THRESHOLD = new BigDecimal("150.0");

    @Override
    public boolean applies(RecommendationRequest request) {
        return request.getCategory() != null
            && request.getCategory().isRequiresDetailedAnalysis()
            && request.getConsumoAnteriorPorPersona() != null
            && request.getConsumoAnteriorPorPersona().compareTo(HIGH_CONSUMPTION_PER_CAPITA_THRESHOLD) > 0;
    }

    @Override
    public Optional<RecommendationItem> evaluate(RecommendationRequest request) {
        if (!applies(request)) {
            return Optional.empty();
        }
        
        String type = ConsumptionCategory.INEFICIENTE.equals(request.getCategory()) ? "ALERTA" : "OPORTUNIDAD";
        
        return Optional.of(RecommendationItem.builder()
                .tipKey(TipKey.HIGH_CONSUMPTION_PER_PERSON)
                .type(type)
                .priority("HIGH")
                .build());
    }

    @Override
    public int getOrder() {
        return 5;
    }
}
package com.alura.recommendation.rules;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Regla de recomendación para perfiles de consumo energético alto.
 *
 * @version 2.0
 */
@Component
public class HighConsumptionRule implements RecommendationRule {

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null && ConsumptionCategory.HIGH.getModelValue().equalsIgnoreCase(request.category());
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.AC;
    }
}
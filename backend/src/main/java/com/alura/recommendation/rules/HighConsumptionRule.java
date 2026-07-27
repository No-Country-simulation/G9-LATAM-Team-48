package com.alura.recommendation.rules;

import com.alura.common.constants.CategoryConstants;
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
        // Uso de la constante centralizada en lugar del magic string
        return request != null && CategoryConstants.HIGH.equalsIgnoreCase(request.category());
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.AC;
    }
}
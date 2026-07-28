package com.alura.recommendation.rules;

import com.alura.common.constants.PropertyTypeConstants;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Regla de recomendación para departamentos.
 *
 * @version 1.0
 */
@Component
public class ApartmentEfficiencyRule implements RecommendationRule {

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null && PropertyTypeConstants.APARTMENT.equalsIgnoreCase(request.tipoInmueble());
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.APARTMENT;
    }
}
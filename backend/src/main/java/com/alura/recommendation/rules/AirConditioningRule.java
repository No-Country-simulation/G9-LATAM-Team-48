package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Regla de recomendación basada en el uso intensivo de climatización.
 *
 * <p>Se dispara cuando el usuario informa un uso de climatización igual
 * o superior a 8 horas diarias, sugiriendo optimizaciones en la aislación térmica.</p>
 *
 * @author miyo
 * @version 1.0
 */
@Component
public class AirConditioningRule implements RecommendationRule {

    private static final int UMBRAL_CLIMATIZACION = 8;

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null
                && request.horasClimatizacion() != null
                && request.horasClimatizacion() >= UMBRAL_CLIMATIZACION;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.AC;
    }
}
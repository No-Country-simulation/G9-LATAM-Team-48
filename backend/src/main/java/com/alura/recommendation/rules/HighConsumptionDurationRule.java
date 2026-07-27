package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Regla de recomendación para la actualización de infraestructura eléctrica.
 *
 * <p>Identifica perfiles con franjas de alto consumo muy prolongadas,
 * siendo candidatos ideales para amortizar la inversión en iluminación LED y sensores.</p>
 *
 * @author miyo
 * @version 1.0
 */
@Component
public class HighConsumptionDurationRule implements RecommendationRule {

    private static final int UMBRAL_HORAS_ALTO_CONSUMO = 10;

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null
                && request.horasAltoConsumo() != null
                && request.horasAltoConsumo() >= UMBRAL_HORAS_ALTO_CONSUMO;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.LED;
    }
}
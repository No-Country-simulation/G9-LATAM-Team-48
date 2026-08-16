package com.alura.recommendation.rules;

import com.alura.config.CalculationProperties;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Alerta cuando el consumo por persona supera el umbral configurado (variable SHAP derivada).
 */
@Component
public class HighOccupantConsumptionRule implements RecommendationRule {

    private final CalculationProperties calc;

    public HighOccupantConsumptionRule(CalculationProperties calc) {
        this.calc = calc;
    }

    @Override
    public boolean applies(RecommendationRequest request) {
        if (request == null || !request.requiresDetailedAnalysis() || request.consumoPorPersona() == null) {
            return false;
        }
        double threshold = calc.defaultConsumptionPerPerson().doubleValue();
        return request.consumoPorPersona() > threshold;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.OCCUPANCY;
    }
}

package com.alura.recommendation.rules;

import com.alura.config.CalculationProperties;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

@Component
public class InsulationFromFormRule implements RecommendationRule {

    private final CalculationProperties calc;

    public InsulationFromFormRule(CalculationProperties calc) {
        this.calc = calc;
    }

    @Override
    public boolean applies(RecommendationRequest request) {
        if (request == null || !request.requiresDetailedAnalysis()) {
            return false;
        }
        if (request.aislamientoTermico() != null) {
            String value = request.aislamientoTermico().trim();
            if (value.equalsIgnoreCase("Bueno") || value.equalsIgnoreCase("BUENO")) {
                return false;
            }
            return value.equalsIgnoreCase("Malo")
                    || value.equalsIgnoreCase("MALO")
                    || value.equalsIgnoreCase("Regular")
                    || value.equalsIgnoreCase("REGULAR");
        }
        if (request.factorAislamientoCalculado() != null) {
            return request.factorAislamientoCalculado()
                    >= calc.insulationFactorFair().doubleValue();
        }
        return false;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.INSULATION;
    }
}

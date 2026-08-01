package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

@Component
public class InsulationFromFormRule implements RecommendationRule {

    @Override
    public boolean applies(RecommendationRequest request) {
        if (request == null || request.aislamientoTermico() == null) {
            return false;
        }
        String value = request.aislamientoTermico().trim();
        if (value.equalsIgnoreCase("Bueno") || value.equalsIgnoreCase("BUENO")) {
            return false;
        }
        return value.equalsIgnoreCase("Malo")
                || value.equalsIgnoreCase("MALO")
                || value.equalsIgnoreCase("Regular")
                || value.equalsIgnoreCase("REGULAR");
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.INSULATION;
    }
}

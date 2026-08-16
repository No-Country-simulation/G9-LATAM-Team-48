package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

@Component
public class OldAppliancesRule implements RecommendationRule {

    private static final double UMBRAL_ANIOS = 8.0;

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null
                && request.antiguedadElectrodomesticosAnios() != null
                && request.antiguedadElectrodomesticosAnios() >= UMBRAL_ANIOS;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.REPLACE;
    }
}

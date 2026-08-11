package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

@Component
public class LedUpgradeRule implements RecommendationRule {

    private static final double UMBRAL_LED = 55.0;

    @Override
    public boolean applies(RecommendationRequest request) {
        Double pct = request != null ? request.effectivePctIluminacionLed() : null;
        return request != null
                && request.requiresDetailedAnalysis()
                && pct != null
                && pct < UMBRAL_LED;
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.LED;
    }
}

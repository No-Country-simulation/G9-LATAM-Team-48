package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Regla SHAP #6: Proporción de Iluminación LED.
 */
@Component
public class LedUpgradeRule implements RecommendationRule {

    private static final BigDecimal LOW_LED_THRESHOLD = new BigDecimal("0.50");

    @Override
    public boolean applies(RecommendationRequest request) {
        return request.getCategory() != null
            && request.getCategory().isRequiresDetailedAnalysis()
            && request.getProporcionIluminacionLed() != null
            && request.getProporcionIluminacionLed().compareTo(LOW_LED_THRESHOLD) < 0;
    }

    @Override
    public Optional<RecommendationItem> evaluate(RecommendationRequest request) {
        if (!applies(request)) {
            return Optional.empty();
        }
        
        String type = "INEFICIENTE".equals(request.getCategory().name()) ? "ALERTA" : "OPORTUNIDAD";
        
        return Optional.of(RecommendationItem.builder()
                .tipKey(TipKey.LED_UPGRADE_NEEDED)
                .type(type)
                .priority("MEDIUM")
                .build());
    }

    @Override
    public int getOrder() {
        return 20;
    }
}
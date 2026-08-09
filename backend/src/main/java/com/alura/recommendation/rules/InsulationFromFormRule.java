package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Regla SHAP #4: Factor de Aislamiento Térmico.
 */
@Component
public class InsulationFromFormRule implements RecommendationRule {

    private static final BigDecimal BAD_INSULATION_THRESHOLD = new BigDecimal("1.2");

    @Override
    public boolean applies(RecommendationRequest request) {
        return request.getCategory() != null 
            && request.getCategory().isRequiresDetailedAnalysis()
            && request.getFactorAislamiento() != null
            && request.getFactorAislamiento().compareTo(BAD_INSULATION_THRESHOLD) >= 0;
    }

    @Override
    public Optional<RecommendationItem> evaluate(RecommendationRequest request) {
        if (!applies(request)) {
            return Optional.empty();
        }
        
        String type = "INEFICIENTE".equals(request.getCategory().name()) ? "ALERTA" : "OPORTUNIDAD";
        
        return Optional.of(RecommendationItem.builder()
                .tipKey(TipKey.INSULATION_DEFICIENT)
                .type(type)
                .priority("HIGH")
                .build());
    }

    @Override
    public int getOrder() {
        return 10;
    }
}
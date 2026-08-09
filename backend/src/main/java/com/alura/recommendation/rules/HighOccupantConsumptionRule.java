package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Optional;

/**
 * Regla SHAP #1: Consumo histórico por persona.
 * Si el consumo per cápita es muy alto, dispara esta recomendación.
 */
@Component
public class HighOccupantConsumptionRule implements RecommendationRule {

    private static final BigDecimal HIGH_CONSUMPTION_PER_CAPITA_THRESHOLD = new BigDecimal("150.0");

    @Override
    public boolean applies(RecommendationRequest request) {
        return request.getCategory() != null
            && request.getCategory().isRequiresDetailedAnalysis()
            && request.getConsumoAnteriorPorPersona() != null
            && request.getConsumoAnteriorPorPersona().compareTo(HIGH_CONSUMPTION_PER_CAPITA_THRESHOLD) > 0;
    }

    @Override
    public Optional<RecommendationItem> evaluate(RecommendationRequest request) {
        if (!applies(request)) {
            return Optional.empty();
        }
        
        // Si el modelo dijo "INEFICIENTE", es una ALERTA crítica. Si es "MODERADO", es una OPORTUNIDAD preventiva.
        String type = "INEFICIENTE".equals(request.getCategory().name()) ? "ALERTA" : "OPORTUNIDAD";
        
        return Optional.of(RecommendationItem.builder()
                .tipKey(TipKey.HIGH_CONSUMPTION_PER_PERSON)
                .type(type)
                .priority("HIGH")
                .build());
    }

    @Override
    public int getOrder() {
        return 5;
    }
}
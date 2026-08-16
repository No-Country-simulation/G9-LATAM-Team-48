package com.alura.recommendation.rules;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

/**
 * Regla de recomendación para usuarios con perfiles de consumo moderado o medio.
 *
 * <p>Esta clase forma parte del motor de reglas bajo el patrón Strategy.
 * Evalúa si la categoría de consumo corresponde a un perfil medio y retorna
 * la clave corta correspondiente para que el frontend resuelva la traducción final.</p>
 *
 * @author miyo
 * @version 2.0
 */
@Component
public class MediumConsumptionRule implements RecommendationRule {

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null && ConsumptionCategory.MEDIUM.getModelValue().equalsIgnoreCase(request.category());
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.SHIFTS;
    }
}
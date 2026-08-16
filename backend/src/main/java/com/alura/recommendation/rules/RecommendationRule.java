package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;

/**
 * Interfaz para las reglas de recomendación.
 */
public interface RecommendationRule {

    /**
     * Evalúa si la regla aplica para el consumo dado.
     */
    boolean applies(RecommendationRequest request);

    /**
     * Devuelve la clave corta de recomendación.
     *
     * @param request contexto de evaluación
     * @return identificador tipado de la recomendación
     */
    TipKey evaluate(RecommendationRequest request);
}
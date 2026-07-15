package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;

/**
 * Orquesta la generacion de recomendaciones evaluando el conjunto de reglas
 * ({@code RecommendationRule}) aplicables al usuario.
 *
 * <p>Sin implementacion todavia.</p>
 */
public interface RecommendationService {

    /**
     * Genera las recomendaciones para el usuario segun su categoria de consumo.
     *
     * @param request contexto de evaluacion
     * @return recomendaciones generadas
     */
    RecommendationResponse generate(RecommendationRequest request);
}

package com.alura.prediction.dto;

import java.util.Map;

/**
 * Contrato de entrada del modulo de prediccion.
 *
 * <p>Representa los datos de consumo energetico que se enviaran al modelo de
 * Machine Learning para clasificar al usuario. La forma exacta de las
 * caracteristicas ({@code features}) se ajustara al contrato del servicio
 * FastAPI cuando se defina.</p>
 *
 * @param userId   identificador del usuario evaluado
 * @param features caracteristicas de consumo (clave -> valor) usadas por el modelo
 */
public record PredictionRequest(
        String userId,
        Map<String, Object> features
) {
}

package com.alura.prediction.client;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;

/**
 * Puerto de salida hacia el microservicio de Machine Learning.
 *
 * <p>Implementacion: {@link FastApiPredictionClient}.</p>
 */
public interface PredictionClient {

    /**
     * Envia las caracteristicas de consumo al modelo y devuelve la clasificacion.
     *
     * @param request datos de entrada para el modelo
     * @return resultado de la clasificacion
     */
    PredictionResponse predict(PredictionRequest request);
}

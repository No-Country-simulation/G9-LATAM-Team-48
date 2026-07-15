package com.alura.prediction.client;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;

/**
 * Abstraccion del cliente HTTP hacia el microservicio de Machine Learning (FastAPI).
 *
 * <p>Definir la prediccion como una interfaz permite:</p>
 * <ul>
 *     <li>Desacoplar la logica de negocio del detalle del transporte HTTP.</li>
 *     <li>Sustituir la implementacion (RestClient, WebClient, Feign) sin afectar
 *         al {@code PredictionService}.</li>
 *     <li>Proveer dobles de prueba (mocks/stubs) en los tests unitarios.</li>
 * </ul>
 *
 * <p>Sin implementacion todavia; ningun endpoint es consumido en esta etapa.</p>
 */
public interface PredictionClient {

    /**
     * Envia las caracteristicas de consumo al modelo y devuelve la clasificacion.
     *
     * @param request datos de entrada para el modelo
     * @return resultado de la prediccion
     */
    PredictionResponse predict(PredictionRequest request);
}

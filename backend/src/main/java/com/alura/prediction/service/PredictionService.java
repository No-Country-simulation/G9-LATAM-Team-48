package com.alura.prediction.service;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;

/**
 * Define la operación de clasificación de consumo energético.
 *
 * <p>La implementación actual utilizará reglas mock para permitir pruebas
 * locales. Más adelante podrá delegar en un modelo de Machine Learning sin
 * cambiar el controller.</p>
 */
public interface PredictionService {

    /**
     * Clasifica un consumo energético a partir de los datos ingresados.
     *
     * @param request datos validados de consumo e inmueble
     * @return categoría y confianza calculadas
     */
    PredictionResponse classify(PredictionRequest request);
}
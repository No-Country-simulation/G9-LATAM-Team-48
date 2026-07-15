package com.alura.prediction.service;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;

/**
 * Orquesta la logica de prediccion. Delegara en {@code PredictionClient} para
 * comunicarse con el servicio FastAPI y aplicara las reglas de negocio propias
 * del backend (validacion, enriquecimiento, manejo de errores).
 *
 * <p>Sin implementacion todavia.</p>
 */
public interface PredictionService {

    /**
     * Clasifica a un usuario a partir de sus datos de consumo.
     *
     * @param request datos de entrada
     * @return resultado de la clasificacion
     */
    PredictionResponse classify(PredictionRequest request);
}

package com.alura.prediction.service;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;

import java.util.Map;

/**
 * Orquesta la clasificacion de consumo hacia el servicio FastAPI.
 *
 * <p>Implementacion: {@code PredictionServiceImpl}.</p>
 */
public interface PredictionService {

    /**
     * Clasifica a partir del contrato {@code { userId, features }}.
     */
    PredictionResponse classify(PredictionRequest request);

    /**
     * Clasifica a partir del payload plano del formulario de Analisis IA.
     */
    PredictionResponse analyze(Map<String, Object> features);
}

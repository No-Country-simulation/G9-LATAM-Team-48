package com.alura.prediction.service;

import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Implementación temporal de predicción basada en reglas simples.
 *
 * <p>Permite probar el flujo completo de la API mientras se integra el
 * modelo real de Machine Learning.</p>
 */
@Service
public class MockPredictionService implements PredictionService {

    @Override
    public PredictionResponse classify(PredictionRequest request) {
        int score = 0;

        if (request.consumoKwh() >= 500) {
            score += 2;
        } else if (request.consumoKwh() >= 250) {
            score++;
        }

        if (Boolean.TRUE.equals(request.usoHorarioPico())) {
            score++;
        }

        if (request.horasAltoConsumo() >= 8) {
            score++;
        }

        if (request.cantidadEquipos() >= 10) {
            score++;
        }


        if (score >= 3) {
            return new PredictionResponse(
                    null, "inefficient", "ALTO", 0.85, 0, List.of(), 0.0
            );
        }

        if (score >= 1) {
            return new PredictionResponse(
                    null, "moderate", "MODERADO", 0.75, 0, List.of(), 0.0
            );
        }

        return new PredictionResponse(
                null, "efficient", "BAJO", 0.90, 0, List.of(), 0.0
        );
    }

    @Override
    public PredictionResponse analyze(Map<String, Object> features) {
        // Fail-Fast (Opción A): Previene el uso accidental del flujo viejo.
        throw new UnsupportedOperationException(
                "El flujo de predicción basado en Map está deprecado en el mock. Utilice classify(PredictionRequest)."
        );
    }
}
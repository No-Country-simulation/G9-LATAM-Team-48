package com.alura.prediction.service;

import com.alura.prediction.client.PredictionClient;
import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@Primary
public class PredictionServiceImpl implements PredictionService {

    private final PredictionClient predictionClient;

    public PredictionServiceImpl(PredictionClient predictionClient) {
        this.predictionClient = predictionClient;
    }

    @Override
    public PredictionResponse classify(PredictionRequest request) {
        // 1. Llamamos a FastAPI enviando el DTO limpio (Camino A)
        PredictionResponse mlResponse = predictionClient.predict(request);

        // 2. Mapeamos el nivelKey según la categoría que devuelva Python
        String nivelKey = switch (mlResponse.category().toUpperCase()) {
            case "BAJO" -> "efficient";
            case "MODERADO" -> "moderate";
            case "ALTO" -> "inefficient";
            default -> "unknown";
        };

        // 3. Ensamblamos la respuesta completa para no romper el frontend.
        // Los datos faltantes (ahorro, tips) se llenan con neutros por ahora.
        return new PredictionResponse(
                null,                  // userId (lo maneja el controller por JWT)
                nivelKey,              // nivelKey deducido
                mlResponse.category(), // categoría del modelo
                mlResponse.confidence(), // confianza del modelo
                0,                     // ahorro (pendiente de cálculo)
                List.of(),             // tipKeys (lo debe llenar RecommendationService)
                0.0                    // benchmark (pendiente de cálculo)
        );
    }

    @Override
    public PredictionResponse analyze(Map<String, Object> features) {
        throw new UnsupportedOperationException(
                "El flujo de Map está deprecado. Utilice classify(PredictionRequest)."
        );
    }
}
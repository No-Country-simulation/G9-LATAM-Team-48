package com.alura.prediction.service;

import com.alura.common.exception.MlServiceUnavailableException;
import com.alura.prediction.client.PredictionClient;
import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PredictionServiceImpl implements PredictionService {

    private static final Logger log = LoggerFactory.getLogger(PredictionServiceImpl.class);

    private final PredictionClient predictionClient;

    public PredictionServiceImpl(PredictionClient predictionClient) {
        this.predictionClient = predictionClient;
    }

    @Override
    public PredictionResponse classify(PredictionRequest request) {
        if (request == null || request.features() == null || request.features().isEmpty()) {
            throw new IllegalArgumentException("features are required");
        }
        try {
            return predictionClient.predict(request);
        } catch (MlServiceUnavailableException ex) {
            // Prod mal configurado: PREDICTION_API_BASE_URL apunta a localhost sin ML.
            log.warn("ML no disponible; usando fallback heuristico: {}", ex.getMessage());
            return HeuristicPrediction.fromFeatures(request.features());
        }
    }

    @Override
    public PredictionResponse analyze(Map<String, Object> features) {
        return classify(new PredictionRequest(null, features));
    }

    @Override
    public PredictionResponse analyzeHeuristic(Map<String, Object> features) {
        if (features == null || features.isEmpty()) {
            throw new IllegalArgumentException("features are required");
        }
        return HeuristicPrediction.fromFeatures(features);
    }
}

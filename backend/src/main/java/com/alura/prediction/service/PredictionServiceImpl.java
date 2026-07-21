package com.alura.prediction.service;

import com.alura.prediction.client.PredictionClient;
import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class PredictionServiceImpl implements PredictionService {

    private final PredictionClient predictionClient;

    public PredictionServiceImpl(PredictionClient predictionClient) {
        this.predictionClient = predictionClient;
    }

    @Override
    public PredictionResponse classify(PredictionRequest request) {
        if (request == null || request.features() == null || request.features().isEmpty()) {
            throw new IllegalArgumentException("features are required");
        }
        return predictionClient.predict(request);
    }

    @Override
    public PredictionResponse analyze(Map<String, Object> features) {
        return classify(new PredictionRequest(null, features));
    }
}

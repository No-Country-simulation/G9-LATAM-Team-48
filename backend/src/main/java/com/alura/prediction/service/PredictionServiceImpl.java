package com.alura.prediction.service;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.prediction.client.PredictionClient;
import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import com.alura.recommendation.service.RecommendationService;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@Primary
public class PredictionServiceImpl implements PredictionService {

    private final PredictionClient predictionClient;
    private final RecommendationService recommendationService;

    public PredictionServiceImpl(PredictionClient predictionClient, RecommendationService recommendationService) {
        this.predictionClient = predictionClient;
        this.recommendationService = recommendationService;
    }

    @Override
    public PredictionResponse classify(PredictionRequest request) {
        // 1. Llamamos a FastAPI (Python)
        PredictionResponse mlResponse = predictionClient.predict(request);

        // 2. Mapeamos el nivelKey usando las constantes centralizadas
        String nivelKey = ConsumptionCategory.getFrontendKeyFor(mlResponse.category());

        // 3. Armamos el contrato de recomendaciones
        RecommendationRequest recRequest = new RecommendationRequest(
                null,
                mlResponse.category(),
                request.tipoInmueble(),
                request.cantidadEquipos(),
                request.horasClimatizacion(),
                request.horasAltoConsumo(),
                request.usoHorarioPico()
        );

        RecommendationResponse recResponse = recommendationService.generate(recRequest);

        // 4. Ensamblamos la respuesta completa para el Frontend
        return new PredictionResponse(
                null,
                mlResponse.category(),
                nivelKey,
                mlResponse.confidence(),
                0,
                recResponse.recommendations(),
                0.0
        );
    }

    @Override
    public PredictionResponse analyze(Map<String, Object> features) {
        throw new UnsupportedOperationException(
                "El flujo de Map está deprecado. Utilice classify(PredictionRequest)."
        );
    }
}
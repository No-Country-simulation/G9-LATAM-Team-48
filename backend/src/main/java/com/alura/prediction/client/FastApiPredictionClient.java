package com.alura.prediction.client;

import com.alura.common.exception.MlServiceUnavailableException;
import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;

/**
 * Cliente HTTP hacia el microservicio FastAPI ({@code ml-service}).
 */
@Component
public class FastApiPredictionClient implements PredictionClient {

    private final RestClient predictionRestClient;

    public FastApiPredictionClient(RestClient predictionRestClient) {
        this.predictionRestClient = predictionRestClient;
    }

    @Override
    public PredictionResponse predict(PredictionRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", request.userId());
        body.put("features", request.features());

        try {
            PredictionResponse response = predictionRestClient.post()
                    .uri("/predict")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(PredictionResponse.class);

            if (response == null) {
                throw new MlServiceUnavailableException("Respuesta vacia del servicio ML");
            }
            return response;
        } catch (RestClientException ex) {
            throw new MlServiceUnavailableException(
                    "Servicio ML no disponible en " + "PREDICTION_API_BASE_URL: " + ex.getMessage(),
                    ex);
        }
    }
}

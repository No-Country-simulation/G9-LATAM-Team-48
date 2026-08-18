package com.alura.prediction.client;

import com.alura.common.exception.MlServiceUnavailableException;
import com.alura.prediction.dto.PredictionRequest;
import com.alura.prediction.dto.PredictionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.Map;

/**
 * Cliente HTTP hacia el microservicio FastAPI ({@code ml-service}).
 *
 * <p>Render Free duerme la instancia: el primer intento tras el cold start puede
 * fallar o vencer el timeout. Se reintenta antes de declarar el ML caido para no
 * degradar el analisis a la heuristica cuando el modelo si esta disponible.</p>
 */
@Component
public class FastApiPredictionClient implements PredictionClient {

    private static final Logger log = LoggerFactory.getLogger(FastApiPredictionClient.class);

    private final RestClient predictionRestClient;
    private final int maxAttempts;
    private final long retryDelayMs;

    public FastApiPredictionClient(
            RestClient predictionRestClient,
            @Value("${prediction.api.max-attempts:3}") int maxAttempts,
            @Value("${prediction.api.retry-delay:2000}") long retryDelayMs) {
        this.predictionRestClient = predictionRestClient;
        this.maxAttempts = Math.max(1, maxAttempts);
        this.retryDelayMs = Math.max(0, retryDelayMs);
    }

    @Override
    public PredictionResponse predict(PredictionRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("userId", request.userId());
        body.put("features", request.features());

        RestClientException lastError = null;

        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                PredictionResponse response = predictionRestClient.post()
                        .uri("/predict")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(PredictionResponse.class);

                if (response == null) {
                    throw new MlServiceUnavailableException("Respuesta vacia del servicio ML");
                }
                if (attempt > 1) {
                    log.info("ML respondio en el intento {}/{}", attempt, maxAttempts);
                }
                return response;
            } catch (RestClientException ex) {
                lastError = ex;
                log.warn("Intento {}/{} contra el ML fallo: {}", attempt, maxAttempts, ex.getMessage());
                if (attempt < maxAttempts) {
                    sleepBeforeRetry();
                }
            }
        }

        throw new MlServiceUnavailableException(
                "Servicio ML no disponible en PREDICTION_API_BASE_URL tras " + maxAttempts
                        + " intentos: " + (lastError != null ? lastError.getMessage() : "sin detalle"),
                lastError);
    }

    private void sleepBeforeRetry() {
        if (retryDelayMs == 0) {
            return;
        }
        try {
            Thread.sleep(retryDelayMs);
        } catch (InterruptedException ie) {
            Thread.currentThread().interrupt();
        }
    }
}

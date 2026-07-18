package com.alura.analisis.controller;

import com.alura.prediction.dto.PredictionResponse;
import com.alura.prediction.service.PredictionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * API del Analisis Inteligente IA usada por el frontend.
 *
 * <p>Modulo aparte: solo depende de {@link PredictionService}. El resto del
 * backend (auth, recomendaciones, costos) no se ve afectado.</p>
 */
@RestController
@RequestMapping("/api/analisis")
@Tag(name = "Analisis IA", description = "Clasificacion de consumo (casa / fabrica) via modelo ML")
public class AnalisisController {

    private final PredictionService predictionService;

    public AnalisisController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping
    @Operation(
            summary = "Analizar consumo",
            description = """
                    Recibe el payload plano del formulario (tipo + campos) y
                    delega en el modelo FastAPI. Respuesta alineada al frontend:
                    nivelKey, ahorro, tipKeys, benchmark, confidence.
                    """)
    public ResponseEntity<PredictionResponse> analizar(@RequestBody Map<String, Object> datos) {
        if (datos == null || datos.isEmpty()) {
            throw new IllegalArgumentException("El body del analisis no puede estar vacio");
        }
        if (datos.get("consumo") == null) {
            throw new IllegalArgumentException("El campo 'consumo' es obligatorio");
        }
        return ResponseEntity.ok(predictionService.analyze(datos));
    }
}

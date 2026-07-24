package com.alura.analisis.controller;

import com.alura.analisis.dto.AdminAnalisisItem;
import com.alura.analisis.dto.AnalisisApiResponse;
import com.alura.analisis.dto.AnalisisPayload;
import com.alura.analisis.service.AnalisisService;
import com.alura.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * API del Analisis Inteligente IA.
 *
 * <p>POST publico: siempre guarda la consulta. Si hay Bearer JWT, asocia usuario
 * y encola el email; si no, persiste como anonima ({@code emailStatus=SKIPPED}).</p>
 * <p>GET /mis: historial del usuario autenticado.</p>
 */
@RestController
@RequestMapping("/api/analisis")
@Tag(name = "Analisis IA", description = "Clasificacion de consumo (guarda siempre; historial con login)")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    @PostMapping
    @Operation(
            summary = "Analizar consumo",
            description = """
                    Valida el contrato tipado del formulario, ejecuta el modelo ML
                    (o heuristica) y persiste la consulta.
                    Con Bearer token: asocia al usuario y envia el resultado por email.
                    Sin login: guarda la consulta anonima (sin email).
                    """,
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<AnalisisApiResponse> analizar(@Valid @RequestBody AnalisisPayload payload) {
        return ResponseEntity.ok(analisisService.analizarYGuardar(payload.toFeatureMap()));
    }

    @GetMapping("/mis")
    @Operation(
            summary = "Historial de Analisis IA del usuario",
            description = "Lista las consultas de analisis_consultas asociadas al email del JWT.",
            security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<List<AdminAnalisisItem>>> misConsultas() {
        return ResponseEntity.ok(ApiResponse.ok(analisisService.listarMisConsultas()));
    }
}

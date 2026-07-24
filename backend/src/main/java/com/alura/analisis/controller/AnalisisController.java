package com.alura.analisis.controller;

import com.alura.analisis.dto.AnalisisApiResponse;
import com.alura.analisis.dto.AnalisisPayload;
import com.alura.analisis.service.AnalisisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * API del Analisis Inteligente IA.
 *
 * <p>Publico: siempre guarda la consulta. Si hay Bearer JWT, asocia usuario
 * y encola el email; si no, persiste como anonima ({@code emailStatus=SKIPPED}).</p>
 */
@RestController
@RequestMapping("/api/analisis")
@Tag(name = "Analisis IA", description = "Clasificacion de consumo (guarda siempre; email si hay login)")
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
}

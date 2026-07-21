package com.alura.analisis.controller;

import com.alura.analisis.dto.AnalisisApiResponse;
import com.alura.analisis.service.AnalisisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * API del Analisis Inteligente IA.
 *
 * <p>Requiere JWT. Guarda la consulta en {@code analisis_consultas} y encola
 * el envio del resultado por email al usuario autenticado.</p>
 */
@RestController
@RequestMapping("/api/analisis")
@Tag(name = "Analisis IA", description = "Clasificacion de consumo (requiere login)")
@SecurityRequirement(name = "bearerAuth")
public class AnalisisController {

    private final AnalisisService analisisService;

    public AnalisisController(AnalisisService analisisService) {
        this.analisisService = analisisService;
    }

    @PostMapping
    @Operation(
            summary = "Analizar consumo (autenticado)",
            description = """
                    Requiere Bearer token. Ejecuta el modelo ML, persiste la consulta
                    y deja el email en estado PENDING para envio posterior.
                    """)
    public ResponseEntity<AnalisisApiResponse> analizar(@RequestBody Map<String, Object> datos) {
        return ResponseEntity.ok(analisisService.analizarYGuardar(datos));
    }
}

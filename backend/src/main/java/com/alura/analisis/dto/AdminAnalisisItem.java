package com.alura.analisis.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Fila del listado admin de consultas Analisis IA.
 */
public record AdminAnalisisItem(
        Long id,
        Long userId,
        String userEmail,
        String tipoInstalacion,
        String nivelKey,
        Integer ahorro,
        Double confidence,
        Double benchmark,
        List<String> tipKeys,
        String emailStatus,
        LocalDateTime createdAt,
        Map<String, Object> requestJson,
        Map<String, Object> responseJson
) {
}

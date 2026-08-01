package com.alura.analisis.dto;

import java.time.LocalDateTime;

/**
 * Punto ligero para gráficos del historial del usuario (sin JSON completo).
 */
public record AnalisisChartPoint(
        Long id,
        LocalDateTime createdAt,
        Double consumoKwh,
        Integer ahorro,
        String nivelKey
) {
}

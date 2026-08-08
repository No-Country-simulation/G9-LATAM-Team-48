package com.alura.analytics.dto;

/**
 * Un segmento del dataset (p. ej. tipo de inmueble) con consumo promedio.
 */
public record AnalyticsBreakdownItem(
        String segment,
        int avgKwh,
        long sampleCount
) {
}

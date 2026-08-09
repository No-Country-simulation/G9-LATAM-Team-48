package com.alura.analytics.dto;

import java.util.List;

/**
 * Contrato alineado a {@code GET /api/analytics/overview} (frontend analyticsService).
 */
public record AnalyticsOverviewDto(
        List<String> months,
        List<Integer> actualKwh,
        List<Integer> predictedKwh,
        List<Integer> peakKwh,
        List<Integer> offPeakKwh,
        String category,
        double confidence,
        List<Integer> cost,
        boolean fromDataset
) {
}

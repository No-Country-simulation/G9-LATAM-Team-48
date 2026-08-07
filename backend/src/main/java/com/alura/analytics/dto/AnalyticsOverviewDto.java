package com.alura.analytics.dto;

import java.util.List;

/**
 * Contrato alineado a {@code frontend/src/data/analyticsMock.js} y {@code GET /api/analytics/overview}.
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

package com.alura.analytics.dto;

import java.util.List;

public record AnalyticsBreakdownDto(
        String dimension,
        List<AnalyticsBreakdownItem> items,
        boolean fromDataset
) {
}

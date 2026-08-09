package com.alura.dataset;

import com.alura.analytics.dto.AnalyticsOverviewDto;
import com.alura.consumo.dto.ConsumoMensual;

import java.util.List;

/**
 * Serie demo de 12 meses (benchmark calendario), alineada al copy del dashboard
 * ({@code kpiAllMonthsHint}) cuando MySQL no tiene {@code dataset_feature_engineering}.
 */
public final class DatasetDemoFallback {

    private static final List<String> MONTHS = List.of(
            "january",
            "february",
            "march",
            "april",
            "may",
            "june",
            "july",
            "august",
            "september",
            "october",
            "november",
            "december");

    /** kWh por mes; suma ≈ 9025 (media ~752). */
    private static final List<Integer> ACTUAL_KWH =
            List.of(680, 710, 750, 800, 780, 760, 740, 770, 790, 720, 730, 795);

    private static final List<Integer> PREDICTED_KWH =
            List.of(670, 705, 745, 790, 775, 755, 735, 765, 785, 715, 725, 788);

    private static final List<ConsumoMensual> CONSUMOS = buildConsumos();

    private DatasetDemoFallback() {}

    public static List<ConsumoMensual> consumos() {
        return CONSUMOS;
    }

    public static AnalyticsOverviewDto analyticsOverview() {
        List<Integer> peak = ACTUAL_KWH.stream().map(v -> (int) Math.round(v * 0.35)).toList();
        List<Integer> offPeak = ACTUAL_KWH.stream()
                .map(v -> v - (int) Math.round(v * 0.35))
                .toList();
        List<Integer> cost = ACTUAL_KWH.stream().map(v -> (int) Math.round(v * 0.75)).toList();
        return new AnalyticsOverviewDto(
                MONTHS,
                ACTUAL_KWH,
                PREDICTED_KWH,
                peak,
                offPeak,
                "MEDIUM_CONSUMPTION",
                0.87,
                cost,
                false);
    }

    private static List<ConsumoMensual> buildConsumos() {
        return java.util.stream.IntStream.range(0, MONTHS.size())
                .mapToObj(i -> new ConsumoMensual(
                        MONTHS.get(i),
                        ACTUAL_KWH.get(i),
                        (int) Math.round(ACTUAL_KWH.get(i) * 0.75)))
                .toList();
    }
}

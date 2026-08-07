package com.alura.analytics.service;

import com.alura.analytics.dto.AnalyticsOverviewDto;
import com.alura.dataset.DatasetFeatureEngineeringDao;
import com.alura.dataset.DatasetMonthKeys;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class AnalyticsService {

    private static final AnalyticsOverviewDto FALLBACK = new AnalyticsOverviewDto(
            List.of("january", "february", "march", "april", "may", "june"),
            List.of(320, 340, 310, 360, 350, 380),
            List.of(315, 335, 325, 355, 365, 390),
            List.of(95, 110, 88, 125, 118, 140),
            List.of(225, 230, 222, 235, 232, 240),
            "MEDIUM_CONSUMPTION",
            0.87,
            List.of(240, 255, 232, 270, 262, 285),
            false
    );

    private final DatasetFeatureEngineeringDao datasetDao;

    public AnalyticsService(DatasetFeatureEngineeringDao datasetDao) {
        this.datasetDao = datasetDao;
    }

    public AnalyticsOverviewDto overview() {
        if (!datasetDao.hasRows()) {
            return FALLBACK;
        }

        List<Map<String, Object>> actualRows = datasetDao.avgActualVsAnteriorByMesNumero();
        List<Map<String, Object>> peakRows = datasetDao.avgPeakOffPeakByMesNumero();
        if (actualRows.isEmpty()) {
            return FALLBACK;
        }

        Map<Integer, Map<String, Object>> peakByMes = indexByMes(peakRows);

        List<String> months = new ArrayList<>();
        List<Integer> actualKwh = new ArrayList<>();
        List<Integer> predictedKwh = new ArrayList<>();
        List<Integer> peakKwh = new ArrayList<>();
        List<Integer> offPeakKwh = new ArrayList<>();
        List<Integer> cost = new ArrayList<>();

        for (Map<String, Object> row : actualRows) {
            int mes = intValue(row.get("mes_numero"));
            int actual = round(row.get("actual_kwh"));
            int predicted = round(row.get("predicted_kwh"));
            months.add(DatasetMonthKeys.fromMesNumero(mes));
            actualKwh.add(actual);
            predictedKwh.add(predicted);
            cost.add((int) Math.round(actual * 0.75));

            Map<String, Object> peakRow = peakByMes.get(mes);
            if (peakRow != null) {
                peakKwh.add(round(peakRow.get("peak_kwh")));
                offPeakKwh.add(round(peakRow.get("off_peak_kwh")));
            } else {
                peakKwh.add((int) Math.round(actual * 0.35));
                offPeakKwh.add(actual - peakKwh.get(peakKwh.size() - 1));
            }
        }

        String category = mapCategory(datasetDao.dominantPerfilEnergetico().orElse("Moderado"));
        double confidence = normalizeConfidence(datasetDao.avgCalidadRegistro().orElse(0.87));

        return new AnalyticsOverviewDto(
                List.copyOf(months),
                List.copyOf(actualKwh),
                List.copyOf(predictedKwh),
                List.copyOf(peakKwh),
                List.copyOf(offPeakKwh),
                category,
                confidence,
                List.copyOf(cost),
                true
        );
    }

    private static Map<Integer, Map<String, Object>> indexByMes(List<Map<String, Object>> rows) {
        Map<Integer, Map<String, Object>> map = new HashMap<>();
        for (Map<String, Object> row : rows) {
            map.put(intValue(row.get("mes_numero")), row);
        }
        return map;
    }

    private static int intValue(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 0;
    }

    private static int round(Object value) {
        if (value instanceof Number number) {
            return (int) Math.round(number.doubleValue());
        }
        return 0;
    }

    private static String mapCategory(String perfil) {
        String normalized = perfil == null ? "" : perfil.trim().toLowerCase(Locale.ROOT);
        if (normalized.contains("eficiente")) {
            return "LOW_CONSUMPTION";
        }
        if (normalized.contains("ineficiente")) {
            return "HIGH_CONSUMPTION";
        }
        return "MEDIUM_CONSUMPTION";
    }

    private static double normalizeConfidence(double raw) {
        double value = raw;
        if (value > 1.0) {
            value = value / 100.0;
        }
        if (value <= 0 || Double.isNaN(value)) {
            return 0.87;
        }
        return Math.min(0.99, Math.max(0.5, value));
    }
}

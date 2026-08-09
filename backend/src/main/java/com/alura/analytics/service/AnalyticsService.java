package com.alura.analytics.service;

import com.alura.analytics.dto.AnalyticsBreakdownDto;
import com.alura.analytics.dto.AnalyticsBreakdownItem;
import com.alura.analytics.dto.AnalyticsOverviewDto;
import com.alura.dataset.DatasetFeatureEngineeringDao;
import com.alura.dataset.DatasetMonthKeys;
import com.alura.dataset.DatasetTipoInmuebleFilter;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

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

    private static final AnalyticsBreakdownDto FALLBACK_BREAKDOWN = new AnalyticsBreakdownDto(
            "tipo_inmueble",
            List.of(
                    new AnalyticsBreakdownItem("Casa Unifamiliar", 350, 120),
                    new AnalyticsBreakdownItem("Apartamento", 285, 95),
                    new AnalyticsBreakdownItem("Pequeño Establecimiento Comercial", 410, 60)
            ),
            false
    );

    private final DatasetFeatureEngineeringDao datasetDao;

    public AnalyticsService(DatasetFeatureEngineeringDao datasetDao) {
        this.datasetDao = datasetDao;
    }

    public AnalyticsOverviewDto overview(String tipoInmueble) {
        if (!datasetDao.hasRows()) {
            return scaleOverviewFallback(tipoInmueble);
        }

        List<Map<String, Object>> actualRows = datasetDao.avgActualVsAnteriorByMesNumero(tipoInmueble);
        List<Map<String, Object>> peakRows = datasetDao.avgPeakOffPeakByMesNumero(tipoInmueble);
        if (actualRows.isEmpty()) {
            return scaleOverviewFallback(tipoInmueble);
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

    public AnalyticsBreakdownDto breakdownByTipoInmueble(List<String> monthKeys, String tipoInmueble) {
        if (!datasetDao.hasRows()) {
            return filterBreakdownFallback(tipoInmueble);
        }
        List<Integer> mesNumeros = parseMesNumeros(monthKeys);
        List<Map<String, Object>> rows = datasetDao.avgConsumoByTipoInmueble(mesNumeros, tipoInmueble);
        if (rows.isEmpty()) {
            return filterBreakdownFallback(tipoInmueble);
        }
        List<AnalyticsBreakdownItem> items = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            String segment = String.valueOf(row.get("segment"));
            int avg = round(row.get("avg_kwh"));
            long samples = longValue(row.get("samples"));
            items.add(new AnalyticsBreakdownItem(segment, avg, samples));
        }
        return new AnalyticsBreakdownDto("tipo_inmueble", List.copyOf(items), true);
    }

    private static AnalyticsOverviewDto scaleOverviewFallback(String tipoInmueble) {
        double factor = DatasetTipoInmuebleFilter.demoScaleFactor(tipoInmueble);
        if (factor == 1.0) {
            return FALLBACK;
        }
        return new AnalyticsOverviewDto(
                FALLBACK.months(),
                scaleInts(FALLBACK.actualKwh(), factor),
                scaleInts(FALLBACK.predictedKwh(), factor),
                scaleInts(FALLBACK.peakKwh(), factor),
                scaleInts(FALLBACK.offPeakKwh(), factor),
                FALLBACK.category(),
                FALLBACK.confidence(),
                scaleInts(FALLBACK.cost(), factor),
                false);
    }

    private static AnalyticsBreakdownDto filterBreakdownFallback(String tipoInmueble) {
        List<String> tipos = DatasetTipoInmuebleFilter.parseParam(tipoInmueble);
        if (tipos.isEmpty() || tipos.size() >= DatasetTipoInmuebleFilter.allKeys().size()) {
            return FALLBACK_BREAKDOWN;
        }
        Set<String> segments = tipos.stream()
                .map(DatasetTipoInmuebleFilter::segmentLabel)
                .collect(java.util.stream.Collectors.toSet());
        List<AnalyticsBreakdownItem> filtered = FALLBACK_BREAKDOWN.items().stream()
                .filter(item -> segments.contains(item.segment()))
                .toList();
        if (filtered.isEmpty()) {
            return FALLBACK_BREAKDOWN;
        }
        return new AnalyticsBreakdownDto(FALLBACK_BREAKDOWN.dimension(), filtered, false);
    }

    private static List<Integer> scaleInts(List<Integer> values, double factor) {
        return values.stream().map(v -> (int) Math.round(v * factor)).toList();
    }

    private static List<Integer> parseMesNumeros(List<String> monthKeys) {
        if (monthKeys == null || monthKeys.isEmpty()) {
            return List.of();
        }
        List<Integer> mesNumeros = new ArrayList<>();
        for (String key : monthKeys) {
            DatasetMonthKeys.mesNumeroFromKey(key).ifPresent(mesNumeros::add);
        }
        return mesNumeros;
    }

    private static long longValue(Object value) {
        if (value instanceof Number number) {
            return number.longValue();
        }
        return 0L;
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

package com.alura.analytics.controller;

import com.alura.analytics.dto.AnalyticsBreakdownDto;
import com.alura.analytics.dto.AnalyticsOverviewDto;
import com.alura.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Agregados del dataset de Data Science para gráficos del dashboard")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    @Operation(summary = "Overview para gráficos Real vs predicción y pico/valle")
    public ResponseEntity<AnalyticsOverviewDto> overview() {
        return ResponseEntity.ok(analyticsService.overview());
    }

    @GetMapping("/breakdown")
    @Operation(summary = "Promedio de kWh por segmento del dataset (tipo de inmueble)")
    public ResponseEntity<AnalyticsBreakdownDto> breakdown(
            @RequestParam(defaultValue = "tipo_inmueble") String dimension,
            @RequestParam(required = false) String months) {
        if (!"tipo_inmueble".equalsIgnoreCase(dimension)) {
            return ResponseEntity.badRequest().build();
        }
        List<String> monthKeys = months == null || months.isBlank()
                ? List.of()
                : Arrays.stream(months.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList();
        return ResponseEntity.ok(analyticsService.breakdownByTipoInmueble(monthKeys));
    }
}

package com.alura.analytics.controller;

import com.alura.analytics.dto.AnalyticsOverviewDto;
import com.alura.analytics.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

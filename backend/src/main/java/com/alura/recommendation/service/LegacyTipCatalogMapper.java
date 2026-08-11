package com.alura.recommendation.service;

import org.springframework.stereotype.Component;

import java.util.Locale;
import java.util.Map;

/**
 * Enlaza tip keys cortas del motor de reglas / ML con entradas del catálogo V2 (Flyway V11).
 */
@Component
public class LegacyTipCatalogMapper {

    private static final Map<String, String> LEGACY_TO_CATALOG_TIP_KEY = Map.ofEntries(
            Map.entry("ac", "AIR_CONDITIONING_OPTIMIZATION"),
            Map.entry("house", "HIGH_CONSUMPTION_BASE"),
            Map.entry("apartment", "MEDIUM_CONSUMPTION_BASE"),
            Map.entry("commercial", "COMMERCIAL_OFF_HOURS_USE"),
            Map.entry("schedules", "PEAK_HOUR_SHIFT"),
            Map.entry("peak", "PEAK_HOUR_SHIFT"),
            Map.entry("standby", "STANDBY_POWER_DRAIN"),
            Map.entry("led", "LED_UPGRADE_NEEDED"),
            Map.entry("replace", "OUTDATED_LIGHTING_TECHNOLOGY"),
            Map.entry("insulation", "INSULATION_DEFICIENT"),
            Map.entry("appliances", "HIGH_EQUIPMENT_DENSITY"),
            Map.entry("shifts", "PEAK_HOUR_SHIFT"),
            Map.entry("monitor", "LOW_CONSUMPTION_BASE"),
            Map.entry("keep", "LOW_CONSUMPTION_BASE"),
            Map.entry("occupancy", "HIGH_CONSUMPTION_PER_PERSON"),
            Map.entry("default", "MEDIUM_CONSUMPTION_BASE"));

    public String catalogTipKeyForLegacy(String legacyTip) {
        if (legacyTip == null || legacyTip.isBlank()) {
            return LEGACY_TO_CATALOG_TIP_KEY.get("default");
        }
        String normalized = legacyTip.trim().toLowerCase(Locale.ROOT);
        return LEGACY_TO_CATALOG_TIP_KEY.getOrDefault(normalized, toUpperSnake(normalized));
    }

    private static String toUpperSnake(String legacy) {
        return legacy.toUpperCase(Locale.ROOT);
    }
}

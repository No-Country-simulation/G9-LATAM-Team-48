package com.alura.common.enums;

import com.alura.recommendation.dto.TipKey;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum ConsumptionCategory {

    INEFICIENTE("ALTO", "inefficient", TipKey.HIGH_CONSUMPTION_BASE, true),
    MODERADO("MODERADO", "moderate", TipKey.MEDIUM_CONSUMPTION_BASE, true),
    EFICIENTE("BAJO", "efficient", TipKey.LOW_CONSUMPTION_BASE, false);

    private final String modelValue;
    private final String frontendKey;
    private final TipKey baseTipKey;
    private final boolean requiresDetailedAnalysis;

    ConsumptionCategory(String modelValue, String frontendKey, TipKey baseTipKey, boolean requiresDetailedAnalysis) {
        this.modelValue = modelValue;
        this.frontendKey = frontendKey;
        this.baseTipKey = baseTipKey;
        this.requiresDetailedAnalysis = requiresDetailedAnalysis;
    }

    public static ConsumptionCategory fromModelValue(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            return MODERADO;
        }
        String normalized = rawValue.trim().toUpperCase();
        return Arrays.stream(values())
                .filter(cat -> cat.modelValue.equalsIgnoreCase(normalized))
                .findFirst()
                .orElse(MODERADO);
    }
}
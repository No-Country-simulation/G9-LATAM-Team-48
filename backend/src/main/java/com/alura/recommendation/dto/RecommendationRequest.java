package com.alura.recommendation.dto;

import com.alura.common.enums.ConsumptionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {

    private String userId; // Cambiado de Long a String para soportar emails o tokens de sesión nativamente
    private Long consultaId;
    private ConsumptionCategory category;
    
    // Variables SHAP Dominantes
    private BigDecimal consumoAnteriorPorPersona;
    private BigDecimal factorAislamiento; 
    private BigDecimal proporcionIluminacionLed; 
    private BigDecimal consumoKwhMensual;
}
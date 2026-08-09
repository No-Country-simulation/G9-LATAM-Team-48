package com.alura.consumo.dto;

import java.util.List;

/** Respuesta alineada al frontend: serie mensual + origen dataset vs demo. */
public record ConsumoListDto(boolean fromDataset, List<ConsumoMensual> consumos) {}

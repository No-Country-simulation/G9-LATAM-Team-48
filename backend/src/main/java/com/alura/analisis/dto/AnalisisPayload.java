package com.alura.analisis.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Contrato tipado del formulario Analisis IA (alineado con el DTO de prediccion del equipo).
 *
 * <p>Campos: tipo de inmueble, superficie, consumo, equipos, personas, climatizacion,
 * alto consumo y uso en horario pico.</p>
 */
public record AnalisisPayload(
        @NotBlank(message = "El tipo de inmueble es obligatorio.")
        String tipoInmueble,

        @NotNull(message = "El area es obligatoria.")
        @Positive(message = "El area debe ser mayor a cero.")
        Integer areaM2,

        @NotNull(message = "El consumo es obligatorio.")
        @Positive(message = "El consumo debe ser mayor a cero.")
        Integer consumoKwh,

        @NotNull(message = "La cantidad de equipos es obligatoria.")
        @PositiveOrZero(message = "La cantidad de equipos no puede ser negativa.")
        Integer cantidadEquipos,

        @NotNull(message = "La cantidad de personas es obligatoria.")
        @PositiveOrZero(message = "La cantidad de personas no puede ser negativa.")
        Integer cantidadPersonas,

        @NotNull(message = "Las horas de climatizacion son obligatorias.")
        @Min(value = 0, message = "Las horas de climatizacion no pueden ser negativas.")
        @Max(value = 24, message = "Las horas de climatizacion no pueden superar 24.")
        Integer horasClimatizacion,

        @NotNull(message = "Las horas de alto consumo son obligatorias.")
        @Min(value = 0, message = "Las horas de alto consumo no pueden ser negativas.")
        @Max(value = 24, message = "Las horas de alto consumo no pueden superar 24.")
        Integer horasAltoConsumo,

        @NotNull(message = "Debe indicar si utiliza horario pico.")
        Boolean usoHorarioPico
) {
    public Map<String, Object> toFeatureMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("tipoInmueble", tipoInmueble);
        map.put("areaM2", areaM2);
        map.put("consumoKwh", consumoKwh);
        map.put("cantidadEquipos", cantidadEquipos);
        map.put("cantidadPersonas", cantidadPersonas);
        map.put("horasClimatizacion", horasClimatizacion);
        map.put("horasAltoConsumo", horasAltoConsumo);
        map.put("usoHorarioPico", usoHorarioPico);
        return map;
    }
}

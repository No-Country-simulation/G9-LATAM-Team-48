package com.alura.prediction.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * Contrato de entrada para solicitar una predicción de consumo energético.
 *
 * <p>Contiene datos del inmueble, consumo, equipos, ocupación y hábitos de uso.
 * El backend valida esta información antes de delegarla al servicio de
 * predicción.</p>
 *
 * @param tipoInmueble tipo de inmueble informado
 * @param areaM2 superficie aproximada del inmueble en metros cuadrados
 * @param consumoKwh consumo energético informado en kilovatios-hora
 * @param cantidadEquipos cantidad de equipos eléctricos utilizados
 * @param cantidadPersonas cantidad de personas que habitan o utilizan el inmueble
 * @param horasClimatizacion horas diarias de uso de climatización
 * @param horasAltoConsumo horas diarias de mayor consumo energético
 * @param usoHorarioPico indica si existe consumo durante horario pico
 */
public record PredictionRequest(
        @NotBlank(message = "El tipo de inmueble es obligatorio.")
        String tipoInmueble,

        @NotNull(message = "El área es obligatoria.")
        @Positive(message = "El área debe ser mayor a cero.")
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

        @NotNull(message = "Las horas de climatización son obligatorias.")
        @Min(value = 0, message = "Las horas de climatización no pueden ser negativas.")
        @Max(value = 24, message = "Las horas de climatización no pueden superar 24.")
        Integer horasClimatizacion,

        @NotNull(message = "Las horas de alto consumo son obligatorias.")
        @Min(value = 0, message = "Las horas de alto consumo no pueden ser negativas.")
        @Max(value = 24, message = "Las horas de alto consumo no pueden superar 24.")
        Integer horasAltoConsumo,

        @NotNull(message = "Debe indicar si utiliza horario pico.")
        Boolean usoHorarioPico
) {
}
package com.alura.analisis.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Contrato del formulario Análisis IA alineado con el JSON de 12 features del modelo (F1 macro 0.91).
 *
 * <p>Los campos {@code horasAltoConsumo} y {@code usoHorarioPico} son opcionales y no alimentan
 * esta versión del modelo; se persisten solo por compatibilidad de UI.</p>
 */
public record AnalisisPayload(
        @NotBlank(message = "El tipo de inmueble es obligatorio.")
        String tipoInmueble,

        @NotNull(message = "La superficie es obligatoria.")
        @PositiveOrZero(message = "La superficie no puede ser negativa.")
        Double areaM2,

        @NotNull(message = "El consumo mensual es obligatorio.")
        @Positive(message = "El consumo mensual debe ser mayor a cero.")
        Double consumoKwh,

        @NotNull(message = "El consumo del mes anterior es obligatorio.")
        @PositiveOrZero(message = "El consumo del mes anterior no puede ser negativo.")
        Double consumoKwhMesAnterior,

        @NotNull(message = "La cantidad de equipos es obligatoria.")
        @PositiveOrZero(message = "La cantidad de equipos no puede ser negativa.")
        Integer cantidadEquipos,

        @NotNull(message = "La cantidad de personas es obligatoria.")
        @Min(value = 1, message = "Debe haber al menos una persona.")
        Integer cantidadPersonas,

        @NotNull(message = "Las horas de uso de AA son obligatorias.")
        @Min(value = 0, message = "Las horas de AA no pueden ser negativas.")
        @Max(value = 24, message = "Las horas de AA no pueden superar 24.")
        Double horasClimatizacion,

        @NotBlank(message = "El aislamiento térmico es obligatorio.")
        String aislamientoTermico,

        @NotNull(message = "El porcentaje de iluminación LED es obligatorio.")
        @Min(value = 0, message = "El porcentaje LED no puede ser negativo.")
        @Max(value = 100, message = "El porcentaje LED no puede superar 100.")
        Double pctIluminacionLed,

        @NotNull(message = "La antigüedad de construcción es obligatoria.")
        @PositiveOrZero(message = "La antigüedad de construcción no puede ser negativa.")
        Double antiguedadConstruccionAnios,

        @NotBlank(message = "La zona es obligatoria.")
        String zona,

        @NotNull(message = "La antigüedad de electrodomésticos es obligatoria.")
        @PositiveOrZero(message = "La antigüedad de electrodomésticos no puede ser negativa.")
        Double antiguedadElectrodomesticosAnios,

        @JsonAlias({"peakUseHours"})
        Integer horasAltoConsumo,

        Boolean usoHorarioPico
) {
    /** Mapa exacto de 12 claves snake_case para el servicio ML. */
    public Map<String, Object> toMlFeatureMap() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("tipo_inmueble", mapTipoInmuebleMl(tipoInmueble));
        map.put("superficie_m2", areaM2);
        map.put("num_personas", cantidadPersonas);
        map.put("cantidad_equipos_total", cantidadEquipos);
        map.put("horas_uso_aa_dia", horasClimatizacion);
        map.put("consumo_kwh_mensual", consumoKwh);
        map.put("consumo_kwh_mes_anterior", consumoKwhMesAnterior);
        map.put("aislamiento_termico", mapAislamientoMl(aislamientoTermico));
        map.put("pct_iluminacion_led", pctIluminacionLed);
        map.put("antiguedad_construccion_anios", antiguedadConstruccionAnios);
        map.put("zona", mapZonaMl(zona));
        map.put("antiguedad_electrodomesticos_anios", antiguedadElectrodomesticosAnios);
        return map;
    }

    /** JSON persistido en analisis_consultas (contrato ML + claves de formulario). */
    public Map<String, Object> toStoredRequestMap() {
        Map<String, Object> map = new LinkedHashMap<>(toMlFeatureMap());
        map.put("tipoInmueble", tipoInmueble);
        map.put("areaM2", areaM2);
        map.put("consumoKwh", consumoKwh);
        map.put("consumoKwhMesAnterior", consumoKwhMesAnterior);
        map.put("cantidadEquipos", cantidadEquipos);
        map.put("cantidadPersonas", cantidadPersonas);
        map.put("horasClimatizacion", horasClimatizacion);
        map.put("aislamientoTermico", aislamientoTermico);
        map.put("pctIluminacionLed", pctIluminacionLed);
        map.put("antiguedadConstruccionAnios", antiguedadConstruccionAnios);
        map.put("zona", zona);
        map.put("antiguedadElectrodomesticosAnios", antiguedadElectrodomesticosAnios);
        if (horasAltoConsumo != null) {
            map.put("horasAltoConsumo", horasAltoConsumo);
        }
        if (usoHorarioPico != null) {
            map.put("usoHorarioPico", usoHorarioPico);
        }
        return map;
    }

    /** Compatibilidad con {@code analizarYGuardar(Map)} — usa el contrato ML. */
    public Map<String, Object> toFeatureMap() {
        return toMlFeatureMap();
    }

    private static String mapTipoInmuebleMl(String raw) {
        if (raw == null) {
            return "Casa Unifamiliar";
        }
        String trimmed = raw.trim();
        return switch (trimmed.toUpperCase()) {
            case "APARTAMENTO" -> "Apartamento";
            case "PEQUENO_ESTABLECIMIENTO_COMERCIAL" -> "Pequeño Establecimiento Comercial";
            case "CASA_UNIFAMILIAR", "CASA" -> "Casa Unifamiliar";
            default -> trimmed.contains(" ") ? trimmed : "Casa Unifamiliar";
        };
    }

    private static String mapAislamientoMl(String raw) {
        if (raw == null) {
            return "Regular";
        }
        return switch (raw.trim().toUpperCase()) {
            case "BUENO" -> "Bueno";
            case "MALO" -> "Malo";
            case "REGULAR" -> "Regular";
            default -> raw.trim();
        };
    }

    private static String mapZonaMl(String raw) {
        if (raw == null) {
            return "Urbana Interior";
        }
        return switch (raw.trim().toUpperCase()) {
            case "SUBURBANA" -> "Suburbana";
            case "URBANA_COSTERA" -> "Urbana Costera";
            case "URBANA_INTERIOR" -> "Urbana Interior";
            default -> raw.trim();
        };
    }
}

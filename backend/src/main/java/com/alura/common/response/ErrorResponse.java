package com.alura.common.response;

import java.time.Instant;
import java.util.List;

/**
 * Envoltorio estandar para las respuestas de error de la API.
 *
 * @param status    codigo HTTP del error
 * @param error     nombre corto del error
 * @param message   descripcion legible del error
 * @param path      ruta de la peticion que origino el error
 * @param details   detalles adicionales (por ejemplo, errores de validacion)
 * @param timestamp momento de generacion de la respuesta
 */
public record ErrorResponse(
        int status,
        String error,
        String message,
        String path,
        List<String> details,
        Instant timestamp
) {
}

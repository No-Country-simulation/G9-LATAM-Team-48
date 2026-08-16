package com.alura.common.response;

import java.time.Instant;

/**
 * Envoltorio estandar para las respuestas exitosas de la API.
 *
 * <p>Homogeneiza el formato de salida de todos los modulos, facilitando el
 * consumo desde el frontend y una evolucion consistente del contrato.</p>
 *
 * @param <T>       tipo del contenido devuelto
 * @param success   indicador de exito de la operacion
 * @param message   mensaje descriptivo opcional
 * @param data      contenido de la respuesta
 * @param timestamp momento de generacion de la respuesta
 */
public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        Instant timestamp
) {

    /**
     * Fabrica una respuesta exitosa con datos.
     */
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, null, data, Instant.now());
    }

    /**
     * Fabrica una respuesta exitosa con datos y mensaje.
     */
    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, message, data, Instant.now());
    }
}

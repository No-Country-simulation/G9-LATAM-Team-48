package com.alura.common.exception;

import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Manejador centralizado de excepciones de la API.
 *
 * <p>Esqueleto sin manejadores. Concentrara la traduccion de excepciones a
 * respuestas {@code ErrorResponse} homogeneas, evitando la duplicacion de
 * manejo de errores en cada controlador.</p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // TODO: @ExceptionHandler(ResourceNotFoundException.class) -> 404
    // TODO: @ExceptionHandler(BusinessException.class)         -> 400/409
    // TODO: @ExceptionHandler(MethodArgumentNotValidException.class) -> 400 con detalles de validacion
    // TODO: @ExceptionHandler(Exception.class)                 -> 500 (fallback)
}

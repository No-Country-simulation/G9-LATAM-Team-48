package com.alura.common.exception;

/**
 * Se lanza cuando un recurso solicitado no existe.
 *
 * <p>El manejador global de excepciones la traducira a una respuesta HTTP 404.</p>
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}

package com.alura.common.exception;

/**
 * Se lanza cuando se viola una regla de negocio.
 *
 * <p>El manejador global de excepciones la traducira, por convencion, a una
 * respuesta HTTP 400/409 segun el caso.</p>
 */
public class BusinessException extends RuntimeException {

    public BusinessException(String message) {
        super(message);
    }
}

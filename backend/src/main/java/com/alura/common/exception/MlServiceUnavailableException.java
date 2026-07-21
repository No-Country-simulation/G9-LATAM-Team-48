package com.alura.common.exception;

/**
 * El microservicio de Machine Learning (FastAPI) no responde o fallo.
 */
public class MlServiceUnavailableException extends RuntimeException {

    public MlServiceUnavailableException(String message) {
        super(message);
    }

    public MlServiceUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}

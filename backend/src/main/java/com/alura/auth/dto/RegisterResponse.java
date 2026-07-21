package com.alura.auth.dto;

/**
 * Registro sin login automatico: hay que verificar el email primero.
 * {@code verificationToken} se expone en desarrollo para probar sin SMTP.
 */
public record RegisterResponse(
        String message,
        String emailStatus,
        String verificationToken
) {
}

package com.alura.auth.dto;

/**
 * Registro sin login automatico: hay que verificar el email primero.
 * {@code verificationToken} solo se incluye si {@code app.email-verification.expose-token=true}
 * (tests / debug local). En produccion el usuario valida solo con el link del mail.
 */
public record RegisterResponse(
        String message,
        String emailStatus,
        String verificationToken
) {
}

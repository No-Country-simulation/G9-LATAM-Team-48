package com.alura.auth.dto;

/**
 * Respuesta de forgot-password. {@code resetToken} solo se expone en desarrollo
 * para poder probar sin SMTP real.
 */
public record ForgotPasswordResponse(
        String message,
        String emailStatus,
        String resetToken
) {
}

package com.alura.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Credencial JWT de Google Identity Services (campo {@code credential} del callback GIS).
 */
public record GoogleLoginRequest(
        @NotBlank(message = "El token de Google es obligatorio")
        String credential
) {
}

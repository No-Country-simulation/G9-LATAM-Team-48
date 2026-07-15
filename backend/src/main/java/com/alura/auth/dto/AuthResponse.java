package com.alura.auth.dto;

/**
 * Contrato de salida devuelto tras una autenticacion o registro exitoso.
 *
 * @param accessToken token JWT firmado
 * @param tokenType   esquema del token (por convencion, "Bearer")
 */
public record AuthResponse(
        String accessToken,
        String tokenType
) {
}

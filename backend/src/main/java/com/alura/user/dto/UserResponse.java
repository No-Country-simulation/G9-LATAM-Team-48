package com.alura.user.dto;

/**
 * Vista publica de un usuario expuesta por la API.
 *
 * <p>Excluye deliberadamente datos sensibles como la contrasena.</p>
 */
public record UserResponse(
        Long id,
        String name,
        String email,
        String role,
        boolean emailVerified
) {
}

package com.alura.user.dto;

/**
 * Vista publica de un usuario expuesta por la API.
 *
 * <p>Excluye deliberadamente datos sensibles como la contrasena.</p>
 *
 * @param id    identificador del usuario
 * @param name  nombre visible
 * @param email correo electronico
 * @param role  rol asignado
 */
public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {
}

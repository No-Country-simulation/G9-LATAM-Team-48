package com.alura.auth.dto;

/**
 * Contrato de entrada para el registro de un nuevo usuario.
 *
 * @param name     nombre visible del usuario
 * @param email    correo electronico (sera el identificador de acceso)
 * @param password contrasena en texto plano (se cifrara antes de persistir)
 */
public record RegisterRequest(
        String name,
        String email,
        String password
) {
}

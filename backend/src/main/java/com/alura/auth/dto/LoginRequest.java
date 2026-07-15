package com.alura.auth.dto;

/**
 * Contrato de entrada para la operacion de inicio de sesion.
 *
 * <p>Las anotaciones de validacion (por ejemplo {@code @Email}, {@code @NotBlank})
 * se anadiran cuando se implemente el endpoint de autenticacion.</p>
 *
 * @param email    correo electronico del usuario
 * @param password contrasena en texto plano (solo en transito, nunca se persiste)
 */
public record LoginRequest(
        String email,
        String password
) {
}

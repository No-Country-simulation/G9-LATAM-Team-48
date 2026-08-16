package com.alura.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Contrato de entrada para el registro de un nuevo usuario.
 *
 * @param name     nombre visible del usuario
 * @param email    correo electronico (sera el identificador de acceso)
 * @param password contrasena en texto plano (se cifrara antes de persistir)
 */
public record RegisterRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato valido")
        String email,

        @NotBlank(message = "La contrasena es obligatoria")
        @Size(min = 8, message = "La contrasena debe tener al menos 8 caracteres")
        String password
) {
}

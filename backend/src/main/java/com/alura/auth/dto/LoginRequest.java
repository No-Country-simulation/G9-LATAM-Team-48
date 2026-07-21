package com.alura.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Contrato de entrada para la operacion de inicio de sesion.
 *
 * @param email    correo electronico del usuario
 * @param password contrasena en texto plano (solo en transito, nunca se persiste)
 */
public record LoginRequest(

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato valido")
        String email,

        @NotBlank(message = "La contrasena es obligatoria")
        String password
) {
}

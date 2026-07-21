package com.alura.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Actualizacion de usuario desde el panel admin.
 * {@code password} es opcional: si viene vacio no se cambia.
 */
public record AdminUpdateUserRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato valido")
        String email,

        String password,

        @NotBlank(message = "El rol es obligatorio")
        @Pattern(regexp = "USER|ADMIN", message = "El rol debe ser USER o ADMIN")
        String role
) {
}

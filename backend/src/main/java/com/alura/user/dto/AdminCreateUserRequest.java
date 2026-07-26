package com.alura.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Alta de usuario desde el panel admin.
 * Si {@code password} viene vacio, el backend genera una temporal y la envia por email.
 * {@code emailVerified} null o true = puede iniciar sesion sin verificar mail.
 */
public record AdminCreateUserRequest(

        @NotBlank(message = "El nombre es obligatorio")
        String name,

        @NotBlank(message = "El email es obligatorio")
        @Email(message = "El email no tiene un formato valido")
        String email,

        String password,

        @NotBlank(message = "El rol es obligatorio")
        @Pattern(regexp = "USER|ADMIN", message = "El rol debe ser USER o ADMIN")
        String role,

        Boolean emailVerified
) {
}

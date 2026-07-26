package com.alura.user.dto;

/**
 * Alta admin: incluye contraseña temporal (una vez) y estado del email.
 */
public record AdminUserCreatedResponse(
        UserResponse user,
        String temporaryPassword,
        String resetToken,
        String emailStatus
) {
}

package com.alura.user.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Modelo de dominio que representa a un usuario de la plataforma.
 *
 * <p>Es un POJO puro: <strong>no</strong> contiene anotaciones JPA ni mapeo a
 * base de datos.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    private Long id;
    private String name;
    private String email;
    private String password;
    private String role;
    /** Si no es null, el usuario esta borrado logicamente. */
    private LocalDateTime deletedAt;
    /** NULL = email no verificado; con fecha = verificado. */
    private LocalDateTime emailVerifiedAt;

    public boolean isActive() {
        return deletedAt == null;
    }

    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }
}

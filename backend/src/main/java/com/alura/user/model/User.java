package com.alura.user.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}

package com.alura.user.repository;

import com.alura.user.model.User;

import java.util.Optional;

/**
 * Abstraccion de acceso a datos de usuarios.
 *
 * <p>Se define como interfaz propia (no extiende ningun repositorio de Spring
 * Data) para <strong>desacoplar el dominio del mecanismo de persistencia</strong>.</p>
 *
 */
public interface UserRepository {

    Optional<User> findByEmail(String email);

    User save(User user);
}

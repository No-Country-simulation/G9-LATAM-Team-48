package com.alura.user.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositorio Spring Data JPA para la entidad {@link UserEntity}.
 *
 * <p>Proporciona acceso a la base de datos MySQL. No lleva anotación @Repository:
 * Spring Data lo registra automáticamente como bean.</p>
 */
public interface UserRepositoryJpa extends JpaRepository<UserEntity, Long> {

    /**
     * Busca un usuario por email sin distinguir mayúsculas/minúsculas.
     *
     * @param email correo del usuario
     * @return Optional con el usuario si existe
     */
    Optional<UserEntity> findByEmailIgnoreCase(String email);
}

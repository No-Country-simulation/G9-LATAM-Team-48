package com.alura.user.infrastructure.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio Spring Data JPA para la entidad {@link UserEntity}.
 */
public interface UserRepositoryJpa extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmailIgnoreCaseAndDeletedAtIsNull(String email);

    Optional<UserEntity> findByIdAndDeletedAtIsNull(Long id);

    List<UserEntity> findAllByDeletedAtIsNullOrderByIdAsc();

    boolean existsByEmailIgnoreCaseAndDeletedAtIsNull(String email);

    Optional<UserEntity> findByEmailIgnoreCase(String email);
}

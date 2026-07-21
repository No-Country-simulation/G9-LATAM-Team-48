package com.alura.user.infrastructure.persistence;

import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Adaptador que implementa la interfaz de dominio {@link UserRepository}
 * usando Spring Data JPA y {@link UserRepositoryJpa}.
 *
 * <p>Convierte bidireccionalamente entre el modelo de dominio {@link User}
 * y la entidad JPA {@link UserEntity}. Se registra como bean SOLO cuando
 * la propiedad {@code app.persistence.type} tiene valor {@code jpa}.</p>
 */
@Repository
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "app.persistence.type",
        havingValue = "jpa",
        matchIfMissing = true
)
public class JpaUserRepositoryAdapter implements UserRepository {

    private final UserRepositoryJpa userRepositoryJpa;

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return userRepositoryJpa.findByEmailIgnoreCase(email)
                .map(this::toDomain);
    }

    @Override
    public User save(User user) {
        UserEntity entity = toEntity(user);
        UserEntity saved = userRepositoryJpa.save(entity);
        return toDomain(saved);
    }

    /**
     * Convierte una entidad JPA a modelo de dominio.
     */
    private User toDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole())
                .build();
    }

    /**
     * Convierte un modelo de dominio a entidad JPA.
     */
    private UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .build();
    }
}

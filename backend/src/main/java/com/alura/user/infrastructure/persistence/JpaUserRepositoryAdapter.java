package com.alura.user.infrastructure.persistence;

import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Adaptador JPA de {@link UserRepository} con soporte de borrado logico.
 */
@Repository
@RequiredArgsConstructor
@ConditionalOnProperty(
        name = "app.persistence.type",
        havingValue = "jpa"
)
public class JpaUserRepositoryAdapter implements UserRepository {

    private final UserRepositoryJpa userRepositoryJpa;

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return userRepositoryJpa.findByEmailIgnoreCaseAndDeletedAtIsNull(email)
                .map(this::toDomain);
    }

    @Override
    public Optional<User> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return userRepositoryJpa.findByIdAndDeletedAtIsNull(id).map(this::toDomain);
    }

    @Override
    public List<User> findAll() {
        return userRepositoryJpa.findAllByDeletedAtIsNullOrderByIdAsc().stream()
                .map(this::toDomain)
                .toList();
    }

    @Override
    public User save(User user) {
        UserEntity entity = toEntity(user);
        UserEntity saved = userRepositoryJpa.save(entity);
        return toDomain(saved);
    }

    @Override
    public void softDeleteById(Long id) {
        userRepositoryJpa.findByIdAndDeletedAtIsNull(id).ifPresent(entity -> {
            entity.setDeletedAt(LocalDateTime.now());
            userRepositoryJpa.save(entity);
        });
    }

    @Override
    public boolean existsByEmail(String email) {
        return email != null
                && userRepositoryJpa.existsByEmailIgnoreCaseAndDeletedAtIsNull(email);
    }

    private User toDomain(UserEntity entity) {
        return User.builder()
                .id(entity.getId())
                .name(entity.getName())
                .email(entity.getEmail())
                .password(entity.getPassword())
                .role(entity.getRole())
                .deletedAt(entity.getDeletedAt())
                .emailVerifiedAt(entity.getEmailVerifiedAt())
                .build();
    }

    private UserEntity toEntity(User user) {
        return UserEntity.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole())
                .deletedAt(user.getDeletedAt())
                .emailVerifiedAt(user.getEmailVerifiedAt())
                .build();
    }
}

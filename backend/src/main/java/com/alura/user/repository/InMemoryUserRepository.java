package com.alura.user.repository;

import com.alura.user.model.User;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Implementacion <strong>en memoria</strong> de {@link UserRepository}.
 *
 * <p>Provee una persistencia volatil (se pierde al reiniciar) suficiente para
 * que el flujo de autenticacion sea funcional y testeable sin base de datos ni
 * JPA. Se registra como bean SOLO cuando la propiedad {@code app.persistence.type}
 * tiene valor {@code in-memory} (típicamente en tests).</p>
 *
 * <p>En produccion se usa {@link com.alura.user.infrastructure.persistence.JpaUserRepositoryAdapter}.</p>
 */
@Repository
@ConditionalOnProperty(
        name = "app.persistence.type",
        havingValue = "in-memory"
)
public class InMemoryUserRepository implements UserRepository {

    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase()));
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(sequence.incrementAndGet());
        }
        usersByEmail.put(user.getEmail().toLowerCase(), user);
        return user;
    }
}

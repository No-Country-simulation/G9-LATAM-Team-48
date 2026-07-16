package com.alura.user.repository;

import com.alura.user.model.User;
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
 * JPA. Cuando se introduzca una capa de persistencia real, bastara con crear una
 * nueva implementacion de {@link UserRepository} sin tocar el resto del codigo
 * (principio de inversion de dependencias).</p>
 */
@Repository
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

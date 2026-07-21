package com.alura.user.repository;

import com.alura.user.model.User;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Implementacion en memoria de {@link UserRepository} con borrado logico.
 */
@Repository
@ConditionalOnProperty(
        name = "app.persistence.type",
        havingValue = "in-memory"
)
public class InMemoryUserRepository implements UserRepository {

    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<Long, User> usersById = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    @Override
    public Optional<User> findByEmail(String email) {
        if (email == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(usersByEmail.get(email.toLowerCase()))
                .filter(User::isActive);
    }

    @Override
    public Optional<User> findById(Long id) {
        if (id == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(usersById.get(id)).filter(User::isActive);
    }

    @Override
    public List<User> findAll() {
        return usersById.values().stream()
                .filter(User::isActive)
                .sorted((a, b) -> Long.compare(
                        a.getId() == null ? 0L : a.getId(),
                        b.getId() == null ? 0L : b.getId()))
                .toList();
    }

    @Override
    public User save(User user) {
        if (user.getId() == null) {
            user.setId(sequence.incrementAndGet());
        } else {
            User previous = usersById.get(user.getId());
            if (previous != null && previous.getEmail() != null
                    && !previous.getEmail().equalsIgnoreCase(user.getEmail())) {
                usersByEmail.remove(previous.getEmail().toLowerCase());
            }
        }
        usersByEmail.put(user.getEmail().toLowerCase(), user);
        usersById.put(user.getId(), user);
        return user;
    }

    @Override
    public void softDeleteById(Long id) {
        User user = usersById.get(id);
        if (user == null || !user.isActive()) {
            return;
        }
        user.setDeletedAt(LocalDateTime.now());
        usersById.put(id, user);
        if (user.getEmail() != null) {
            usersByEmail.put(user.getEmail().toLowerCase(), user);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }
}

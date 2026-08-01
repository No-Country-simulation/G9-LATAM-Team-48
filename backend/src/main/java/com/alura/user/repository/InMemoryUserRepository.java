package com.alura.user.repository;

import com.alura.common.dto.PageResponse;
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
    public PageResponse<User> findPage(int page, int size) {
        List<User> all = findAll();
        int safePage = Math.max(0, page);
        int safeSize = Math.min(100, Math.max(1, size));
        int from = safePage * safeSize;
        int total = all.size();
        int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / safeSize);
        if (from >= total && total > 0) {
            safePage = Math.max(0, totalPages - 1);
            from = safePage * safeSize;
        }
        int to = Math.min(from + safeSize, total);
        List<User> slice = from >= total ? List.of() : all.subList(from, to);
        return new PageResponse<>(slice, safePage, safeSize, total, totalPages);
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

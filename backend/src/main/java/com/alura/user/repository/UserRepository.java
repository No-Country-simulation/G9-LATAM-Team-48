package com.alura.user.repository;

import com.alura.common.dto.PageResponse;
import com.alura.user.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Abstraccion de acceso a datos de usuarios.
 */
public interface UserRepository {

    /** Busca usuario activo por email (ignora borrados logicos). */
    Optional<User> findByEmail(String email);

    /** Busca usuario activo por id. */
    Optional<User> findById(Long id);

    /** Lista solo usuarios activos. */
    List<User> findAll();

    /** Pagina usuarios activos (orden por id ascendente). */
    PageResponse<User> findPage(int page, int size);

    User save(User user);

    /** Borrado logico: marca deleted_at, no elimina la fila. */
    void softDeleteById(Long id);

    boolean existsByEmail(String email);
}

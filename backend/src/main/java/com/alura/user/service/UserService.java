package com.alura.user.service;

import com.alura.user.dto.UserResponse;

/**
 * Orquesta la logica de gestion de usuarios (consulta y administracion de perfiles).
 *
 * <p>Sin implementacion todavia.</p>
 */
public interface UserService {

    /**
     * Recupera el perfil publico de un usuario por su identificador.
     *
     * @param id identificador del usuario
     * @return vista publica del usuario
     */
    UserResponse findById(Long id);
}

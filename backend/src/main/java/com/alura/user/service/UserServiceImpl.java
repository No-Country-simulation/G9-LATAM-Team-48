package com.alura.user.service;

import com.alura.common.exception.ResourceNotFoundException;
import com.alura.user.dto.UserResponse;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * Implementacion de {@link UserService}. Recupera el usuario del repositorio y
 * lo mapea a su vista publica ({@link UserResponse}), excluyendo datos sensibles
 * como la contrasena.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Usuario no encontrado: " + email));

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isEmailVerified());
    }
}

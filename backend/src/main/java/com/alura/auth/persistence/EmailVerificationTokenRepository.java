package com.alura.auth.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository
        extends JpaRepository<EmailVerificationTokenEntity, Long> {

    Optional<EmailVerificationTokenEntity> findByToken(String token);
}

package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.PasswordResetToken;
import com.Oscar.Proyecto_Final.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    Optional<PasswordResetToken> findByUsuario(Usuario usuario);
    void deleteByUsuario(Usuario usuario);
}

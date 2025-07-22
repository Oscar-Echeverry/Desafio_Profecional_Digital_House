package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.VerificationToken;
import com.Oscar.Proyecto_Final.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    void deleteByUsuario(Usuario usuario);
}

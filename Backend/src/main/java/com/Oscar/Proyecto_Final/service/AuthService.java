package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.RegistroDTO;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.model.VerificationToken;
import com.Oscar.Proyecto_Final.model.PasswordResetToken;
import com.Oscar.Proyecto_Final.model.enums.Rol;
import com.Oscar.Proyecto_Final.repository.UsuarioRepository;
import com.Oscar.Proyecto_Final.repository.VerificationTokenRepository;
import com.Oscar.Proyecto_Final.repository.PasswordResetTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public Usuario registrarUsuario(RegistroDTO dto) {
        if (usuarioRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("El email ya está registrado.");
        }

        Usuario usuario = Usuario.builder()
                .nombre(dto.getNombre())
                .apellido(dto.getApellido())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .rol(Rol.USER)
                .verificado(false)
                .activo(true)
                .build();

        usuarioRepository.save(usuario);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .usuario(usuario)
                .expiracion(LocalDateTime.now().plusMinutes(15))
                .build();

        verificationTokenRepository.save(verificationToken);
        emailService.enviarCorreoConfirmacion(usuario.getEmail(), usuario.getNombre(), token);

        return usuario;
    }

    @Transactional
    public void confirmarUsuario(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token no válido"));

        if (verificationToken.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token ha expirado");
        }

        Usuario usuario = verificationToken.getUsuario();
        usuario.setVerificado(true);
        usuarioRepository.save(usuario);
        verificationTokenRepository.delete(verificationToken);
    }

    @Transactional
    public void enviarTokenResetPassword(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        passwordResetTokenRepository.deleteByUsuario(usuario);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .usuario(usuario)
                .expiracion(LocalDateTime.now().plusMinutes(15))
                .build();

        passwordResetTokenRepository.save(resetToken);
        emailService.enviarResetPassword(email, token);
    }

    @Transactional
    public void resetearPassword(String token, String nuevaPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token inválido"));

        if (resetToken.getExpiracion().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("El token ha expirado");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setPassword(passwordEncoder.encode(nuevaPassword));
        usuarioRepository.save(usuario);
        passwordResetTokenRepository.delete(resetToken);
    }
}

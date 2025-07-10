package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.*;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.repository.UsuarioRepository;
import com.Oscar.Proyecto_Final.security.JwtUtil;
import com.Oscar.Proyecto_Final.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository usuarioRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequestDTO request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            if (!usuario.isVerificado()) {
                return ResponseEntity.status(403).body("Debes verificar tu cuenta antes de iniciar sesión");
            }

            String token = jwtUtil.generateToken(usuario);
            return ResponseEntity.ok(new AuthResponseDTO(
                    token,
                    usuario.getId(),
                    usuario.getEmail(),
                    usuario.getRol().name(),
                    usuario.getNombre() + " " + usuario.getApellido()
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody RegistroDTO dto) {
        try {
            Usuario usuario = authService.registrarUsuario(dto);
            return ResponseEntity.ok("Usuario registrado. Por favor verifica tu email.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/confirmar")
    public ResponseEntity<String> confirmarCuenta(@RequestParam("token") String token) {
        try {
            authService.confirmarUsuario(token);
            return ResponseEntity.ok("Cuenta verificada exitosamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/recuperar")
    public ResponseEntity<String> solicitarReset(@RequestParam String email) {
        authService.enviarTokenResetPassword(email);
        return ResponseEntity.ok("Se envió un enlace de recuperación al correo");
    }

    @PostMapping("/resetear")
    public ResponseEntity<String> resetearPassword(
            @RequestParam String token,
            @RequestParam String nuevaPassword) {
        authService.resetearPassword(token, nuevaPassword);
        return ResponseEntity.ok("Contraseña actualizada correctamente");
    }
}
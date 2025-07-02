package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Obtener perfil del usuario autenticado
    @GetMapping("/me")
    public Usuario getPerfilUsuarioAutenticado(Authentication authentication) {
        String email = authentication.getName();
        return usuarioService.obtenerPorEmail(email);
    }

    // Cambiar nombre y apellido
    @PutMapping("/{id}/datos")
    public Usuario actualizarNombreApellido(
            @PathVariable Long id,
            @RequestParam String nombre,
            @RequestParam String apellido) {
        return usuarioService.actualizarNombreApellido(id, nombre, apellido);
    }

    // Cambiar contraseña
    @PutMapping("/{id}/password")
    public void cambiarPassword(
            @PathVariable Long id,
            @RequestParam String nuevaPassword) {
        usuarioService.cambiarPassword(id, nuevaPassword);
    }

    // Subir o reemplazar foto de perfil
    @PutMapping("/{id}/imagen")
    public Usuario actualizarImagen(
            @PathVariable Long id,
            @RequestParam("imagen") MultipartFile imagen) {
        return usuarioService.actualizarImagenPerfil(id, imagen);
    }
}

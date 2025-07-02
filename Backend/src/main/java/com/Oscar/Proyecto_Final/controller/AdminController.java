package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.UsuarioDTO;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.model.enums.Rol;
import com.Oscar.Proyecto_Final.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UsuarioService usuarioService;

    // Solo accesible por ADMIN
    @GetMapping("/usuarios")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.listarTodosUsuarios());
    }

    @PutMapping("/usuarios/{id}/promover")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> promoverUsuario(
            @PathVariable Long id,
            @RequestParam boolean hacerAdmin) {

        Rol nuevoRol = hacerAdmin ? Rol.ADMIN : Rol.USER;
        return ResponseEntity.ok(usuarioService.cambiarRolUsuario(id, nuevoRol));
    }

    @PutMapping("/usuarios/{id}/bloquear")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UsuarioDTO> bloquearUsuario(
            @PathVariable Long id,
            @RequestParam boolean activo) {
        Usuario usuario = usuarioService.bloquearUsuario(id, activo);
        return ResponseEntity.ok(usuarioService.convertirADTO(usuario));
    }

    @DeleteMapping("/usuarios/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }
}

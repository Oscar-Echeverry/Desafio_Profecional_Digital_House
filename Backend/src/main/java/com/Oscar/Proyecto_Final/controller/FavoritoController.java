package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.FavoritoResponseDTO;
import com.Oscar.Proyecto_Final.service.FavoritoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favoritos")
@RequiredArgsConstructor
public class FavoritoController {

    private final FavoritoService favoritoService;

    @PostMapping("/{usuarioId}/{productoId}")
    public ResponseEntity<FavoritoResponseDTO> agregar(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {
        return ResponseEntity.ok(favoritoService.agregarFavorito(usuarioId, productoId));
    }

    @DeleteMapping("/{usuarioId}/{productoId}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long usuarioId,
            @PathVariable Long productoId) {
        favoritoService.eliminarFavorito(usuarioId, productoId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{usuarioId}")
    public ResponseEntity<List<FavoritoResponseDTO>> listar(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(favoritoService.listarFavoritos(usuarioId));
    }
}

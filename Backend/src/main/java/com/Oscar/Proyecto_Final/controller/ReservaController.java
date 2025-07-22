package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.ReservaRequestDTO;
import com.Oscar.Proyecto_Final.dto.ReservaResponseDTO;
import com.Oscar.Proyecto_Final.service.ReservaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
public class ReservaController {

    private final ReservaService reservaService;

    @PostMapping
    public ResponseEntity<ReservaResponseDTO> crear(@RequestBody ReservaRequestDTO dto,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(reservaService.crearReservaDesdeEmail(dto, email));
    }
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<ReservaResponseDTO>> listarPorProducto(@PathVariable Long productoId) {
        return ResponseEntity.ok(reservaService.obtenerPorProducto(productoId));
    }
    @GetMapping("/mias")
    public ResponseEntity<List<ReservaResponseDTO>> listarMisReservas(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        return ResponseEntity.ok(reservaService.obtenerReservasPorUsuario(email));
    }

    @DeleteMapping("/{reservaId}")
    public ResponseEntity<Void> cancelar(@PathVariable Long reservaId,
                                         @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        reservaService.cancelarReservaSiEsDelUsuario(reservaId, email);
        return ResponseEntity.noContent().build();
    }

}

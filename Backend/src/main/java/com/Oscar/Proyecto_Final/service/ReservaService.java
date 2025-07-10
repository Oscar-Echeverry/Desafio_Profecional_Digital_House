package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.ReservaRequestDTO;
import com.Oscar.Proyecto_Final.dto.ReservaResponseDTO;
import com.Oscar.Proyecto_Final.model.Producto;
import com.Oscar.Proyecto_Final.model.Reserva;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.repository.ProductoRepository;
import com.Oscar.Proyecto_Final.repository.ReservaRepository;
import com.Oscar.Proyecto_Final.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservaService {

    private final ReservaRepository reservaRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final EmailService emailService;

    public ReservaResponseDTO crearReserva(ReservaRequestDTO dto) {
        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        Usuario usuario = usuarioRepository.findById(dto.getUsuarioId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (dto.getFechaInicio().isAfter(dto.getFechaFin())) {
            throw new RuntimeException("La fecha de inicio debe ser anterior a la fecha de fin");
        }

        boolean hayConflicto = !reservaRepository
                .findReservasSuperpuestas(producto.getId(), dto.getFechaInicio(), dto.getFechaFin())
                .isEmpty();

        if (hayConflicto) {
            throw new RuntimeException("El producto no está disponible en ese rango de fechas");
        }

        Reserva reserva = Reserva.builder()
                .producto(producto)
                .usuario(usuario)
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .build();

        reserva = reservaRepository.save(reserva);

        return toDto(reserva);
    }

    public ReservaResponseDTO crearReservaDesdeEmail(ReservaRequestDTO dto, String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        dto.setUsuarioId(usuario.getId());

        ReservaResponseDTO reservaDTO = crearReserva(dto);

        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        emailService.enviarConfirmacionReserva(
                usuario.getEmail(),
                usuario.getNombre(),
                producto.getNombre(),
                dto.getFechaInicio(),
                dto.getFechaFin()
        );

        return reservaDTO;
    }

    public List<ReservaResponseDTO> obtenerPorProducto(Long productoId) {
        return reservaRepository.findByProductoId(productoId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<ReservaResponseDTO> obtenerReservasPorUsuario(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        List<Reserva> reservas = reservaRepository.findByUsuario(usuario);

        return reservas.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public void cancelarReservaSiEsDelUsuario(Long reservaId, String email) {
        Reserva reserva = reservaRepository.findById(reservaId)
                .orElseThrow(() -> new EntityNotFoundException("Reserva no encontrada"));

        if (!reserva.getUsuario().getEmail().equals(email)) {
            throw new AccessDeniedException("No tienes permiso para cancelar esta reserva");
        }

        // Guardamos info antes de eliminar
        Usuario usuario = reserva.getUsuario();
        Producto producto = reserva.getProducto();

        // Eliminar reserva
        reservaRepository.delete(reserva);

        // Enviar email de cancelación
        emailService.enviarCancelacionReserva(
                usuario.getEmail(),
                usuario.getNombre(),
                producto.getNombre(),
                reserva.getFechaInicio(),
                reserva.getFechaFin()
        );
    }


    private ReservaResponseDTO toDto(Reserva reserva) {
        return ReservaResponseDTO.builder()
                .id(reserva.getId())
                .nombreProducto(reserva.getProducto().getNombre())
                .productoId(reserva.getProducto().getId())
                .usuarioId(reserva.getUsuario().getId())
                .fechaInicio(reserva.getFechaInicio())
                .fechaFin(reserva.getFechaFin())
                .build();
    }
}

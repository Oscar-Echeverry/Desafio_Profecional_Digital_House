package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.Producto;
import com.Oscar.Proyecto_Final.model.Reserva;
import com.Oscar.Proyecto_Final.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    @Query("SELECT r FROM Reserva r WHERE r.producto.id = :productoId AND " +
            ":fechaInicio <= r.fechaFin AND :fechaFin >= r.fechaInicio")
    List<Reserva> findReservasSuperpuestas(@Param("productoId") Long productoId,
                                           @Param("fechaInicio") LocalDate fechaInicio,
                                           @Param("fechaFin") LocalDate fechaFin);

    List<Reserva> findByProductoId(Long productoId);
    List<Reserva> findByUsuario(Usuario usuario);
    boolean existsByUsuarioAndProductoAndFechaFinBefore(Usuario usuario, Producto producto, LocalDate fecha);
}

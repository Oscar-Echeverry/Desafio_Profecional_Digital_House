package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    boolean existsByNombre(String nombre);

    // ✅ Buscar productos por coincidencia parcial en ciudad
    List<Producto> findByCiudadContainingIgnoreCase(String ciudad);

    // ✅ Buscar y contar productos por categoría
    List<Producto> findByCategoriaId(Long categoriaId);
    Long countByCategoriaId(Long categoriaId);

    // ✅ Buscar productos disponibles por ciudad y fechas
    @Query("SELECT p FROM Producto p WHERE " +
            "(:ciudad IS NULL OR LOWER(p.ciudad) LIKE LOWER(CONCAT('%', :ciudad, '%'))) AND " +
            "p.id NOT IN (" +
            "   SELECT r.producto.id FROM Reserva r " +
            "   WHERE :fechaInicio <= r.fechaFin AND :fechaFin >= r.fechaInicio" +
            ")")
    List<Producto> buscarDisponiblesPorCiudadYFechas(@Param("ciudad") String ciudad,
                                                     @Param("fechaInicio") LocalDate fechaInicio,
                                                     @Param("fechaFin") LocalDate fechaFin);
}

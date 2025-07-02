package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {

    boolean existsByNombre(String nombre);

    @Query("SELECT p FROM Producto p WHERE " +
            "(:nombre IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', :nombre, '%'))) AND " +
            "(:fechaInicio IS NULL OR p.fechaCreacion >= :fechaInicio) AND " +
            "(:fechaFin IS NULL OR p.fechaCreacion <= :fechaFin)")
    List<Producto> buscarConFiltros(@Param("nombre") String nombre,
                                    @Param("fechaInicio") LocalDateTime fechaInicio,
                                    @Param("fechaFin") LocalDateTime fechaFin);
}
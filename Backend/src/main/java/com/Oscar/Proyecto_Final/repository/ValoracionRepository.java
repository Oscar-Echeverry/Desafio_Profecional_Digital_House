package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {
    List<Valoracion> findByProductoIdOrderByFechaDesc(Long productoId);
}

package com.Oscar.Proyecto_Final.repository;
import com.Oscar.Proyecto_Final.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
public interface ImagenRepository extends JpaRepository<Imagen, Long> {
    List<Imagen> findByProductoId(Long productoId);
}
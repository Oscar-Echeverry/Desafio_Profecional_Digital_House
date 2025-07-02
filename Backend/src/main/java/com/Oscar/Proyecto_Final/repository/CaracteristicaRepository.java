package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.Caracteristica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CaracteristicaRepository extends JpaRepository<Caracteristica, Long> {
    Optional<Caracteristica> findByNombre(String nombre);
}
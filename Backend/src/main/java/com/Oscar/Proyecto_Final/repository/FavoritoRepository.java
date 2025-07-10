package com.Oscar.Proyecto_Final.repository;

import com.Oscar.Proyecto_Final.model.Favorito;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUsuarioId(Long usuarioId);

    Optional<Favorito> findByUsuarioAndProducto(Usuario usuario, Producto producto);

    void deleteByUsuarioAndProducto(Usuario usuario, Producto producto);
}

package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.FavoritoResponseDTO;
import com.Oscar.Proyecto_Final.model.Favorito;
import com.Oscar.Proyecto_Final.model.Producto;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.repository.FavoritoRepository;
import com.Oscar.Proyecto_Final.repository.ProductoRepository;
import com.Oscar.Proyecto_Final.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;

    public FavoritoResponseDTO agregarFavorito(Long usuarioId, Long productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Verificar si ya existe
        favoritoRepository.findByUsuarioAndProducto(usuario, producto)
                .ifPresent(fav -> {
                    throw new RuntimeException("El producto ya está en favoritos");
                });

        Favorito favorito = Favorito.builder()
                .usuario(usuario)
                .producto(producto)
                .build();

        favorito = favoritoRepository.save(favorito);

        return mapToDTO(favorito);
    }
    @Transactional
    public void eliminarFavorito(Long usuarioId, Long productoId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        favoritoRepository.deleteByUsuarioAndProducto(usuario, producto);
    }

    public List<FavoritoResponseDTO> listarFavoritos(Long usuarioId) {
        return favoritoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private FavoritoResponseDTO mapToDTO(Favorito favorito) {
        FavoritoResponseDTO dto = new FavoritoResponseDTO();
        dto.setId(favorito.getId());
        dto.setUsuarioId(favorito.getUsuario().getId());
        dto.setProductoId(favorito.getProducto().getId());
        dto.setNombreProducto(favorito.getProducto().getNombre()); // si tienes este campo
        // dto.setImagenProducto(favorito.getProducto().getImagenUrl()); // si aplica
        return dto;
    }
}

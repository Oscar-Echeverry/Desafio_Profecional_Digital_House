package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.CategoriaDTO;
import com.Oscar.Proyecto_Final.model.Categoria;
import com.Oscar.Proyecto_Final.repository.CategoriaRepository;
import com.Oscar.Proyecto_Final.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final ProductoRepository productoRepository;
    private final CloudinaryService cloudinaryService;


    public List<CategoriaDTO> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(cat -> CategoriaDTO.builder()
                        .id(cat.getId())
                        .nombre(cat.getNombre())
                        .descripcion(cat.getDescripcion())
                        .imagen(cat.getImagen())
                        .cantidadProductos(productoRepository.countByCategoriaId(cat.getId()))
                        .build())
                .collect(Collectors.toList());
    }

    public CategoriaDTO guardar(CategoriaDTO dto, MultipartFile imagenFile) throws IOException {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio");
        }

        if (dto.getDescripcion() == null || dto.getDescripcion().isBlank()) {
            throw new RuntimeException("La descripción de la categoría es obligatoria");
        }

        if (categoriaRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe una categoría con ese nombre");
        }

        if (imagenFile == null || imagenFile.isEmpty()) {
            throw new RuntimeException("La imagen de la categoría es obligatoria");
        }

        String url = cloudinaryService.subirImagen(imagenFile);

        Categoria categoria = Categoria.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .imagen(url)
                .build();

        Categoria guardada = categoriaRepository.save(categoria);

        return CategoriaDTO.builder()
                .id(guardada.getId())
                .nombre(guardada.getNombre())
                .descripcion(guardada.getDescripcion())
                .imagen(guardada.getImagen())
                .build();
    }

    public CategoriaDTO editar(Long id, CategoriaDTO dto, MultipartFile nuevaImagenFile) throws IOException {
        Categoria categoriaExistente = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new RuntimeException("El nombre de la categoría es obligatorio");
        }

        if (dto.getDescripcion() == null || dto.getDescripcion().isBlank()) {
            throw new RuntimeException("La descripción de la categoría es obligatoria");
        }

        categoriaRepository.findByNombre(dto.getNombre()).ifPresent(cat -> {
            if (!cat.getId().equals(id)) {
                throw new RuntimeException("Ya existe otra categoría con ese nombre");
            }
        });

        if (nuevaImagenFile != null && !nuevaImagenFile.isEmpty()) {
            String nuevaUrl = cloudinaryService.subirImagen(nuevaImagenFile);
            categoriaExistente.setImagen(nuevaUrl);
        }

        categoriaExistente.setNombre(dto.getNombre());
        categoriaExistente.setDescripcion(dto.getDescripcion());

        Categoria actualizada = categoriaRepository.save(categoriaExistente);

        return CategoriaDTO.builder()
                .id(actualizada.getId())
                .nombre(actualizada.getNombre())
                .descripcion(actualizada.getDescripcion())
                .imagen(actualizada.getImagen())
                .build();
    }

    public void eliminar(Long id) {
        if (!categoriaRepository.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        categoriaRepository.deleteById(id);
    }
}

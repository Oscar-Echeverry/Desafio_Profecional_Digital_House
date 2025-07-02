package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.ProductoDTO;
import com.Oscar.Proyecto_Final.model.*;
import com.Oscar.Proyecto_Final.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final CategoriaRepository categoriaRepository;
    private final CaracteristicaRepository caracteristicaRepository;
    private final ImagenRepository imagenRepository;
    private final CloudinaryService cloudinaryService;

    public List<ProductoDTO> listarTodos() {
        return productoRepository.findAll().stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> listarProductosAleatorios(int cantidad) {
        List<Producto> productos = productoRepository.findAll();
        Collections.shuffle(productos);
        return productos.stream().limit(cantidad).map(this::mapearDTO).toList();
    }

    public ProductoDTO mapearDTO(Producto producto) {
        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .direccion(producto.getDireccion())
                .categoria(producto.getCategoria().getNombre())
                .imagenes(producto.getImagenes().stream().map(Imagen::getUrl).toList())
                .caracteristicas(producto.getCaracteristicas().stream().map(Caracteristica::getNombre).toList())
                .build();
    }

    public Producto guardarProducto(ProductoDTO dto, List<MultipartFile> archivos) throws IOException {
        if (productoRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("Ya existe un producto con ese nombre");
        }

        Categoria categoria = categoriaRepository.findByNombre(dto.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        List<Caracteristica> caracteristicas = dto.getCaracteristicas().stream()
                .map(nombre -> caracteristicaRepository.findByNombre(nombre)
                        .orElseThrow(() -> new RuntimeException("Característica no encontrada: " + nombre)))
                .toList();

        Producto producto = Producto.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .direccion(dto.getDireccion())
                .categoria(categoria)
                .caracteristicas(caracteristicas)
                .fechaCreacion(LocalDateTime.now())
                .build();

        Producto guardado = productoRepository.save(producto);

        List<Imagen> imagenes = archivos.stream()
                .map(file -> {
                    try {
                        String url = cloudinaryService.subirImagen(file);
                        return Imagen.builder().url(url).producto(guardado).build();
                    } catch (IOException e) {
                        throw new RuntimeException("Error al subir imagen", e);
                    }
                }).toList();

        imagenRepository.saveAll(imagenes);
        guardado.setImagenes(imagenes);

        return guardado;
    }

    public Producto actualizarProducto(Long id, ProductoDTO dto, List<MultipartFile> archivos) throws IOException {
        Producto producto = obtenerPorId(id);

        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setDireccion(dto.getDireccion());

        Categoria categoria = categoriaRepository.findByNombre(dto.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));

        List<Caracteristica> caracteristicas = dto.getCaracteristicas().stream()
                .map(nombre -> caracteristicaRepository.findByNombre(nombre)
                        .orElseThrow(() -> new RuntimeException("Característica no encontrada: " + nombre)))
                .toList();

        producto.setCategoria(categoria);
        producto.setCaracteristicas(caracteristicas);

        productoRepository.save(producto);

        imagenRepository.deleteAll(producto.getImagenes());

        List<Imagen> imagenes = archivos.stream()
                .map(file -> {
                    try {
                        String url = cloudinaryService.subirImagen(file);
                        return Imagen.builder().url(url).producto(producto).build();
                    } catch (IOException e) {
                        throw new RuntimeException("Error al subir imagen", e);
                    }
                }).toList();

        imagenRepository.saveAll(imagenes);
        producto.setImagenes(imagenes);

        return producto;
    }

    public void eliminarProducto(Long id) {
        Producto producto = obtenerPorId(id);
        imagenRepository.deleteAll(producto.getImagenes());
        productoRepository.delete(producto);
    }

    public Producto obtenerPorId(Long id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
    }

    public List<ProductoDTO> buscarProductos(String nombre, LocalDateTime fechaInicio, LocalDateTime fechaFin) {
        return productoRepository.buscarConFiltros(nombre, fechaInicio, fechaFin).stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }
}
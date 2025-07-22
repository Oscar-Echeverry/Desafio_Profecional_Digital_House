package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.*;
import com.Oscar.Proyecto_Final.model.*;
import com.Oscar.Proyecto_Final.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;
import com.Oscar.Proyecto_Final.exception.BadRequestException;
import java.util.Optional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
    private final ValoracionRepository valoracionRepository;
    private final UsuarioRepository usuarioRepository;
    private final ReservaRepository reservaRepository;

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
        List<String> imagenes = Optional.ofNullable(producto.getImagenes())
                .orElse(List.of())
                .stream()
                .map(Imagen::getUrl)
                .collect(Collectors.toList());

        List<String> caracteristicas = Optional.ofNullable(producto.getCaracteristicas())
                .orElse(List.of())
                .stream()
                .map(Caracteristica::getNombre)
                .collect(Collectors.toList());

        List<PoliticaDTO> politicas = Optional.ofNullable(producto.getPoliticas())
                .orElse(List.of())
                .stream()
                .map(p -> PoliticaDTO.builder()
                        .titulo(p.getTitulo())
                        .descripcion(p.getDescripcion())
                        .build())
                .collect(Collectors.toList());

        List<ValoracionDTO> valoraciones = Optional.ofNullable(producto.getValoraciones())
                .orElse(List.of())
                .stream()
                .map(v -> ValoracionDTO.builder()
                        .puntuacion(v.getPuntuacion())
                        .comentario(v.getComentario())
                        .usuario(v.getUsuario() != null ? (v.getUsuario().getNombre() + " " + v.getUsuario().getApellido()) : "Usuario desconocido")
                        .fecha(v.getFecha().toString())
                        .build())
                .collect(Collectors.toList());

        double promedio = producto.getValoraciones() != null && !producto.getValoraciones().isEmpty()
                ? producto.getValoraciones().stream().mapToInt(Valoracion::getPuntuacion).average().orElse(0.0)
                : 0.0;

        int total = producto.getValoraciones() != null ? producto.getValoraciones().size() : 0;

        return ProductoDTO.builder()
                .id(producto.getId())
                .nombre(producto.getNombre())
                .descripcion(producto.getDescripcion())
                .direccion(producto.getDireccion())
                .ciudad(producto.getCiudad())
                .categoria(producto.getCategoria() != null ? producto.getCategoria().getNombre() : "Sin categoría")
                .imagenes(imagenes)
                .caracteristicas(caracteristicas)
                .politicas(politicas)
                .valoraciones(valoraciones)
                .puntuacionPromedio(promedio)
                .cantidadValoraciones(total)
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
                .ciudad(dto.getCiudad())
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

    @Transactional
    public Producto actualizarProducto(Long id, ProductoDTO dto, List<MultipartFile> archivos) throws IOException {
        Producto producto = obtenerPorId(id);

        // 1. Actualizar campos básicos
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setDireccion(dto.getDireccion());
        producto.setCiudad(dto.getCiudad());

        // 2. Actualizar categoría
        Categoria categoria = categoriaRepository.findByNombre(dto.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        producto.setCategoria(categoria);

        // 3. Actualizar características
        List<Caracteristica> caracteristicas = dto.getCaracteristicas().stream()
                .map(nombre -> caracteristicaRepository.findByNombre(nombre))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toList());
        producto.setCaracteristicas(caracteristicas);

        // 4. Actualizar políticas - Versión mejorada
        if (dto.getPoliticas() != null && !dto.getPoliticas().isEmpty()) {
            // Eliminar políticas existentes (orphanRemoval se encargará de la eliminación en BD)
            producto.getPoliticas().clear();

            // Agregar nuevas políticas
            dto.getPoliticas().forEach(pDto -> {
                Politica politica = new Politica();
                politica.setTitulo(pDto.getTitulo());
                politica.setDescripcion(pDto.getDescripcion());
                politica.setProducto(producto);
                producto.getPoliticas().add(politica);
            });
        } else {
            producto.getPoliticas().clear();
        }

        // 5. Manejo de imágenes (opcional)
        if (archivos != null && !archivos.isEmpty()) {
            manejarImagenes(producto, archivos);
        }

        return productoRepository.save(producto);
    }

    private void manejarImagenes(Producto producto, List<MultipartFile> archivos) throws IOException {
        // Eliminar imágenes existentes
        if (!producto.getImagenes().isEmpty()) {
            producto.getImagenes().forEach(img -> {
                try {
                    cloudinaryService.eliminarImagen(img.getUrl());
                } catch (IOException e) {
                    System.err.println("Error al eliminar imagen: " + e.getMessage());
                }
            });
            imagenRepository.deleteAll(producto.getImagenes());
        }

        // Subir nuevas imágenes
        List<Imagen> nuevasImagenes = archivos.stream()
                .map(file -> {
                    try {
                        String url = cloudinaryService.subirImagen(file);
                        return Imagen.builder().url(url).producto(producto).build();
                    } catch (IOException e) {
                        throw new RuntimeException("Error al subir imagen", e);
                    }
                })
                .collect(Collectors.toList());

        imagenRepository.saveAll(nuevasImagenes);
        producto.setImagenes(nuevasImagenes);
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

    public List<ProductoDTO> listarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId).stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> buscarPorCiudad(String ciudad) {
        return productoRepository.findByCiudadContainingIgnoreCase(ciudad).stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }

    public List<ProductoDTO> buscarDisponiblesPorCiudadYFechas(String ciudad, LocalDate fechaInicio, LocalDate fechaFin) {
        return productoRepository.buscarDisponiblesPorCiudadYFechas(ciudad, fechaInicio, fechaFin).stream()
                .map(this::mapearDTO)
                .collect(Collectors.toList());
    }

    public void valorarProducto(Long productoId, int puntuacion, String comentario, Long usuarioId) {
        if (puntuacion < 1 || puntuacion > 5) {
            throw new IllegalArgumentException("La puntuación debe estar entre 1 y 5 estrellas.");
        }

        Producto producto = obtenerPorId(productoId);
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        boolean puedeValorar = reservaRepository.existsByUsuarioAndProductoAndFechaFinBefore(
                usuario, producto, LocalDate.now()
        );

        if (!puedeValorar) {
            throw new BadRequestException("Solo puedes valorar un producto si ya terminaste una reserva.");

        }

        Valoracion valoracion = Valoracion.builder()
                .producto(producto)
                .usuario(usuario)
                .puntuacion(puntuacion)
                .comentario(comentario)
                .fecha(LocalDateTime.now())
                .build();

        valoracionRepository.save(valoracion);
    }

    public List<ValoracionDTO> listarValoracionesDTO(Long productoId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        return valoracionRepository.findByProductoIdOrderByFechaDesc(productoId).stream()
                .map(v -> ValoracionDTO.builder()
                        .puntuacion(v.getPuntuacion())
                        .comentario(v.getComentario())
                        .usuario(v.getUsuario().getNombre() + " " + v.getUsuario().getApellido())
                        .fecha(v.getFecha().format(formatter))
                        .build())
                .collect(Collectors.toList());
    }
    public ValoracionesConPromedioDTO listarValoracionesConPromedio(Long productoId) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        List<Valoracion> valoraciones = valoracionRepository.findByProductoIdOrderByFechaDesc(productoId);

        List<ValoracionDTO> valoracionesDTO = valoraciones.stream()
                .map(v -> ValoracionDTO.builder()
                        .puntuacion(v.getPuntuacion())
                        .comentario(v.getComentario())
                        .usuario(v.getUsuario().getNombre() + " " + v.getUsuario().getApellido())
                        .fecha(v.getFecha().format(formatter))
                        .build())
                .toList();

        double promedio = Math.round(
                valoraciones.stream()
                        .mapToInt(Valoracion::getPuntuacion)
                        .average()
                        .orElse(0.0) * 10.0
        ) / 10.0;

        return ValoracionesConPromedioDTO.builder()
                .valoraciones(valoracionesDTO)
                .promedio(promedio)
                .total(valoraciones.size())
                .build();
    }
}
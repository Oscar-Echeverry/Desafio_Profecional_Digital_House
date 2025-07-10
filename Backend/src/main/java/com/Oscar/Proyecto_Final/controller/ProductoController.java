package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.ProductoDTO;
import com.Oscar.Proyecto_Final.dto.ValoracionDTO;
import com.Oscar.Proyecto_Final.dto.ValoracionesConPromedioDTO;
import com.Oscar.Proyecto_Final.model.Producto;
import com.Oscar.Proyecto_Final.model.Valoracion;
import com.Oscar.Proyecto_Final.service.ProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<ProductoDTO>> listarTodos() {
        return ResponseEntity.ok(productoService.listarTodos());
    }

    @GetMapping("/home")
    public ResponseEntity<List<ProductoDTO>> listarAleatorios() {
        return ResponseEntity.ok(productoService.listarProductosAleatorios(10));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(productoService.mapearDTO(productoService.obtenerPorId(id)));
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoDTO> crearProducto(
            @Valid @RequestPart("producto") String productoJson,
            @RequestPart("imagenes") List<MultipartFile> imagenes) throws IOException {

        ProductoDTO productoDTO = objectMapper.readValue(productoJson, ProductoDTO.class);
        Producto producto = productoService.guardarProducto(productoDTO, imagenes);
        return ResponseEntity.ok(productoService.mapearDTO(producto));
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<ProductoDTO> actualizarProducto(
            @PathVariable Long id,
            @Valid @RequestPart("producto") String productoJson,
            @RequestPart(value = "imagenes", required = false) List<MultipartFile> imagenes) throws IOException {

        ProductoDTO productoDTO = objectMapper.readValue(productoJson, ProductoDTO.class);

        // Validación adicional para políticas
        if (productoDTO.getPoliticas() != null) {
            productoDTO.getPoliticas().forEach(p -> {
                if (p.getTitulo() == null || p.getTitulo().trim().isEmpty()) {
                    throw new IllegalArgumentException("El título de la política no puede estar vacío");
                }
                if (p.getDescripcion() == null || p.getDescripcion().trim().isEmpty()) {
                    throw new IllegalArgumentException("La descripción de la política no puede estar vacía");
                }
            });
        }

        Producto productoActualizado = productoService.actualizarProducto(id, productoDTO, imagenes);
        return ResponseEntity.ok(productoService.mapearDTO(productoActualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/ciudad")
    public ResponseEntity<List<ProductoDTO>> buscarPorCiudad(@RequestParam String ciudad) {
        return ResponseEntity.ok(productoService.buscarPorCiudad(ciudad));
    }

    @GetMapping("/categoria/{categoriaId}")
    public ResponseEntity<List<ProductoDTO>> listarPorCategoria(@PathVariable Long categoriaId) {
        return ResponseEntity.ok(productoService.listarPorCategoria(categoriaId));
    }

    @GetMapping("/disponibles")
    public ResponseEntity<List<ProductoDTO>> buscarDisponibles(
            @RequestParam(required = false) String ciudad,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {

        return ResponseEntity.ok(
                productoService.buscarDisponiblesPorCiudadYFechas(ciudad, fechaInicio, fechaFin)
        );
    }

    @PostMapping("/{productoId}/valorar")
    public ResponseEntity<Void> valorarProducto(
            @PathVariable Long productoId,
            @RequestParam int puntuacion,
            @RequestParam(required = false) String comentario,
            @RequestParam Long usuarioId) {

        productoService.valorarProducto(productoId, puntuacion, comentario, usuarioId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{productoId}/valoraciones")
    public ResponseEntity<ValoracionesConPromedioDTO> listarValoraciones(@PathVariable Long productoId) {
        return ResponseEntity.ok(productoService.listarValoracionesConPromedio(productoId));
    }
}
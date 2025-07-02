package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.ProductoDTO;
import com.Oscar.Proyecto_Final.model.Producto;
import com.Oscar.Proyecto_Final.service.ProductoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping
    public List<ProductoDTO> listar() {
        return productoService.listarTodos();
    }

    @GetMapping("/home")
    public List<ProductoDTO> listarAleatorios() {
        return productoService.listarProductosAleatorios(10);
    }

    @GetMapping("/{id}")
    public ProductoDTO obtenerPorId(@PathVariable Long id) {
        Producto producto = productoService.obtenerPorId(id);
        return productoService.mapearDTO(producto);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public Producto crearProducto(
            @RequestPart("producto") String productoJson,
            @RequestPart("imagenes") List<MultipartFile> imagenes) throws IOException {

        ProductoDTO productoDTO = objectMapper.readValue(productoJson, ProductoDTO.class);
        return productoService.guardarProducto(productoDTO, imagenes);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public Producto actualizarProducto(
            @PathVariable Long id,
            @RequestPart("producto") String productoJson,
            @RequestPart("imagenes") List<MultipartFile> imagenes) throws IOException {

        ProductoDTO productoDTO = objectMapper.readValue(productoJson, ProductoDTO.class);
        return productoService.actualizarProducto(id, productoDTO, imagenes);
    }

    @DeleteMapping("/{id}")
    public void eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
    }

    @GetMapping("/buscar")
    public List<ProductoDTO> buscarProductos(
            @RequestParam(required = false) String nombre,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaFin) {
        return productoService.buscarProductos(nombre, fechaInicio, fechaFin);
    }
}

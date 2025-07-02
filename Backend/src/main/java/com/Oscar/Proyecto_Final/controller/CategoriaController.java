package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.CategoriaDTO;
import com.Oscar.Proyecto_Final.service.CategoriaService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDTO> listar() {
        return categoriaService.listarTodas();
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public CategoriaDTO crearCategoria(
            @RequestPart("categoria") String categoriaJson,
            @RequestPart("imagen") MultipartFile imagen) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        CategoriaDTO dto = mapper.readValue(categoriaJson, CategoriaDTO.class);
        return categoriaService.guardar(dto, imagen);
    }

    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable Long id) {

        categoriaService.eliminar(id);
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public CategoriaDTO editarCategoria(
            @PathVariable Long id,
            @RequestPart("categoria") String categoriaJson,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        CategoriaDTO dto = mapper.readValue(categoriaJson, CategoriaDTO.class);
        return categoriaService.editar(id, dto, imagen);
    }
}
package com.Oscar.Proyecto_Final.controller;

import com.Oscar.Proyecto_Final.dto.CaracteristicaDTO;
import com.Oscar.Proyecto_Final.service.CaracteristicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/caracteristicas")
@RequiredArgsConstructor
public class CaracteristicaController {

    private final CaracteristicaService caracteristicaService;

    @GetMapping
    public List<CaracteristicaDTO> listar() {
        return caracteristicaService.listar();
    }

    @PostMapping
    public CaracteristicaDTO crear(@RequestBody CaracteristicaDTO dto) {
        return caracteristicaService.crear(dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarCaracteristica(@PathVariable Long id) {
        caracteristicaService.eliminar(id);
    }
}
package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.CaracteristicaDTO;
import com.Oscar.Proyecto_Final.model.Caracteristica;
import com.Oscar.Proyecto_Final.repository.CaracteristicaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CaracteristicaService {

    private final CaracteristicaRepository caracteristicaRepository;

    public List<CaracteristicaDTO> listar() {
        return caracteristicaRepository.findAll().stream()
                .map(c -> CaracteristicaDTO.builder()
                        .id(c.getId())
                        .nombre(c.getNombre())
                        .icono(c.getIcono())
                        .build())
                .collect(Collectors.toList());
    }

    public CaracteristicaDTO crear(CaracteristicaDTO dto) {
        if (dto.getNombre() == null || dto.getNombre().isBlank()) {
            throw new RuntimeException("El nombre de la característica es obligatorio");
        }

        if (caracteristicaRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new RuntimeException("Ya existe una característica con ese nombre");
        }

        Caracteristica caracteristica = Caracteristica.builder()
                .nombre(dto.getNombre())
                .icono(dto.getIcono())
                .build();

        Caracteristica guardada = caracteristicaRepository.save(caracteristica);

        return CaracteristicaDTO.builder()
                .id(guardada.getId())
                .nombre(guardada.getNombre())
                .icono(guardada.getIcono())
                .build();
    }

    public void eliminar(Long id) {
        if (!caracteristicaRepository.existsById(id)) {
            throw new RuntimeException("Característica no encontrada");
        }
        caracteristicaRepository.deleteById(id);
    }
}

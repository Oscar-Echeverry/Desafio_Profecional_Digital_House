package com.Oscar.Proyecto_Final.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ReservaResponseDTO {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Long usuarioId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}

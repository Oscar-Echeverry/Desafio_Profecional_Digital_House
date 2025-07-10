package com.Oscar.Proyecto_Final.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ReservaRequestDTO {
    private Long productoId;
    private Long usuarioId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
}

package com.Oscar.Proyecto_Final.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CaracteristicaDTO {
    private Long id;
    private String nombre;
    private String icono;
}
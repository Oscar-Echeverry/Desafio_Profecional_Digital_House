package com.Oscar.Proyecto_Final.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionesConPromedioDTO {
    private List<ValoracionDTO> valoraciones;
    private double promedio;
    private int total;
}
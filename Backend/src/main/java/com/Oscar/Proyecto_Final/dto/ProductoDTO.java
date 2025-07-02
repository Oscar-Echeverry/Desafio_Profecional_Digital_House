package com.Oscar.Proyecto_Final.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String direccion;
    private String categoria;
    private List<String> imagenes;
    private List<String> caracteristicas;
}

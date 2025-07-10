package com.Oscar.Proyecto_Final.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoriaDTO {
    private Long id;
    private String nombre;
    private String imagen;
    private String descripcion;
    private Long cantidadProductos;
}
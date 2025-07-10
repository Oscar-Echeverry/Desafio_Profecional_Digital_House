package com.Oscar.Proyecto_Final.dto;

import lombok.Data;

@Data
public class FavoritoResponseDTO {
    private Long id;
    private Long usuarioId;
    private Long productoId;
    private String nombreProducto;
    private String imagenProducto;
}

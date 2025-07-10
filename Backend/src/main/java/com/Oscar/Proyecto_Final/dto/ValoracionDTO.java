package com.Oscar.Proyecto_Final.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValoracionDTO {
    private int puntuacion;
    private String comentario;
    private String usuario;
    private String fecha;
}

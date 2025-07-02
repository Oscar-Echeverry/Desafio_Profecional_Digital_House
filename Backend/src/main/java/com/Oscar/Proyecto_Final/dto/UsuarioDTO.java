package com.Oscar.Proyecto_Final.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UsuarioDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private boolean verificado;
    private boolean activo;
}
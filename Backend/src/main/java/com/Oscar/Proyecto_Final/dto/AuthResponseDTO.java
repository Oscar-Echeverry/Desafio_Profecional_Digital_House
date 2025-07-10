package com.Oscar.Proyecto_Final.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDTO {
    private String token;
    private Long id;
    private String email;
    private String rol;
    private String nombreCompleto;
}
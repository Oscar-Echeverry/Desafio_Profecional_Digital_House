package com.Oscar.Proyecto_Final.model;

import com.Oscar.Proyecto_Final.model.enums.Rol;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String apellido;
    private String email;
    private String password;
    private String imagenPerfil;

    private boolean verificado = false;
    private boolean activo = true;


    @Enumerated(EnumType.STRING)
    private Rol rol;
}

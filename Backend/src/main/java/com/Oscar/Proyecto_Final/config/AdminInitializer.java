package com.Oscar.Proyecto_Final.config;

import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.model.enums.Rol;
import com.Oscar.Proyecto_Final.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!usuarioRepository.existsByEmail("admin@example.com")) {
            Usuario admin = Usuario.builder()
                    .nombre("Admin")
                    .apellido("Principal")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("AdminPassword123!"))
                    .rol(Rol.ADMIN)
                    .verificado(true)
                    .build();

            usuarioRepository.save(admin);
            System.out.println("Usuario ADMIN inicial creado con éxito");
        }
    }
}
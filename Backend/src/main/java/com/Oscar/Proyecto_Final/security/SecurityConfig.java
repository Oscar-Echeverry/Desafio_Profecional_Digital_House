package com.Oscar.Proyecto_Final.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Permitir solicitudes preflight CORS
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Endpoints públicos de autenticación
                        .requestMatchers(HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/registro",
                                "/api/auth/recuperar",
                                "/api/auth/resetear").permitAll()
                        .requestMatchers(HttpMethod.GET,
                                "/api/auth/confirmar",
                                "/api/auth/resetear").permitAll()

                        // Endpoints públicos de categorías y características
                        .requestMatchers(HttpMethod.GET, "/api/categorias").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/caracteristicas").permitAll()

                        // Endpoints públicos de productos
                        .requestMatchers(HttpMethod.GET, "/api/productos").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/home").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/buscar").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/categoria/{id}").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/disponibles").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/productos/*/valoraciones").permitAll()

                        // Endpoints de reservas
                        .requestMatchers(HttpMethod.POST, "/api/reservas").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/reservas/producto/**").permitAll()
                        // Endpoints restringidos solo para rol ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Todo lo demás requiere autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}

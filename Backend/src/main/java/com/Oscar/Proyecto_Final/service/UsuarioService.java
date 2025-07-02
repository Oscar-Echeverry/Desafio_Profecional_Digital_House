package com.Oscar.Proyecto_Final.service;

import com.Oscar.Proyecto_Final.dto.UsuarioDTO;
import com.Oscar.Proyecto_Final.model.Usuario;
import com.Oscar.Proyecto_Final.model.enums.Rol;
import com.Oscar.Proyecto_Final.repository.UsuarioRepository;
import com.Oscar.Proyecto_Final.repository.PasswordResetTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final CloudinaryService cloudinaryService;
    private final BCryptPasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @Transactional(readOnly = true)
    public List<UsuarioDTO> listarTodosUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UsuarioDTO cambiarRolUsuario(Long id, Rol nuevoRol) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        usuario.setRol(nuevoRol);
        usuarioRepository.save(usuario);

        // Enviar correo notificando cambio de rol
        emailService.enviarNotificacionCambioRol(usuario.getEmail(), nuevoRol == Rol.ADMIN);

        return convertirADTO(usuario);
    }

    @Transactional(readOnly = true)
    public Usuario obtenerPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con email: " + email));
    }

    @Transactional
    public Usuario actualizarNombreApellido(Long id, String nombre, String apellido) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setNombre(nombre);
        usuario.setApellido(apellido);
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void cambiarPassword(Long id, String nuevaPassword) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String passwordEncriptada = passwordEncoder.encode(nuevaPassword);
        usuario.setPassword(passwordEncriptada);

        usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario actualizarImagenPerfil(Long id, MultipartFile imagen) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        try {
            String url = cloudinaryService.subirImagen(imagen);
            usuario.setImagenPerfil(url);
        } catch (IOException e) {
            throw new RuntimeException("Error al subir imagen a Cloudinary", e);
        }
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public Usuario bloquearUsuario(Long id, boolean activo) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setActivo(activo);
        usuarioRepository.save(usuario);

        // Enviar correo notificando bloqueo o desbloqueo
        emailService.enviarNotificacionBloqueo(usuario.getEmail(), activo);

        return usuario;
    }

    @Transactional
    public void eliminarUsuario(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Borrar tokens relacionados
        passwordResetTokenRepository.deleteByUsuario(usuario);

        // Borrar usuario
        usuarioRepository.delete(usuario);

        // Enviar correo notificando eliminación
        emailService.enviarNotificacionEliminacion(usuario.getEmail());
    }
    public UsuarioDTO convertirADTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .email(usuario.getEmail())
                .rol(usuario.getRol().name())
                .verificado(usuario.isVerificado())
                .activo(usuario.isActivo())
                .build();
    }
}

package com.Oscar.Proyecto_Final.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String subirImagen(MultipartFile archivo) throws IOException {
        Map resultado = cloudinary.uploader().upload(archivo.getBytes(), ObjectUtils.emptyMap());
        return (String) resultado.get("secure_url");
    }

    public void eliminarImagen(String urlImagen) throws IOException {
        try {
            // Extraer el public_id de la URL
            String publicId = extraerPublicIdDeUrl(urlImagen);

            if (publicId != null && !publicId.isEmpty()) {
                // Eliminar la imagen de Cloudinary
                Map resultado = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());

                // Verificar que la eliminación fue exitosa
                if (!"ok".equals(resultado.get("result"))) {
                    throw new IOException("No se pudo eliminar la imagen: " + resultado);
                }
            }
        } catch (Exception e) {
            throw new IOException("Error al eliminar imagen de Cloudinary", e);
        }
    }

    private String extraerPublicIdDeUrl(String url) {
        try {
            String[] partes = url.split("/");
            String archivo = partes[partes.length - 1]; // public_id.jpg
            return archivo.substring(0, archivo.lastIndexOf('.')); // public_id
        } catch (Exception e) {
            return null;
        }
    }
}
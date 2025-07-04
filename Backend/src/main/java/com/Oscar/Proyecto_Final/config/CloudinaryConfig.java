package com.Oscar.Proyecto_Final.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "ingresa la claudinary",
                "api_key", "ingrese la api_key",
                "api_secret", "ingrese la api_secret"
        ));
    }
}

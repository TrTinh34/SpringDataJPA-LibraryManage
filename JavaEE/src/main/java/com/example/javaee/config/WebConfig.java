package com.example.javaee.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath().replace("\\", "/");

        // Dòng này sẽ in ra Console lúc bạn chạy Server, giúp bạn biết chính xác Spring Boot đang mò vào thư mục nào!
        System.out.println("========== ĐƯỜNG DẪN THƯ MỤC UPLOAD: " + uploadPath + " ==========");

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:///" + uploadPath + "/");
    }
}
package com.portfolio.backend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {   // Fixed spelling: WebMvnConfigurer → WebMvcConfigurer
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {  // Fixed: registery → registry
                registry.addMapping("/**")                         // Fixed: pathPattern"/**" → "/**"
                        .allowedOrigins("http://localhost:3000")   // Added a default origin (adjust as needed)
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*")
                        .allowCredentials(false);
            }
        };
    }
}
package com.ilovemusic.ilovemusic_backend.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

/**
 * Loads environment variables from .env file at application startup
 * This ensures that .env file is loaded before Spring Boot initializes
 */
@Configuration
public class DotEnvConfig {

    static {
        try {
            // Load .env file from project root
            Dotenv dotenv = Dotenv.configure()
                    .ignoreIfMissing()
                    .load();

            // Set all environment variables as system properties
            dotenv.entries().forEach(entry ->
                    System.setProperty(entry.getKey(), entry.getValue())
            );
        } catch (Exception e) {
            System.err.println("Failed to load .env file: " + e.getMessage());
        }
    }
}


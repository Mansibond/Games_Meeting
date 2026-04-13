package com.adrian.coleccion.config;

import com.adrian.coleccion.model.*;
import com.adrian.coleccion.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInit {

    @Bean
    public CommandLineRunner initDatabase(
            GeneroRepository generoRepo,
            FormatoRepository formatoRepo,
            EstadoRepository estadoRepo,
            PlataformaRepository plataformaRepo) {

        return args -> {
            if (generoRepo.count() == 0) {
                List<String> generos = List.of(
                        "Acción", "Aventura", "RPG", "Estrategia", "Deportes",
                        "Plataformas", "Simulación", "Puzzles", "Battle Royale"
                );
                for (String nombre : generos) {
                    Genero g = new Genero();
                    g.setNombre(nombre);
                    generoRepo.save(g);
                }
                System.out.println("✅ Géneros insertados correctamente.");
            }

            if (formatoRepo.count() == 0) {
                List<String> formatos = List.of("Físico", "Digital");
                for (String nombre : formatos) {
                    Formato f = new Formato();
                    f.setNombre(nombre);
                    formatoRepo.save(f);
                }
                System.out.println("✅ Formatos insertados correctamente.");
            }

            if (estadoRepo.count() == 0) {
                List<String> estados = List.of("Pendiente", "Jugando", "Completado");
                for (String nombre : estados) {
                    Estado e = new Estado();
                    e.setNombre(nombre);
                    estadoRepo.save(e);
                }
                System.out.println("✅ Estados insertados correctamente.");
            }

            if (plataformaRepo.count() == 0) {
                List<String> plataformas = List.of(
                        "PlayStation", "Xbox", "Nintendo", "PC", "Retro", "Otra",
                        "Steam", "Epic", "Ubisoft", "EA", "Gog Galaxy", "Luna Amazon",
                        "AppStore(iOS)", "PlayStore(Android)"
                );
                for (String nombre : plataformas) {
                    Plataforma p = new Plataforma();
                    p.setNombre(nombre);
                    plataformaRepo.save(p);
                }
                System.out.println("✅ Plataformas insertadas correctamente.");
            }
        };
    }
}
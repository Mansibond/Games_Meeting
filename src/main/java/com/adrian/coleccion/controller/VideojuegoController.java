package com.adrian.coleccion.controller;

import com.adrian.coleccion.model.Usuario;
import com.adrian.coleccion.model.Videojuego;
import com.adrian.coleccion.repository.UsuarioRepository;
import com.adrian.coleccion.repository.VideojuegoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/videojuegos")
@CrossOrigin(origins = "*")
public class VideojuegoController {

    @Autowired
    private VideojuegoRepository repositorio;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public List<Videojuego> listar(@RequestParam Long usuarioId) {
        return repositorio.findByUsuarioId(usuarioId);
    }

    @PostMapping
    public Videojuego guardar(@RequestBody Videojuego videojuego, @RequestParam Long usuarioId) {
        Usuario u = usuarioRepository.findById(usuarioId).orElseThrow();
        videojuego.setUsuario(u);
        return repositorio.save(videojuego);
    }

    @PutMapping("/{id}")
    public Videojuego actualizar(@PathVariable Long id, @RequestBody Videojuego datos) {
        return repositorio.findById(id).map(juego -> {
            juego.setTitulo(datos.getTitulo());
            juego.setAnio(datos.getAnio());
            juego.setGenero(datos.getGenero());
            juego.setEstado(datos.getEstado());
            juego.setFormato(datos.getFormato());
            juego.setPlataforma(datos.getPlataforma());
            juego.setCaratula(datos.getCaratula());
            juego.setDescripcion(datos.getDescripcion());
            return repositorio.save(juego);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repositorio.deleteById(id);
    }
}
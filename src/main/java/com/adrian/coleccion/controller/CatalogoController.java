package com.adrian.coleccion.controller;

import com.adrian.coleccion.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/catalogos")
@CrossOrigin(origins = "*")
public class CatalogoController {

    @Autowired private GeneroRepository genRepo;
    @Autowired private FormatoRepository formRepo;
    @Autowired private EstadoRepository estRepo;
    @Autowired private PlataformaRepository platRepo;

    @GetMapping
    public Map<String, Object> obtenerTodos() {
        Map<String, Object> catalogos = new HashMap<>();
        catalogos.put("generos", genRepo.findAll());
        catalogos.put("formatos", formRepo.findAll());
        catalogos.put("estados", estRepo.findAll());
        catalogos.put("plataformas", platRepo.findAll());
        return catalogos;
    }
}
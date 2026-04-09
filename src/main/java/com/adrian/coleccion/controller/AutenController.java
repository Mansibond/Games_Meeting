package com.adrian.coleccion.controller;

import com.adrian.coleccion.model.Usuario;
import com.adrian.coleccion.repository.UsuarioRepository;
import com.adrian.coleccion.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AutenController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Inyectamos el encriptador de contraseñas
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil; // Añade esta inyección arriba con las demás

    @PostMapping("/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("El email ya existe");
        }

        // MAGIA AQUÍ: Cogemos la contraseña plana, la encriptamos y la volvemos a guardar en el objeto
        String passwordEncriptada = passwordEncoder.encode(usuario.getPassword());
        usuario.setPassword(passwordEncriptada);

        return usuarioRepository.save(usuario);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Map<String, String> credenciales) {
        String email = credenciales.get("email");
        String passwordPlana = credenciales.get("password");

        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario != null && passwordEncoder.matches(passwordPlana, usuario.getPassword())) {
            // ¡LOGIN CORRECTO! Generamos la "pulsera"
            String token = jwtUtil.generarToken(email);
            // Se la ponemos al usuario
            usuario.setToken(token);
            return usuario;
        } else {
            return null;
        }
    }
}
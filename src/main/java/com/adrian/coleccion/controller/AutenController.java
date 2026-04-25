package com.adrian.coleccion.controller;

import com.adrian.coleccion.model.Usuario;
import com.adrian.coleccion.repository.UsuarioRepository;
import com.adrian.coleccion.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AutenController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

       @PostMapping("/register")
    public Usuario registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()) != null) {
            throw new RuntimeException("El email ya existe");
        }

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
            String token = jwtUtil.generarToken(email);
            usuario.setToken(token);
            return usuario;
        } else {
            return null;
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario != null) {
            String token = jwtUtil.generarToken(email);
            emailService.enviarCorreoRecuperacion(email, token);
        }

        return ResponseEntity.ok(Map.of("mensaje", "Si el correo existe, hemos enviado un enlace de recuperación."));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestHeader("Authorization") String tokenHeader, @RequestBody Map<String, String> body) {
        String token = tokenHeader.replace("Bearer ", "");

        String email = jwtUtil.extraerEmail(token);
        Usuario usuario = usuarioRepository.findByEmail(email);

        if (usuario != null && jwtUtil.validarToken(token)) {
            // Encriptamos la nueva contraseña y la guardamos
            usuario.setPassword(passwordEncoder.encode(body.get("password")));
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(Map.of("mensaje", "Contraseña actualizada con éxito"));
        }

        return ResponseEntity.status(403).body(Map.of("error", "Token inválido o caducado"));
    }
}
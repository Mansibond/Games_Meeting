package com.adrian.coleccion.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // Buscamos si en la petición viene la cabecera "Authorization"
        String authHeader = request.getHeader("Authorization");

        // Los tokens siempre empiezan por la palabra "Bearer " (Portador)
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Quitamos "Bearer " para quedarnos solo con el churro

            if (jwtUtil.validarToken(token)) {
                String email = jwtUtil.extraerEmail(token);
                // Si el token vale, le decimos a Spring que deje pasar a este usuario
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        // Continuamos con el curso normal de la petición
        filterChain.doFilter(request, response);
    }
}
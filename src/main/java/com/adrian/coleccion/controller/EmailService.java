package com.adrian.coleccion.controller; // Ajusta tu paquete si es necesario

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoRecuperacion(String emailDestino, String token) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(emailDestino);
        mensaje.setSubject("Recuperación de contraseña - Games Meeting");

        String url = "http://localhost:8080/?resetToken=" + token;

        mensaje.setText("Hola,\n\n"
                + "Has solicitado restablecer tu contraseña en Games Meeting.\n"
                + "Haz clic en el siguiente enlace para crear una nueva clave:\n\n"
                + url + "\n\n"
                + "Si no has sido tú, ignora este correo. Tu cuenta está segura.");

        mailSender.send(mensaje);
    }
}
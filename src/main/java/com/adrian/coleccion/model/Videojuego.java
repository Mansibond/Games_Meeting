package com.adrian.coleccion.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "videojuegos")
public class Videojuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private Integer anio;
    private String caratula;

    @Column(length = 1000)
    private String descripcion;

    private Integer puntuacion;

    @ManyToOne @JoinColumn(name = "genero_id")
    private Genero genero;

    @ManyToOne @JoinColumn(name = "plataforma_id")
    private Plataforma plataforma;

    @ManyToOne @JoinColumn(name = "estado_id")
    private Estado estado;

    @ManyToOne @JoinColumn(name = "formato_id")
    private Formato formato;

    @ManyToOne @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario;

    public Videojuego() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }
    public Integer getAnio() { return anio; }
    public void setAnio(Integer anio) { this.anio = anio; }
    public String getCaratula() { return caratula; }
    public void setCaratula(String caratula) { this.caratula = caratula; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Genero getGenero () { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }
    public Plataforma getPlataforma() { return plataforma; }
    public void setPlataforma(Plataforma plataforma) { this.plataforma = plataforma; }
    public Estado getEstado() { return estado; }
    public void setEstado(Estado estado) { this.estado = estado; }
    public Formato getFormato() { return formato; }
    public void setFormato(Formato formato) { this.formato = formato; }
    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }
}
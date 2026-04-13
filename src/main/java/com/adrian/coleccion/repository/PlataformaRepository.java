package com.adrian.coleccion.repository;

import com.adrian.coleccion.model.Plataforma;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlataformaRepository extends JpaRepository<Plataforma, Long> {
}
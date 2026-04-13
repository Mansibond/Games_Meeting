package com.adrian.coleccion.repository;

import com.adrian.coleccion.model.Formato;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormatoRepository extends JpaRepository<Formato, Long> {
}
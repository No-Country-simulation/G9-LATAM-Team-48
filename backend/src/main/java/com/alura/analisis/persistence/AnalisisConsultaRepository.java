package com.alura.analisis.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalisisConsultaRepository extends JpaRepository<AnalisisConsultaEntity, Long> {

    List<AnalisisConsultaEntity> findByUserEmailOrderByCreatedAtDesc(String userEmail);
}

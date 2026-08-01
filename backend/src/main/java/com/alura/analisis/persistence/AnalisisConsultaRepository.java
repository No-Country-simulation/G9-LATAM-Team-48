package com.alura.analisis.persistence;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnalisisConsultaRepository extends JpaRepository<AnalisisConsultaEntity, Long> {

    List<AnalisisConsultaEntity> findByUserEmailOrderByCreatedAtDesc(String userEmail);

    List<AnalisisConsultaEntity> findAllByOrderByCreatedAtDesc();

    Page<AnalisisConsultaEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);
}

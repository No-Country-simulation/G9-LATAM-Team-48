package com.alura.analisis.service;

import com.alura.analisis.dto.AdminAnalisisItem;
import com.alura.analisis.persistence.AnalisisConsultaEntity;
import com.alura.analisis.persistence.AnalisisConsultaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminAnalisisService {

    private final AnalisisConsultaRepository repository;

    public AdminAnalisisService(AnalisisConsultaRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<AdminAnalisisItem> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toItem)
                .toList();
    }

    private AdminAnalisisItem toItem(AnalisisConsultaEntity entity) {
        return new AdminAnalisisItem(
                entity.getId(),
                entity.getUserId(),
                entity.getUserEmail(),
                entity.getTipoInstalacion(),
                entity.getNivelKey(),
                entity.getAhorro(),
                entity.getConfidence(),
                entity.getBenchmark(),
                entity.getTipKeysJson(),
                entity.getEmailStatus(),
                entity.getCreatedAt(),
                entity.getRequestJson(),
                entity.getResponseJson());
    }
}

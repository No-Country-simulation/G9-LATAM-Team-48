package com.alura.analisis.service;

import com.alura.analisis.dto.AdminAnalisisItem;
import com.alura.analisis.persistence.AnalisisConsultaEntity;
import com.alura.analisis.persistence.AnalisisConsultaRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminAnalisisService {

    private final AnalisisConsultaRepository repository;
    private final ObjectMapper objectMapper;

    public AdminAnalisisService(AnalisisConsultaRepository repository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.objectMapper = objectMapper;
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
                entity.getTipKeysJson() != null
                        ? List.copyOf(entity.getTipKeysJson())
                        : List.of(),
                entity.getEmailStatus(),
                entity.getCreatedAt(),
                jsonToMap(entity.getRequestJson()),
                jsonToMap(entity.getResponseJson()));
    }

    private Map<String, Object> jsonToMap(JsonNode node) {
        if (node == null || node.isNull()) {
            return Map.of();
        }
        if (node.isTextual()) {
            try {
                return objectMapper.readValue(
                        node.asText(), new TypeReference<LinkedHashMap<String, Object>>() {});
            } catch (Exception ignored) {
                return Map.of();
            }
        }
        try {
            return objectMapper.convertValue(
                    node, new TypeReference<LinkedHashMap<String, Object>>() {});
        } catch (Exception ignored) {
            return Map.of();
        }
    }
}

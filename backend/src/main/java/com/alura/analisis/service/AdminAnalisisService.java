package com.alura.analisis.service;

import com.alura.analisis.dto.AdminAnalisisItem;
import com.alura.analisis.dto.AdminRecalculoResult;
import com.alura.common.dto.PageResponse;
import com.alura.common.util.PageRequests;
import com.alura.analisis.persistence.AnalisisConsultaEntity;
import com.alura.analisis.persistence.AnalisisConsultaRepository;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.prediction.service.PredictionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class AdminAnalisisService {

    private final AnalisisConsultaRepository repository;
    private final PredictionService predictionService;
    private final ObjectMapper objectMapper;
    private final AnalisisTipsComposer tipsComposer;

    public AdminAnalisisService(
            AnalisisConsultaRepository repository,
            PredictionService predictionService,
            ObjectMapper objectMapper,
            AnalisisTipsComposer tipsComposer) {
        this.repository = repository;
        this.predictionService = predictionService;
        this.objectMapper = objectMapper;
        this.tipsComposer = tipsComposer;
    }

    @Transactional(readOnly = true)
    public List<AdminAnalisisItem> listAll() {
        return repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toItem)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<AdminAnalisisItem> listPage(int page, int size) {
        var springPage = repository.findAllByOrderByCreatedAtDesc(
                PageRequests.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt")));
        return PageResponse.from(springPage.map(this::toItem));
    }

    /**
     * Reaplica el modelo IA actual sobre el requestJson guardado.
     * Si el ML service no responde, cae a la heuristica local por fila.
     * No crea filas nuevas ni reenvia emails.
     */
    @Transactional
    public AdminRecalculoResult recalcularConModelo() {
        List<AnalisisConsultaEntity> rows = repository.findAllByOrderByCreatedAtDesc();
        int updated = 0;
        int unchanged = 0;
        int skipped = 0;

        for (AnalisisConsultaEntity entity : rows) {
            Map<String, Object> features = jsonToMap(entity.getRequestJson());
            if (features.isEmpty()) {
                skipped++;
                continue;
            }

            PredictionResponse rawResult = predictionService.analyze(features);
            List<String> tips = tipsComposer.compose(
                    rawResult, features, entity.getUserEmail());
            PredictionResponse result = new PredictionResponse(
                    rawResult.userId(),
                    rawResult.category(),
                    rawResult.nivelKey(),
                    rawResult.confidence(),
                    rawResult.ahorro(),
                    tips,
                    rawResult.benchmark());
            if (!hasChanged(entity, result)) {
                unchanged++;
                continue;
            }

            Map<String, Object> responseMap = objectMapper.convertValue(
                    result, new TypeReference<Map<String, Object>>() {});

            entity.setNivelKey(result.nivelKey());
            entity.setCategoria(result.category());
            entity.setAhorro(result.ahorro());
            entity.setConfidence(result.confidence());
            entity.setBenchmark(result.benchmark());
            entity.setTipKeysJson(result.tipKeys() != null ? result.tipKeys() : List.of());
            entity.setResponseJson(objectMapper.valueToTree(responseMap));
            repository.save(entity);
            updated++;
        }

        return new AdminRecalculoResult(rows.size(), updated, unchanged, skipped);
    }

    private static boolean hasChanged(AnalisisConsultaEntity entity, PredictionResponse result) {
        if (!Objects.equals(entity.getNivelKey(), result.nivelKey())) {
            return true;
        }
        if (!Objects.equals(entity.getCategoria(), result.category())) {
            return true;
        }
        if (!Objects.equals(entity.getAhorro(), result.ahorro())) {
            return true;
        }
        if (!Objects.equals(entity.getConfidence(), result.confidence())) {
            return true;
        }
        if (!Objects.equals(entity.getBenchmark(), result.benchmark())) {
            return true;
        }
        List<String> currentTips = entity.getTipKeysJson() != null ? entity.getTipKeysJson() : List.of();
        List<String> nextTips = result.tipKeys() != null ? result.tipKeys() : List.of();
        return !currentTips.equals(nextTips);
    }

    private AdminAnalisisItem toItem(AnalisisConsultaEntity entity) {
        return new AdminAnalisisItem(
                entity.getId(),
                entity.getUserId(),
                entity.getUserEmail(),
                entity.getTipoInstalacion(),
                entity.getNivelKey(),
                entity.getCategoria(),
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

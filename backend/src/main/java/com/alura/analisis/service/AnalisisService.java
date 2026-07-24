package com.alura.analisis.service;

import com.alura.analisis.dto.AdminAnalisisItem;
import com.alura.analisis.dto.AnalisisApiResponse;
import com.alura.analisis.persistence.AnalisisConsultaEntity;
import com.alura.analisis.persistence.AnalisisConsultaRepository;
import com.alura.common.exception.BusinessException;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.prediction.service.PredictionService;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalisisService {

    private final PredictionService predictionService;
    private final AnalisisConsultaRepository consultaRepository;
    private final UserRepository userRepository;
    private final AnalisisEmailService emailService;
    private final ObjectMapper objectMapper;

    public AnalisisService(
            PredictionService predictionService,
            AnalisisConsultaRepository consultaRepository,
            UserRepository userRepository,
            AnalisisEmailService emailService,
            ObjectMapper objectMapper) {
        this.predictionService = predictionService;
        this.consultaRepository = consultaRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.objectMapper = objectMapper;
    }

    /**
     * Analiza, persiste la consulta siempre y envia email solo si hay usuario autenticado.
     */
    @Transactional
    public AnalisisApiResponse analizarYGuardar(Map<String, Object> datos) {
        if (datos == null || datos.isEmpty()) {
            throw new IllegalArgumentException("El body del analisis no puede estar vacio");
        }
        Object consumo = datos.get("consumoKwh");
        if (consumo == null) {
            consumo = datos.get("consumo");
        }
        if (consumo == null) {
            throw new IllegalArgumentException("El campo 'consumoKwh' es obligatorio");
        }

        String email = currentUserEmailOrNull();
        User user = email != null ? userRepository.findByEmail(email).orElse(null) : null;

        PredictionResponse result = predictionService.analyze(datos);

        Map<String, Object> responseMap = objectMapper.convertValue(
                result, new TypeReference<Map<String, Object>>() {});

        Object tipoRaw = datos.get("tipoInmueble");
        if (tipoRaw == null) {
            tipoRaw = datos.get("tipo");
        }
        String tipoInstalacion = String.valueOf(
                tipoRaw != null ? tipoRaw : "CASA_UNIFAMILIAR");

        AnalisisConsultaEntity entity = AnalisisConsultaEntity.builder()
                .userId(user != null ? user.getId() : null)
                .userEmail(email)
                .tipoInstalacion(tipoInstalacion)
                .requestJson(objectMapper.valueToTree(datos))
                .nivelKey(result.nivelKey())
                .ahorro(result.ahorro())
                .confidence(result.confidence())
                .benchmark(result.benchmark())
                .tipKeysJson(result.tipKeys() != null ? result.tipKeys() : List.of())
                .responseJson(objectMapper.valueToTree(responseMap))
                .emailStatus(email != null ? "PENDING" : "SKIPPED")
                .build();

        AnalisisConsultaEntity saved = consultaRepository.save(entity);
        String emailStatus = emailService.enqueue(saved);
        saved.setEmailStatus(emailStatus);
        consultaRepository.save(saved);

        return AnalisisApiResponse.from(result, emailStatus, saved.getId());
    }

    /**
     * Historial de Analisis IA del usuario autenticado (tabla analisis_consultas).
     */
    @Transactional(readOnly = true)
    public List<AdminAnalisisItem> listarMisConsultas() {
        String email = currentUserEmailOrNull();
        if (email == null) {
            throw new BusinessException("Debes iniciar sesion para ver tu historial");
        }
        return consultaRepository.findByUserEmailOrderByCreatedAtDesc(email).stream()
                .map(this::toItem)
                .toList();
    }

    /**
     * Reenvia el email del resultado de una consulta propia del usuario autenticado.
     */
    @Transactional
    public AdminAnalisisItem reenviarEmail(Long consultaId) {
        String email = currentUserEmailOrNull();
        if (email == null) {
            throw new BusinessException("Debes iniciar sesion para reenviar el analisis");
        }
        AnalisisConsultaEntity consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new BusinessException("Consulta no encontrada"));
        if (consulta.getUserEmail() == null
                || !email.equalsIgnoreCase(consulta.getUserEmail())) {
            throw new BusinessException("No podes reenviar una consulta que no es tuya");
        }

        String emailStatus = emailService.enqueue(consulta);
        consulta.setEmailStatus(emailStatus);
        return toItem(consultaRepository.save(consulta));
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

    /** Email del JWT si hay sesion valida; null si es consulta anonima. */
    private String currentUserEmailOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null
                || "anonymousUser".equals(auth.getName())) {
            return null;
        }
        return auth.getName();
    }
}

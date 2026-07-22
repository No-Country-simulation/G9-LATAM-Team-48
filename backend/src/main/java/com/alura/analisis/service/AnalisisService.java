package com.alura.analisis.service;

import com.alura.analisis.dto.AnalisisApiResponse;
import com.alura.analisis.persistence.AnalisisConsultaEntity;
import com.alura.analisis.persistence.AnalisisConsultaRepository;
import com.alura.prediction.dto.PredictionResponse;
import com.alura.prediction.service.PredictionService;
import com.alura.user.model.User;
import com.alura.user.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
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

        String email = currentUserEmail();
        User user = userRepository.findByEmail(email).orElse(null);

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
                .requestJson(new HashMap<>(datos))
                .nivelKey(result.nivelKey())
                .ahorro(result.ahorro())
                .confidence(result.confidence())
                .benchmark(result.benchmark())
                .tipKeysJson(result.tipKeys() != null ? result.tipKeys() : List.of())
                .responseJson(responseMap)
                .emailStatus("PENDING")
                .build();

        AnalisisConsultaEntity saved = consultaRepository.save(entity);
        String emailStatus = emailService.enqueue(saved);
        saved.setEmailStatus(emailStatus);
        consultaRepository.save(saved);

        return AnalisisApiResponse.from(result, emailStatus, saved.getId());
    }

    private String currentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null
                || "anonymousUser".equals(auth.getName())) {
            throw new IllegalStateException("Debes iniciar sesion para analizar el consumo");
        }
        return auth.getName();
    }
}

package com.alura.recommendation.service;

import com.alura.recommendation.dto.TipKey;
import com.alura.recommendation.model.RecommendationEntity;
import com.alura.recommendation.repository.RecommendationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RecommendationAdminService {

    private final RecommendationRepository repository;

    public RecommendationAdminService(RecommendationRepository repository) {
        this.repository = repository;
    }

    /**
     * Valida si el catálogo está vacío. Si lo está, inserta los registros base dictados por SHAP y Reglas de Negocio.
     */
    @Transactional
    public void seedCatalogIfEmpty() {
        if (repository.count() == 0) {
            System.out.println("Sembrando catálogo maestro de recomendaciones...");
            
            // Bases por perfil
            createRecommendation(TipKey.HIGH_CONSUMPTION_BASE, "Revisión general de alto consumo", "INFO");
            createRecommendation(TipKey.MEDIUM_CONSUMPTION_BASE, "Hábitos moderados con margen de mejora", "INFO");
            createRecommendation(TipKey.LOW_CONSUMPTION_BASE, "Mantenimiento de perfil eficiente", "INFO");
            
            // Alertas y Oportunidades SHAP / Heurísticas
            createRecommendation(TipKey.HIGH_CONSUMPTION_PER_PERSON, "Consumo per cápita elevado", "ALERTA");
            createRecommendation(TipKey.INSULATION_DEFICIENT, "Aislamiento térmico deficiente", "ALERTA");
            createRecommendation(TipKey.LED_UPGRADE_NEEDED, "Oportunidad de migración a LED", "OPORTUNIDAD");
            createRecommendation(TipKey.AIR_CONDITIONING_OPTIMIZATION, "Optimización de Aire Acondicionado", "OPORTUNIDAD");
            createRecommendation(TipKey.HIGH_EQUIPMENT_DENSITY, "Alta densidad de equipos eléctricos", "ALERTA");
            createRecommendation(TipKey.STANDBY_POWER_DRAIN, "Fugas de energía por Standby", "OPORTUNIDAD");
            createRecommendation(TipKey.COMMERCIAL_OFF_HOURS_USE, "Uso comercial fuera de horario", "ALERTA");
            createRecommendation(TipKey.PEAK_HOUR_SHIFT, "Desplazamiento de consumo en horario pico", "OPORTUNIDAD");

            System.out.println("Catálogo inicializado con éxito.");
        }
    }

    @Transactional
    public RecommendationEntity createRecommendation(TipKey key, String title, String type) {
        // Lógica de seguridad para evitar excepciones de constrains SQL
        if (repository.findByTipKey(key).isPresent()) {
            throw new IllegalArgumentException("La TipKey ya existe en el catálogo: " + key);
        }
        
        RecommendationEntity entity = RecommendationEntity.builder()
                .tipKey(key)
                .title(title)
                .type(type)
                .build();
                
        return repository.save(entity);
    }

    public List<RecommendationEntity> listAll() {
        return repository.findAll();
    }
}
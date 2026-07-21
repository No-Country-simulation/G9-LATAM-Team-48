package com.alura.analisis.persistence;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "analisis_consultas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalisisConsultaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @Column(name = "tipo_instalacion", nullable = false, length = 50)
    private String tipoInstalacion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "request_json", nullable = false)
    private Map<String, Object> requestJson;

    @Column(name = "nivel_key", length = 50)
    private String nivelKey;

    private Integer ahorro;

    private Double confidence;

    private Double benchmark;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "tip_keys_json")
    private List<String> tipKeysJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "response_json")
    private Map<String, Object> responseJson;

    @Column(name = "email_status", nullable = false, length = 30)
    private String emailStatus;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        if (emailStatus == null) {
            emailStatus = "PENDING";
        }
    }
}

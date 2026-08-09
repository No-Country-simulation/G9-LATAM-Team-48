package com.alura.recommendation.model;

import com.alura.recommendation.dto.TipKey;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recommendation_catalog")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tip_key", unique = true, nullable = false)
    private TipKey tipKey;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // ALERTA, OPORTUNIDAD, INFO

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
package com.alura.recommendation.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_recommendations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRecommendationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, length = 100)
    private String userId; // Tipo String confirmado para evitar colisiones y alinear con autenticación

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "recommendation_id", nullable = false)
    private RecommendationEntity recommendation;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecommendationStatus status;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = RecommendationStatus.ACTIVE;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
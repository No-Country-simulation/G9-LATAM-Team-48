package com.alura.recommendation.rules;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;

import java.util.Optional;

public interface RecommendationRule {

    boolean applies(RecommendationRequest request);

    Optional<RecommendationItem> evaluate(RecommendationRequest request);

    default int getOrder() {
        return 100;
    }
}
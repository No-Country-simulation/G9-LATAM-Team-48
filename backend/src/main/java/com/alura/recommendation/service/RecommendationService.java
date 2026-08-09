package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;

public interface RecommendationService {

    /**
     * Generates and persists personalized energy recommendations for a given request,
     * ensuring duplicate prevention against active user history.
     * 
     * @param request RecommendationRequest containing user ID, category, and SHAP metrics.
     * @return RecommendationResponse containing active recommendations for the frontend.
     */
    RecommendationResponse generateRecommendations(RecommendationRequest request);
}
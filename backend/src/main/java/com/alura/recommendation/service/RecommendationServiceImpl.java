package com.alura.recommendation.service;

import com.alura.recommendation.dto.RecommendationItem;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.RecommendationResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RecommendationServiceImpl implements RecommendationService {

    @Override
    public RecommendationResponse generate(RecommendationRequest request) {
        String userId = request == null ? null : request.userId();
        String category = request == null ? null : request.category();
        List<RecommendationItem> items = RecommendationCatalog.forCategory(category);
        List<String> lines = items.stream()
                .map(item -> item.categoryKey() + " (" + item.priorityKey() + "): " + item.ahorro())
                .toList();
        return new RecommendationResponse(userId, lines);
    }

    public List<RecommendationItem> listForFrontend(String category) {
        if (category == null || category.isBlank()) {
            return RecommendationCatalog.all();
        }
        return RecommendationCatalog.forCategory(category);
    }
}

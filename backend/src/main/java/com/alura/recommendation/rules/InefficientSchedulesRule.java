package com.alura.recommendation.rules;

import com.alura.common.enums.ConsumptionCategory;
import com.alura.recommendation.dto.RecommendationRequest;
import com.alura.recommendation.dto.TipKey;
import org.springframework.stereotype.Component;

@Component
public class InefficientSchedulesRule implements RecommendationRule {

    @Override
    public boolean applies(RecommendationRequest request) {
        return request != null
                && ConsumptionCategory.HIGH.getModelValue().equalsIgnoreCase(request.category());
    }

    @Override
    public TipKey evaluate(RecommendationRequest request) {
        return TipKey.SCHEDULES;
    }
}

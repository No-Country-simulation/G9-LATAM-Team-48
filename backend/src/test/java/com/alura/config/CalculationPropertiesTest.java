package com.alura.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
class CalculationPropertiesTest {

    @Autowired
    CalculationProperties calculationProperties;

    @Test
    void loadsDefaultsFromApplicationYaml() {
        assertThat(calculationProperties.defaultOccupantsCount()).isEqualTo(2);
        assertThat(calculationProperties.defaultConsumptionPerPerson())
                .isEqualByComparingTo(new BigDecimal("150.0"));
        assertThat(calculationProperties.insulationFactorPoor())
                .isEqualByComparingTo(new BigDecimal("1.4"));
        assertThat(calculationProperties.ledProportionForEquipmentCount(12))
                .isEqualByComparingTo(new BigDecimal("0.75"));
        assertThat(calculationProperties.insulationFactorForRatio(0.6))
                .isEqualByComparingTo(new BigDecimal("1.4"));
    }
}

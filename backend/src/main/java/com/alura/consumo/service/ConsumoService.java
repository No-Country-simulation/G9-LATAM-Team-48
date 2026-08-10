package com.alura.consumo.service;

import com.alura.consumo.dto.ConsumoListDto;
import com.alura.consumo.dto.ConsumoMensual;
import com.alura.dataset.DatasetFeatureEngineeringDao;
import com.alura.dataset.DatasetMonthKeys;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ConsumoService {

    private final DatasetFeatureEngineeringDao datasetDao;

    public ConsumoService(DatasetFeatureEngineeringDao datasetDao) {
        this.datasetDao = datasetDao;
    }

    public ConsumoListDto listarConMeta(String tipoInmueble) {
        if (!datasetDao.hasRows()) {
            return new ConsumoListDto(false, List.of());
        }
        List<Map<String, Object>> rows = datasetDao.avgConsumoByMesNumero(tipoInmueble);
        if (rows.isEmpty()) {
            return new ConsumoListDto(false, List.of());
        }
        List<ConsumoMensual> consumos = rows.stream()
                .map(row -> new ConsumoMensual(
                        DatasetMonthKeys.fromMesNumero(intValue(row.get("mes_numero"))),
                        round(row.get("consumo")),
                        round(row.get("costo"))))
                .toList();
        return new ConsumoListDto(true, consumos);
    }

    public boolean isServingDataset() {
        return datasetDao.hasRows();
    }

    private static int intValue(Object value) {
        if (value instanceof Number number) {
            return number.intValue();
        }
        return 1;
    }

    private static int round(Object value) {
        if (value instanceof Number number) {
            return (int) Math.round(number.doubleValue());
        }
        return 0;
    }
}

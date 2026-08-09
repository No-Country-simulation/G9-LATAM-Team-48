package com.alura.consumo.service;

import com.alura.consumo.dto.ConsumoListDto;
import com.alura.consumo.dto.ConsumoMensual;
import com.alura.dataset.DatasetDemoFallback;
import com.alura.dataset.DatasetFeatureEngineeringDao;
import com.alura.dataset.DatasetMonthKeys;
import com.alura.dataset.DatasetTipoInmuebleFilter;
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
        if (datasetDao.hasRows()) {
            List<Map<String, Object>> rows = datasetDao.avgConsumoByMesNumero(tipoInmueble);
            if (!rows.isEmpty()) {
                List<ConsumoMensual> consumos = rows.stream()
                        .map(row -> new ConsumoMensual(
                                DatasetMonthKeys.fromMesNumero(intValue(row.get("mes_numero"))),
                                round(row.get("consumo")),
                                round(row.get("costo"))))
                        .toList();
                return new ConsumoListDto(true, consumos);
            }
        }
        return new ConsumoListDto(false, scaleFallback(tipoInmueble));
    }

    public boolean isServingDataset() {
        return datasetDao.hasRows();
    }

    private List<ConsumoMensual> scaleFallback(String tipoInmueble) {
        double factor = DatasetTipoInmuebleFilter.demoScaleFactor(tipoInmueble);
        List<ConsumoMensual> base = DatasetDemoFallback.consumos();
        if (factor == 1.0) {
            return base;
        }
        return base.stream()
                .map(c -> new ConsumoMensual(
                        c.mes(),
                        (int) Math.round(c.consumo() * factor),
                        (int) Math.round(c.costo() * factor)))
                .toList();
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

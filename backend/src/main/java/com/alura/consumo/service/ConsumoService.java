package com.alura.consumo.service;

import com.alura.consumo.dto.ConsumoMensual;
import com.alura.dataset.DatasetFeatureEngineeringDao;
import com.alura.dataset.DatasetMonthKeys;
import com.alura.dataset.DatasetTipoInmuebleFilter;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ConsumoService {

    private static final List<ConsumoMensual> FALLBACK = List.of(
            new ConsumoMensual("january", 320, 240),
            new ConsumoMensual("february", 340, 255),
            new ConsumoMensual("march", 310, 232),
            new ConsumoMensual("april", 360, 270),
            new ConsumoMensual("may", 350, 262),
            new ConsumoMensual("june", 380, 285)
    );

    private final DatasetFeatureEngineeringDao datasetDao;

    public ConsumoService(DatasetFeatureEngineeringDao datasetDao) {
        this.datasetDao = datasetDao;
    }

    public List<ConsumoMensual> listar(String tipoInmueble) {
        if (!datasetDao.hasRows()) {
            return scaleFallback(tipoInmueble);
        }
        List<Map<String, Object>> rows = datasetDao.avgConsumoByMesNumero(tipoInmueble);
        if (rows.isEmpty()) {
            return scaleFallback(tipoInmueble);
        }
        return rows.stream()
                .map(row -> new ConsumoMensual(
                        DatasetMonthKeys.fromMesNumero(intValue(row.get("mes_numero"))),
                        round(row.get("consumo")),
                        round(row.get("costo"))))
                .toList();
    }

    public boolean isServingDataset() {
        return datasetDao.hasRows();
    }

    private List<ConsumoMensual> scaleFallback(String tipoInmueble) {
        double factor = DatasetTipoInmuebleFilter.demoScaleFactor(tipoInmueble);
        if (factor == 1.0) {
            return FALLBACK;
        }
        return FALLBACK.stream()
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

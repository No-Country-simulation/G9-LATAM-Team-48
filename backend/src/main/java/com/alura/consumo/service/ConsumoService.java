package com.alura.consumo.service;

import com.alura.consumo.dto.ConsumoMensual;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConsumoService {

    public List<ConsumoMensual> listar() {
        return List.of(
                new ConsumoMensual("january", 320, 240),
                new ConsumoMensual("february", 340, 255),
                new ConsumoMensual("march", 310, 232),
                new ConsumoMensual("april", 360, 270),
                new ConsumoMensual("may", 350, 262),
                new ConsumoMensual("june", 380, 285)
        );
    }
}

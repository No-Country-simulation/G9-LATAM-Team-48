package com.alura.consumo.controller;

import com.alura.consumo.dto.ConsumoMensual;
import com.alura.consumo.service.ConsumoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/consumos")
@Tag(name = "Consumos", description = "Historial mensual de consumo")
public class ConsumoController {

    private final ConsumoService consumoService;

    public ConsumoController(ConsumoService consumoService) {
        this.consumoService = consumoService;
    }

    @GetMapping
    @Operation(summary = "Listar consumos mensuales (contrato frontend)")
    public ResponseEntity<List<ConsumoMensual>> listar() {
        return ResponseEntity.ok(consumoService.listar());
    }
}

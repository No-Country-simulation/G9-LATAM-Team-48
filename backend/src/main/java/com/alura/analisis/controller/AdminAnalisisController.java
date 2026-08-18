package com.alura.analisis.controller;

import com.alura.analisis.dto.AdminAnalisisItem;
import com.alura.analisis.dto.AdminRecalculoResult;
import com.alura.analisis.service.AdminAnalisisService;
import com.alura.common.dto.PageResponse;
import com.alura.common.response.ApiResponse;
import com.alura.common.util.PageRequests;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Consultas de Analisis IA para administradores.
 */
@RestController
@RequestMapping("/api/v1/admin/analisis")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Analisis", description = "Historial de Analisis IA (solo ADMIN)")
@SecurityRequirement(name = "bearerAuth")
public class AdminAnalisisController {

    private final AdminAnalisisService adminAnalisisService;

    @GetMapping
    @Operation(summary = "Listar consultas de Analisis IA (paginado)")
    public ResponseEntity<ApiResponse<PageResponse<AdminAnalisisItem>>> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "" + PageRequests.DEFAULT_SIZE) int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalisisService.listPage(page, size)));
    }

    @PostMapping("/recalcular")
    @Operation(summary = "Recalcular un lote de consultas historicas con el modelo IA actual")
    public ResponseEntity<ApiResponse<AdminRecalculoResult>> recalcular(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.ok(adminAnalisisService.recalcularConModelo(page, size)));
    }
}

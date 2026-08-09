package com.alura.recommendation.cli;

import com.alura.recommendation.model.RecommendationEntity;
import com.alura.recommendation.service.RecommendationAdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Scanner;

@Component
@ConditionalOnProperty(name = "app.cli.enabled", havingValue = "true")
public class RecommendationCliRunner implements CommandLineRunner {

    private final RecommendationAdminService adminService;

    public RecommendationCliRunner(RecommendationAdminService adminService) {
        this.adminService = adminService;
    }

    @Override
    public void run(String... args) throws Exception {
        adminService.seedCatalogIfEmpty();

        boolean exit = false;

        System.out.println("\n==================================================");
        System.out.println(" ⚡ EnergIA CLI - Admin Catálogo Recomendaciones ⚡ ");
        System.out.println("==================================================\n");

        try (Scanner scanner = new Scanner(System.in)) {
            while (!exit) {
                System.out.println("\nOpciones Administrativas:");
                System.out.println("1. Listar el Catálogo Actual de Base de Datos");
                System.out.println("2. Salir al flujo normal de Spring Boot");
                System.out.print("Seleccione una opción: ");

                if (!scanner.hasNextLine()) {
                    break;
                }

                String option = scanner.nextLine();

                switch (option) {
                    case "1":
                        List<RecommendationEntity> list = adminService.listAll();
                        System.out.println("\n--- Catálogo Maestro (" + list.size() + " registros) ---");
                        list.forEach(r -> System.out.printf("[%d] %s | %s | Tipo: %s%n",
                                r.getId(),
                                r.getTipKey().name(),
                                r.getTitle(),
                                r.getType()));
                        break;
                    case "2":
                        System.out.println("Cerrando consola CLI y devolviendo el control...");
                        exit = true;
                        break;
                    default:
                        System.out.println("Opción no válida. Intente de nuevo.");
                }
            }
        }
    }
}
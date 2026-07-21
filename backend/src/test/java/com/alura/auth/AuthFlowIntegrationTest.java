package com.alura.auth;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Verifica el flujo de autorizacion JWT de extremo a extremo:
 * registro -> verificar email -> login -> acceso a ruta protegida.
 *
 * <p>Usa el perfil "test" que activa InMemoryUserRepository y H2 en memoria.</p>
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registerVerifyLoginAndAccessProtectedResource() throws Exception {
        String registerBody = """
                {"name":"Ana Torres","email":"ana@example.com","password":"secret123"}
                """;

        // 1) Registro -> 201 sin JWT; con token de verificacion (dev)
        String registerResponse = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.verificationToken").isNotEmpty())
                .andExpect(jsonPath("$.data.accessToken").doesNotExist())
                .andReturn().getResponse().getContentAsString();

        String verifyToken = extractField(registerResponse, "verificationToken");

        // 2) Login sin verificar -> 409
        String loginBody = """
                {"email":"ana@example.com","password":"secret123"}
                """;
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isConflict());

        // 3) Verificar email
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"" + verifyToken + "\"}"))
                .andExpect(status().isOk());

        // 4) Login -> 200 y token emitido
        String loginResponse = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").isNotEmpty())
                .andReturn().getResponse().getContentAsString();

        String token = extractField(loginResponse, "accessToken");

        // 5) Ruta protegida sin token -> 401/403
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().is4xxClientError());

        // 6) Ruta protegida con token -> 200 y datos del usuario
        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.email").value("ana@example.com"))
                .andExpect(jsonPath("$.data.role").value("USER"));
    }

    @Test
    void loginWithWrongPasswordReturnsUnauthorized() throws Exception {
        String registerBody = """
                {"name":"Bruno Diaz","email":"bruno@example.com","password":"secret123"}
                """;
        String registerResponse = mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerBody))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String verifyToken = extractField(registerResponse, "verificationToken");
        mockMvc.perform(post("/api/v1/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"" + verifyToken + "\"}"))
                .andExpect(status().isOk());

        String wrongLogin = """
                {"email":"bruno@example.com","password":"wrong-password"}
                """;
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(wrongLogin))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void registerWithInvalidPayloadReturnsBadRequest() throws Exception {
        String invalidBody = """
                {"name":"","email":"not-an-email","password":"123"}
                """;
        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidBody))
                .andExpect(status().isBadRequest());
    }

    private String extractField(String responseBody, String field) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        return root.path("data").path(field).asText();
    }
}

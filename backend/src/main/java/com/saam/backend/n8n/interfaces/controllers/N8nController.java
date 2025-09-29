package com.saam.backend.n8n.interfaces.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.saam.backend.n8n.interfaces.docs.N8nControllerDocs;
import com.saam.backend.products.application.dto.PaginatedResponseDTO;
import com.saam.backend.products.application.dto.ProductResponseDTO;
import com.saam.backend.products.application.usecases.GetAllProductsUseCase;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class N8nController implements N8nControllerDocs {

    @Value("${n8n.webhook.url:https://kledsonv.app.n8n.cloud/webhook/relatorios}")
    private String n8nWebhookUrl;

    @Value("${n8n.webhook.welcome.url:https://kledsonv.app.n8n.cloud/webhook/welcome}")
    private String n8nWebhookWelcomeUrl;

    private final GetAllProductsUseCase getAllProductsUseCase;
    private final RestTemplate rest = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper()
            .setSerializationInclusion(JsonInclude.Include.NON_NULL)
            .registerModule(new JavaTimeModule());

    @PostMapping("/generate")
    @Override
    public ResponseEntity<?> generate(
            @Valid @RequestBody ReportPayload payload,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = false) String authorization
    ) {
        try {
            PaginatedResponseDTO<ProductResponseDTO> productsResponse = getAllProductsUseCase.execute(0, 1000);
            List<ProductResponseDTO> products = productsResponse.getContent();

            payload.setProducts(products);

            if (!StringUtils.hasText(payload.getName())) {
                payload.setName("Usuário");
            } else {
                payload.setName(payload.getName().trim());
            }

            String json = mapper.writeValueAsString(payload);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            if (StringUtils.hasText(authorization)) {
                headers.add(HttpHeaders.AUTHORIZATION, authorization);
            }

            HttpEntity<String> req = new HttpEntity<>(json, headers);

            ResponseEntity<String> n8nRes = rest.postForEntity(n8nWebhookUrl, req, String.class);

            return ResponseEntity.status(n8nRes.getStatusCode()).body(n8nRes.getBody());

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiError(502, "Falha ao gerar relatório", ex.getMessage()));
        }
    }

    @PostMapping("/welcome")
    @Override
    public ResponseEntity<?> welcomeUser(
            @Valid @RequestBody WelcomePayload payload,
            @RequestHeader(value = HttpHeaders.AUTHORIZATION, required = true) String authorization
    ) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.add(HttpHeaders.AUTHORIZATION, authorization);

            String json = mapper.writeValueAsString(payload);

            HttpEntity<String> req = new HttpEntity<>(json, headers);
            ResponseEntity<String> n8nRes = rest.postForEntity(n8nWebhookWelcomeUrl, req, String.class);

            return ResponseEntity.status(n8nRes.getStatusCode()).body(n8nRes.getBody());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ApiError(502, "Falha ao contactar serviço de automação", ex.getMessage()));
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ReportPayload {

        private String type;
        private String format;
        private String email;
        private String token;
        private String name;

        private Integer totalProdutos;
        private Double valorTotal;
        private String startDate;
        private String endDate;

        private List<ProductResponseDTO> products;

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getFormat() {
            return format;
        }

        public void setFormat(String format) {
            this.format = format;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getTotalProdutos() {
            return totalProdutos;
        }

        public void setTotalProdutos(Integer totalProdutos) {
            this.totalProdutos = totalProdutos;
        }

        public Double getValorTotal() {
            return valorTotal;
        }

        public void setValorTotal(Double valorTotal) {
            this.valorTotal = valorTotal;
        }

        public String getStartDate() {
            return startDate;
        }

        public void setStartDate(String startDate) {
            this.startDate = startDate;
        }

        public String getEndDate() {
            return endDate;
        }

        public void setEndDate(String endDate) {
            this.endDate = endDate;
        }

        public List<ProductResponseDTO> getProducts() {
            return products;
        }

        public void setProducts(List<ProductResponseDTO> products) {
            this.products = products;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class WelcomePayload {

        private String name;
        private String email;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ApiError {

        private final int status;
        private final String error;
        private final String message;

        public ApiError(int status, String error, String message) {
            this.status = status;
            this.error = error;
            this.message = message;
        }

        public int getStatus() {
            return status;
        }

        public String getError() {
            return error;
        }

        public String getMessage() {
            return message;
        }
    }
}

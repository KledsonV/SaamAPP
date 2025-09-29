package com.saam.backend.auth.application.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class CreateResponseDTO {

    private UUID id;
    private String username;
    private String email;
    private String role;
    private Boolean active;
    private String token; 
}

package com.tmsbackend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;

    private String refreshToken;

    private String tokenType;

    private Long expiresIn;

}
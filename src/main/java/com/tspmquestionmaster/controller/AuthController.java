package com.tspmquestionmaster.controller;

import com.tspmquestionmaster.dto.request.LoginRequest;
import com.tspmquestionmaster.dto.response.LoginResponse;
import com.tspmquestionmaster.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        return authService.login(request);

    }

}
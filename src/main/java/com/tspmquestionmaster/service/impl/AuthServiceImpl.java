package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.LoginRequest;
import com.tspmquestionmaster.dto.response.LoginResponse;
import com.tspmquestionmaster.entity.User;
import com.tspmquestionmaster.repository.UserRepository;
import com.tspmquestionmaster.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.tspmquestionmaster.enums.Role;
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new RuntimeException("User account is inactive");
        }

        // Validate login type
        if ("INTERNAL".equalsIgnoreCase(request.getLoginType())) {

            if (user.getRole() != Role.ADMIN &&
                    user.getRole() != Role.REVIEWER) {

                throw new RuntimeException("Please use Vendor Login");

            }

        } else if ("VENDOR".equalsIgnoreCase(request.getLoginType())) {

            if (user.getRole() != Role.VENDOR) {

                throw new RuntimeException("Please use Internal Login");

            }

        } else {

            throw new RuntimeException("Invalid login type");

        }

        return new LoginResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                "Login successful",
                user.getEntity() != null
                        ? user.getEntity().getId()
                        : null
        );
    }}
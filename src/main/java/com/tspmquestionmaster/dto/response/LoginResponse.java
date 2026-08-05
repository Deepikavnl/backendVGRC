package com.tspmquestionmaster.dto.response;

import com.tspmquestionmaster.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {

    private Long id;

    private String name;

    private String email;

    private Role role;

    private String message;
    private Long entityId;
}
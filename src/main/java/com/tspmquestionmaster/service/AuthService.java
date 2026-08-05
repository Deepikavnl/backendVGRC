package com.tspmquestionmaster.service;

import com.tspmquestionmaster.dto.request.LoginRequest;
import com.tspmquestionmaster.dto.response.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

}
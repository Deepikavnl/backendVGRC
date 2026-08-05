package com.tspmquestionmaster.service.impl;

import com.tspmquestionmaster.dto.request.LoginRequest;
import com.tspmquestionmaster.dto.response.LoginResponse;
import com.tspmquestionmaster.entity.ThirdPartyEntity;
import com.tspmquestionmaster.entity.User;
import com.tspmquestionmaster.enums.Role;
import com.tspmquestionmaster.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthServiceImpl service;

    @Test
    void login_ShouldLoginAdminSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("123");
        request.setLoginType("INTERNAL");

        User user = new User();
        user.setId(1L);
        user.setName("Admin");
        user.setEmail("admin@test.com");
        user.setPassword("123");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = service.login(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Admin", response.getName());
        assertEquals(Role.ADMIN, response.getRole());
        assertEquals("Login successful", response.getMessage());

        verify(userRepository).findByEmail("admin@test.com");
    }

    @Test
    void login_ShouldLoginVendorSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setEmail("vendor@test.com");
        request.setPassword("123");
        request.setLoginType("VENDOR");

        ThirdPartyEntity entity = new ThirdPartyEntity();
        entity.setId(100L);

        User user = new User();
        user.setId(2L);
        user.setName("Vendor");
        user.setEmail("vendor@test.com");
        user.setPassword("123");
        user.setRole(Role.VENDOR);
        user.setActive(true);
        user.setEntity(entity);

        when(userRepository.findByEmail("vendor@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = service.login(request);

        assertNotNull(response);
        assertEquals(100L, response.getEntityId());

        verify(userRepository).findByEmail("vendor@test.com");
    }
    @Test
    void login_ShouldThrowException_WhenEmailNotFound() {

        LoginRequest request = new LoginRequest();
        request.setEmail("unknown@test.com");
        request.setPassword("123");
        request.setLoginType("INTERNAL");

        when(userRepository.findByEmail("unknown@test.com"))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.login(request)
        );

        assertEquals(
                "Invalid email or password",
                exception.getMessage()
        );

        verify(userRepository).findByEmail("unknown@test.com");
    }

    @Test
    void login_ShouldThrowException_WhenPasswordIsWrong() {

        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("wrong");
        request.setLoginType("INTERNAL");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("123");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.login(request)
        );

        assertEquals(
                "Invalid email or password",
                exception.getMessage()
        );
    }

    @Test
    void login_ShouldThrowException_WhenUserIsInactive() {

        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("123");
        request.setLoginType("INTERNAL");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("123");
        user.setRole(Role.ADMIN);
        user.setActive(false);

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.login(request)
        );

        assertEquals(
                "User account is inactive",
                exception.getMessage()
        );
    }

    @Test
    void login_ShouldThrowException_WhenVendorUsesInternalLogin() {

        LoginRequest request = new LoginRequest();
        request.setEmail("vendor@test.com");
        request.setPassword("123");
        request.setLoginType("INTERNAL");

        User user = new User();
        user.setEmail("vendor@test.com");
        user.setPassword("123");
        user.setRole(Role.VENDOR);
        user.setActive(true);

        when(userRepository.findByEmail("vendor@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.login(request)
        );

        assertEquals(
                "Please use Vendor Login",
                exception.getMessage()
        );
    }
    @Test
    void login_ShouldThrowException_WhenInternalUserUsesVendorLogin() {

        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("123");
        request.setLoginType("VENDOR");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("123");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.login(request)
        );

        assertEquals(
                "Please use Internal Login",
                exception.getMessage()
        );
    }

    @Test
    void login_ShouldThrowException_WhenLoginTypeIsInvalid() {

        LoginRequest request = new LoginRequest();
        request.setEmail("admin@test.com");
        request.setPassword("123");
        request.setLoginType("UNKNOWN");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("123");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        when(userRepository.findByEmail("admin@test.com"))
                .thenReturn(Optional.of(user));

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> service.login(request)
        );

        assertEquals(
                "Invalid login type",
                exception.getMessage()
        );
    }

    @Test
    void login_ShouldLoginReviewerSuccessfully() {

        LoginRequest request = new LoginRequest();
        request.setEmail("reviewer@test.com");
        request.setPassword("123");
        request.setLoginType("INTERNAL");

        User user = new User();
        user.setId(3L);
        user.setName("Reviewer");
        user.setEmail("reviewer@test.com");
        user.setPassword("123");
        user.setRole(Role.REVIEWER);
        user.setActive(true);

        when(userRepository.findByEmail("reviewer@test.com"))
                .thenReturn(Optional.of(user));

        LoginResponse response = service.login(request);

        assertNotNull(response);
        assertEquals(3L, response.getId());
        assertEquals(Role.REVIEWER, response.getRole());
        assertEquals("Login successful", response.getMessage());

        verify(userRepository).findByEmail("reviewer@test.com");
    }

}
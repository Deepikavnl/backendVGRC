-- ============================================
-- Enterprise Ticket Management System
-- V1__Create_Initial_Tables.sql
-- ============================================

-- ============================================
-- ROLES TABLE
-- ============================================

CREATE TABLE roles (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(50) NOT NULL UNIQUE,
                       description VARCHAR(255),
                       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE users (

                       id BIGSERIAL PRIMARY KEY,

                       employee_id VARCHAR(50) NOT NULL UNIQUE,

                       first_name VARCHAR(100) NOT NULL,

                       last_name VARCHAR(100),

                       email VARCHAR(150) NOT NULL UNIQUE,

                       password VARCHAR(255) NOT NULL,

                       phone VARCHAR(20),

                       designation VARCHAR(100),

                       department VARCHAR(100),

                       profile_image VARCHAR(500),

                       account_status VARCHAR(30) NOT NULL,

                       email_verified BOOLEAN DEFAULT FALSE,

                       last_login TIMESTAMP,

                       created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                       role_id BIGINT NOT NULL,

                       CONSTRAINT fk_user_role
                           FOREIGN KEY(role_id)
                               REFERENCES roles(id)
);

-- ============================================
-- REFRESH TOKENS
-- ============================================

CREATE TABLE refresh_tokens (

                                id BIGSERIAL PRIMARY KEY,

                                token VARCHAR(500) NOT NULL UNIQUE,

                                expiry_date TIMESTAMP NOT NULL,

                                revoked BOOLEAN DEFAULT FALSE,

                                user_id BIGINT NOT NULL UNIQUE,

                                CONSTRAINT fk_refresh_user
                                    FOREIGN KEY(user_id)
                                        REFERENCES users(id)
                                        ON DELETE CASCADE
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_users_employee
    ON users(employee_id);

CREATE INDEX idx_refresh_token
    ON refresh_tokens(token);

-- ============================================
-- DEFAULT ROLES
-- ============================================

INSERT INTO roles(name,description)
VALUES
    ('USER','Normal Employee'),
    ('AGENT','Support Engineer'),
    ('ADMIN','System Administrator'),
    ('SUPER_ADMIN','Application Owner');
-- ============================================================
-- URL Shortener Database Schema
-- ============================================================

USE url_shortener;


-- ============================================================
-- USERS
-- ============================================================

CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);


-- ============================================================
-- URLS
-- ============================================================

CREATE TABLE urls (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    user_id BIGINT UNSIGNED NOT NULL,

    original_url TEXT NOT NULL,

    short_code VARCHAR(16) NOT NULL UNIQUE,

    expires_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_urls_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_urls_user_created (user_id, created_at)
);


-- ============================================================
-- CLICKS
-- ============================================================

CREATE TABLE clicks (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    url_id BIGINT UNSIGNED NOT NULL,

    ip_address VARBINARY(16),

    user_agent TEXT,

    referrer TEXT,

    clicked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_clicks_url
        FOREIGN KEY (url_id)
        REFERENCES urls(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_clicks_url_clicked (url_id, clicked_at)
);
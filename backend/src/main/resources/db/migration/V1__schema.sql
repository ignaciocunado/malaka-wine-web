CREATE TABLE users (
    id            BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100),
    created_at    DATETIME(6)  NOT NULL,
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE plans (
    id           BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    code         VARCHAR(40)  NOT NULL,
    name         VARCHAR(100) NOT NULL,
    tagline      VARCHAR(255) NOT NULL,
    contents     VARCHAR(255) NOT NULL,
    product_type VARCHAR(20)  NOT NULL,
    price_cents  INT          NOT NULL,
    featured     BOOLEAN      NOT NULL DEFAULT FALSE,
    sort_order   INT          NOT NULL DEFAULT 0,
    CONSTRAINT uk_plans_code UNIQUE (code)
);

CREATE TABLE producers (
    id          BIGINT       NOT NULL AUTO_INCREMENT PRIMARY KEY,
    slug        VARCHAR(80)  NOT NULL,
    name        VARCHAR(120) NOT NULL,
    kind        VARCHAR(20)  NOT NULL,
    town        VARCHAR(80)  NOT NULL,
    area        VARCHAR(80)  NOT NULL,
    specialty   VARCHAR(120) NOT NULL,
    description VARCHAR(500) NOT NULL,
    CONSTRAINT uk_producers_slug UNIQUE (slug)
);

CREATE TABLE taste_profiles (
    id                 BIGINT        NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id            BIGINT        NOT NULL,
    product_preference VARCHAR(20)   NOT NULL,
    wine_body          INT           NOT NULL,
    wine_sweetness     VARCHAR(20)   NOT NULL,
    adventurousness    INT           NOT NULL,
    oil_intensity      VARCHAR(20)   NOT NULL,
    bottles_per_box    INT           NOT NULL,
    delivery_frequency VARCHAR(20)   NOT NULL,
    monthly_budget_eur INT           NOT NULL,
    notes              VARCHAR(1000),
    updated_at         DATETIME(6)   NOT NULL,
    CONSTRAINT uk_taste_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_taste_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE taste_profile_wine_styles (
    taste_profile_id BIGINT      NOT NULL,
    wine_style       VARCHAR(20) NOT NULL,
    PRIMARY KEY (taste_profile_id, wine_style),
    CONSTRAINT fk_tpws_profile FOREIGN KEY (taste_profile_id) REFERENCES taste_profiles (id) ON DELETE CASCADE
);

CREATE TABLE taste_profile_olive_varieties (
    taste_profile_id BIGINT      NOT NULL,
    olive_variety    VARCHAR(20) NOT NULL,
    PRIMARY KEY (taste_profile_id, olive_variety),
    CONSTRAINT fk_tpov_profile FOREIGN KEY (taste_profile_id) REFERENCES taste_profiles (id) ON DELETE CASCADE
);

CREATE TABLE taste_profile_oil_uses (
    taste_profile_id BIGINT      NOT NULL,
    oil_use          VARCHAR(20) NOT NULL,
    PRIMARY KEY (taste_profile_id, oil_use),
    CONSTRAINT fk_tpou_profile FOREIGN KEY (taste_profile_id) REFERENCES taste_profiles (id) ON DELETE CASCADE
);

CREATE TABLE subscriptions (
    id            BIGINT      NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id       BIGINT      NOT NULL,
    plan_id       BIGINT      NOT NULL,
    status        VARCHAR(20) NOT NULL,
    started_at    DATETIME(6) NOT NULL,
    next_box_date DATE,
    cancelled_at  DATETIME(6),
    CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES plans (id)
);

CREATE INDEX idx_subscriptions_user_status ON subscriptions (user_id, status);

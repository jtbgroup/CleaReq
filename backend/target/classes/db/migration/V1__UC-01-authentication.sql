-- Use case: UC-01

CREATE TABLE app_user (
    id        UUID         PRIMARY KEY,
    username  VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL,
    enabled   BOOLEAN      NOT NULL DEFAULT TRUE
);

CREATE TABLE app_user_roles (
    user_id UUID NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    role    VARCHAR(50) NOT NULL,
    PRIMARY KEY (user_id, role)
);

INSERT INTO app_user (id, username, password, enabled)
VALUES (
    gen_random_uuid(),
    'admin',
    '$2b$12$Cjcy4.MrV8DCzBOQlLSdVuY5iKWeU7D1p7uGY0TqdK468LsB4v4vS',
    TRUE
);

INSERT INTO app_user_roles (user_id, role)
SELECT id, 'ADMIN' FROM app_user WHERE username = 'admin';

-- Use case: UC-04

CREATE TABLE person (
    id         UUID         PRIMARY KEY,
    last_name  VARCHAR(100) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    email      VARCHAR(320) NOT NULL UNIQUE,
    function_id UUID        NOT NULL REFERENCES catalog_entry(id),
    enabled    BOOLEAN      NOT NULL DEFAULT TRUE
);

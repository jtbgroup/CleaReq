-- Use case: UC-03

CREATE TABLE catalog_type (
    id    UUID         PRIMARY KEY,
    code  VARCHAR(50)  NOT NULL UNIQUE,
    label VARCHAR(100) NOT NULL
);

CREATE TABLE catalog_entry (
    id              UUID          PRIMARY KEY,
    catalog_type_id UUID          NOT NULL REFERENCES catalog_type(id) ON DELETE CASCADE,
    label           VARCHAR(150)  NOT NULL,
    enabled         BOOLEAN       NOT NULL DEFAULT TRUE,
    UNIQUE (catalog_type_id, label)
);

INSERT INTO catalog_type (id, code, label)
VALUES (gen_random_uuid(), 'FUNCTION', 'Function');

-- Use case: UC-05

CREATE TABLE population (
    id     UUID         PRIMARY KEY,
    name   VARCHAR(150) NOT NULL UNIQUE,
    status VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE population_member (
    id             UUID        PRIMARY KEY,
    population_id  UUID        NOT NULL REFERENCES population(id) ON DELETE CASCADE,
    person_id      UUID        NOT NULL REFERENCES person(id),
    function_id    UUID        NOT NULL REFERENCES catalog_entry(id),
    start_date     DATE        NOT NULL,
    end_date       DATE
);
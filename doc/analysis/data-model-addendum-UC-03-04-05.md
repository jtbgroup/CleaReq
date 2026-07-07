# Data Model Addendum — UC-03, UC-04, UC-05

> This file lists the entities introduced by UC-03/04/05, to be merged into the project's main `doc/architecture/data-model.md` (not provided in this session, so no destructive edit was attempted).

## catalog_type
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| code | VARCHAR, UNIQUE | e.g. `FUNCTION` |
| label | VARCHAR | display name |

## catalog_entry
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| catalog_type_id | UUID (FK -> catalog_type) | |
| label | VARCHAR | unique within catalog_type_id |
| enabled | BOOLEAN | soft delete |

## person
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| last_name | VARCHAR | |
| first_name | VARCHAR | |
| email | VARCHAR, UNIQUE | identity key |
| function_id | UUID (FK -> catalog_entry) | must be type FUNCTION |
| enabled | BOOLEAN | soft delete; disabling cascades to close active population_member rows |

## population
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| name | VARCHAR, UNIQUE | |
| status | ENUM | ACTIVE / CLOSED |

## population_member
| Column | Type | Notes |
|---|---|---|
| id | UUID (PK) | |
| population_id | UUID (FK -> population) | |
| person_id | UUID (FK -> person) | not unique alone — multiple periods allowed |
| function_id | UUID (FK -> catalog_entry) | mandatory, type FUNCTION |
| start_date | DATE | |
| end_date | DATE, nullable | auto-set on person disable |

## Relationships

- `catalog_entry` (N) — (1) `catalog_type`
- `person` (N) — (1) `catalog_entry` [function]
- `population_member` (N) — (1) `population`
- `population_member` (N) — (1) `person`
- `population_member` (N) — (1) `catalog_entry` [function]

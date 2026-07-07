# Roles & Access Matrix

## Roles

- **ADMIN**: manages the platform (users, catalogs, persons, populations for now).
- **POPULATION_MANAGER** *(renamed from `PROJECT_MANAGER`)*: records information about their project/population. Currently has no dedicated access beyond authentication (UC-01); all catalog, person, and population management is temporarily restricted to ADMIN (see notes below).

> **Renaming note**: `PROJECT_MANAGER` is renamed to `POPULATION_MANAGER` across the whole application: the `Role` enum (backend), Angular role checks, `doc/analysis/prompts/UC-01-authentication-prompt.md`, `doc/analysis/prompts/UC-02-user-management-prompt.md`, related user stories (US-003, US-004, US-005), and any already-applied Flyway seed data referencing this role name. Since no code has been implemented yet, this is a pure naming update to apply from the next generation onward — no data migration is required.

## Access Matrix

| Feature                          | ADMIN | POPULATION_MANAGER |
|-----------------------------------|:-----:|:-------------------:|
| Login / Logout                    |  ✅   |         ✅           |
| Change own password               |  ✅   |         ✅           |
| User management (UC-02)           |  ✅   |         ❌           |
| Catalog management (UC-03)        |  ✅   |         ❌           |
| Person management (UC-04)         |  ✅   |         ❌           |
| Population management (UC-05)     |  ✅   |         ❌           |

## Notes

- Access for `POPULATION_MANAGER` on catalogs, persons, and populations is intentionally out of scope for now. It is expected to evolve in a future iteration (e.g. read access to populations, or management restricted to the populations the POPULATION_MANAGER is responsible for). Introducing that access should only require adding `hasRole("POPULATION_MANAGER")` (or a combined check) to the relevant `SecurityFilterChain` rules and adjusting frontend guards — no structural changes to the entities described in UC-03/04/05.

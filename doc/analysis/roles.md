# Roles & Access Matrix

## Roles

- **ADMIN**: manages the platform (users, catalogs, persons, populations for now).
- **POPULATION_MANAGER**: records information about their project/population. Currently has no dedicated access beyond authentication (UC-01); all catalog, person, and population management is temporarily restricted to ADMIN (see notes below).
- **SECURITY_OFFICER**: handles security-related processing. For the currently implemented scope, this role has authenticated access only (same as POPULATION_MANAGER) and no dedicated management endpoint yet.

> **Alignment note**: `PROJECT_MANAGER` is replaced by `POPULATION_MANAGER` across documentation, code, and demo seed data. The project baseline now directly uses the target role model.

## Access Matrix

| Feature                          | ADMIN | POPULATION_MANAGER | SECURITY_OFFICER |
|-----------------------------------|:-----:|:-------------------:|:----------------:|
| Login / Logout                    |  ✅   |         ✅           |        ✅         |
| Change own password               |  ✅   |         ✅           |        ✅         |
| User management (UC-02)           |  ✅   |         ❌           |        ❌         |
| Catalog management (UC-03)        |  ✅   |         ❌           |        ❌         |
| Person management (UC-04)         |  ✅   |         ❌           |        ❌         |
| Population management (UC-05)     |  ✅   |         ❌           |        ❌         |
| Request management (UC-06)        |  ✅   |  ✅ (draft/submit + full CDN account lifecycle) | ✅ (screening/security clearance processing) |

## Notes

- Access for `POPULATION_MANAGER` on catalogs, persons, and populations is intentionally out of scope for now. It is expected to evolve in a future iteration (e.g. read access to populations, or management restricted to the populations the POPULATION_MANAGER is responsible for). Introducing that access should only require adding `hasRole("POPULATION_MANAGER")` (or a combined check) to the relevant `SecurityFilterChain` rules and adjusting frontend guards — no structural changes to the entities described in UC-03/04/05.
- Access for `SECURITY_OFFICER` beyond authentication is defined in UC-06 request processing flows (screening and security clearance post-submit processing).

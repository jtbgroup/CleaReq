# UC-03 - Catalog Management — Generation Prompt

## Context

This prompt is used to generate all the code and resources required to implement UC-03 (Catalog Management) in the webappboilerplate application. This use case introduces a **generic** catalog mechanism, so that new catalog types can be added later as a data operation, without a new Flyway migration. The first concrete catalog is **Function**, consumed later by UC-04 (Person Management).

### Stack

- **Backend**: Java 21, Spring Boot 3+, Spring Security (session-based, BCrypt 12), Spring Data JPA, Flyway, PostgreSQL 17+
- **Frontend**: Angular 19+, Angular Material, standalone components, lazy-loaded feature modules
- **Architecture**: Monorepo — backend serves the built frontend as static assets on port 8090 (production)

### Key Constraints

- Never use deprecated or legacy APIs.
- Only ADMIN can manage catalog types and catalog entries.
- The data model must be **generic**: a single pair of tables (`catalog_type`, `catalog_entry`) must support any number of catalog types without further schema changes.
- Disabling an entry is a soft delete (`enabled=false`); it must never be physically deleted, to preserve historical references.
- Entry labels must be unique within a given catalog type.

---

## What to Generate

### 1. Backend

#### Entities

- `CatalogType` entity: `id` (UUID), `code` (unique, e.g. `FUNCTION`), `label` (display name).
- `CatalogEntry` entity: `id` (UUID), `catalogType` (FK to `CatalogType`), `label`, `enabled` (boolean). Unique constraint on `(catalog_type_id, label)`.

#### Repositories

- `CatalogTypeRepository extends JpaRepository<CatalogType, UUID>`, method `Optional<CatalogType> findByCode(String code)`.
- `CatalogEntryRepository extends JpaRepository<CatalogEntry, UUID>`, methods `List<CatalogEntry> findByCatalogTypeCode(String code)`, `List<CatalogEntry> findByCatalogTypeCodeAndEnabledTrue(String code)`.

#### Catalog API

Endpoints under `/api/catalogs` (all ADMIN only):

- `GET /api/catalogs`: list catalog types.
- `GET /api/catalogs/{typeCode}/entries`: list entries of a catalog type (all, with status).
- `POST /api/catalogs/{typeCode}/entries`: create an entry `{ label }`. Validate uniqueness of label within the type.
- `PUT /api/catalogs/{typeCode}/entries/{id}`: update the label of an entry. Validate uniqueness.
- `POST /api/catalogs/{typeCode}/entries/{id}/disable`: soft delete (`enabled=false`).
- `POST /api/catalogs/{typeCode}/entries/{id}/enable`: re-enable (`enabled=true`).

#### DTOs

```java
// CatalogDtos.java
record CatalogTypeResponse(UUID id, String code, String label) {}
record CatalogEntryResponse(UUID id, String label, boolean enabled) {}
record CreateCatalogEntryRequest(String label) {}
record UpdateCatalogEntryRequest(String label) {}
```

#### Security

- `SecurityFilterChain`: protect `/api/catalogs/**` with `hasRole("ADMIN")`.

#### Flyway Migration

- File: `V3__UC-03-catalog-management.sql`
- SQL header comment: `-- Use case: UC-03`
- Creates `catalog_type (id, code UNIQUE, label)`.
- Creates `catalog_entry (id, catalog_type_id FK, label, enabled, UNIQUE(catalog_type_id, label))`.
- Inserts one row into `catalog_type`: code `FUNCTION`, label `Function`.
- Optionally seeds a couple of example `FUNCTION` entries (to be confirmed with the product owner before seeding real business data).

---

### 2. Frontend

#### Catalog Management Feature

Lazy-loaded at `/admin/catalogs` (ADMIN only via `adminGuard`).

##### Catalog Type List / Selector

- Displays available catalog types; selecting one navigates to its entries.

##### Catalog Entry List Page

- Table columns: `label`, `status` (enabled/disabled), `actions` (Edit, Disable/Enable).
- "Create entry" action opens a form with a single `label` field.

#### Catalog Service

```typescript
interface CatalogTypeDto { id: string; code: string; label: string; }
interface CatalogEntryDto { id: string; label: string; enabled: boolean; }
// Methods: listTypes(), listEntries(typeCode), createEntry(typeCode, label),
//          updateEntry(typeCode, id, label), disableEntry(typeCode, id), enableEntry(typeCode, id)
```

---

## Expected File Structure

```
backend/
├── src/main/java/.../
│   ├── entity/CatalogType.java
│   ├── entity/CatalogEntry.java
│   ├── repository/CatalogTypeRepository.java
│   ├── repository/CatalogEntryRepository.java
│   ├── dto/CatalogDtos.java
│   ├── controller/CatalogController.java
│   └── service/CatalogService.java
└── src/main/resources/
    └── db/migration/V3__UC-03-catalog-management.sql

frontend/
└── src/app/
    └── features/
        └── catalogs/
            ├── catalog-type-list/catalog-type-list.component.ts
            └── catalog-entry-list/catalog-entry-list.component.ts
```

---

## Validation Checklist

- [ ] ADMIN can list catalog types and navigate to their entries.
- [ ] ADMIN can create, edit, disable, and enable entries.
- [ ] Duplicate labels within the same catalog type are rejected.
- [ ] Disabling an entry does not delete it and does not break existing references.
- [ ] Disabled entries are excluded from selection lists used by other modules (e.g. Person creation).
- [ ] Adding a new catalog type requires only a data insert into `catalog_type`, no new migration.
- [ ] Flyway V3 runs cleanly on a database already containing V1/V2.

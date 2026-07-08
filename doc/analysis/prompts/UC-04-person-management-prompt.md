# UC-04 - Person Management — Generation Prompt

## Context

This prompt is used to generate all the code and resources required to implement UC-04 (Person Management) in the ClearReq application. A person is a single, reusable reference record (identified by email) that will later be assigned to populations (UC-05). Disabling a person must cascade to close any active population membership.

### Stack

- **Backend**: Java, Spring Boot, Spring Security (session-based, BCrypt 12), Spring Data JPA, Flyway, PostgreSQL
- **Frontend**: Angular, Angular Material, standalone components, lazy-loaded feature modules
- **Architecture**: Monorepo — backend serves the built frontend as static assets on port 8090 (production)

### Key Constraints

- Never use deprecated or legacy APIs.
- Only ADMIN can manage persons.
- Email is the unique identity key of a person and is immutable after creation.
- A person's function must reference an enabled `catalog_entry` of catalog type `FUNCTION` (UC-03) at assignment time.
- Disabling a person (soft delete) must automatically close (set `end_date`) every currently active membership of that person in `population_member` (introduced by UC-05) — this logic must be implemented so it works once UC-05 is in place; if UC-05 tables do not yet exist at the time UC-04 is generated, implement the cascade in a way that safely no-ops or is wired in via a service dependency to be completed when UC-05 lands.

---

## What to Generate

### 1. Backend

#### Entity

- `Person` entity: `id` (UUID), `lastName`, `firstName`, `email` (unique), `function` (FK to `CatalogEntry`), `enabled` (boolean).

#### Repository

- `PersonRepository extends JpaRepository<Person, UUID>`, method `Optional<Person> findByEmail(String email)`.

#### Person API

Endpoints under `/api/persons` (ADMIN only):

- `GET /api/persons`: list all persons, including function label and status.
- `POST /api/persons`: create a person `{ lastName, firstName, email, functionId }`. Validate email uniqueness, email format, function references an enabled `CatalogEntry` of type `FUNCTION`.
- `PUT /api/persons/{id}`: update `lastName`, `firstName`, `functionId` (email is not updatable).
- `POST /api/persons/{id}/disable`: set `enabled=false`; trigger closure of active population memberships (see Key Constraints).

#### DTOs

```java
// PersonDtos.java
record PersonResponse(UUID id, String lastName, String firstName, String email, String functionLabel, boolean enabled) {}
record CreatePersonRequest(String lastName, String firstName, String email, UUID functionId) {}
record UpdatePersonRequest(String lastName, String firstName, UUID functionId) {}
```

#### Security

- `SecurityFilterChain`: protect `/api/persons/**` with `hasRole("ADMIN")`.

#### Flyway Migration

- File: `V4__UC-04-person-management.sql`
- SQL header comment: `-- Use case: UC-04`
- Creates `person (id, last_name, first_name, email UNIQUE, function_id FK -> catalog_entry, enabled)`.

---

### 2. Frontend

#### Person Management Feature

Lazy-loaded at `/admin/persons` (ADMIN only via `adminGuard`).

##### Person List Page

- Table columns: `last name`, `first name`, `email`, `function`, `status`, `actions` (Edit, Disable).

##### Create/Edit Form

- Fields: `last name`, `first name`, `email` (readonly on edit), `function` (select, sourced from enabled Function catalog entries, always required).

#### Person Service

```typescript
interface PersonDto { id: string; lastName: string; firstName: string; email: string; functionLabel: string; enabled: boolean; }
interface CreatePersonDto { lastName: string; firstName: string; email: string; functionId: string; }
interface UpdatePersonDto { lastName: string; firstName: string; functionId: string; }
```

---

## Expected File Structure

```
backend/
├── src/main/java/.../
│   ├── entity/Person.java
│   ├── repository/PersonRepository.java
│   ├── dto/PersonDtos.java
│   ├── controller/PersonController.java
│   └── service/PersonService.java
└── src/main/resources/
    └── db/migration/V4__UC-04-person-management.sql

frontend/
└── src/app/features/persons/
    ├── person-list/person-list.component.ts
    └── person-form/person-form.component.ts
```

---

## Validation Checklist

- [ ] ADMIN can list, create, edit, and disable persons.
- [ ] Email uniqueness and format are validated on creation.
- [ ] Email cannot be changed after creation.
- [ ] Function selection is restricted to enabled Function catalog entries.
- [ ] Disabling a person sets `enabled=false` and does not delete the record.
- [ ] Disabling a person closes any active population membership with an end date equal to the disabling date (once UC-05 is in place).
- [ ] Flyway V4 runs cleanly on a database already containing V1/V2/V3.

# UC-05 - Population Management — Generation Prompt

## Context

This prompt is used to generate all the code and resources required to implement UC-05 (Population Management) in the ClearReq application. A population groups existing persons (UC-04) as members, each with a function (from the Function catalog, UC-03) and a membership period (start/end date). A person is never duplicated: multiple memberships (even within the same population) all reference the single `person` record.

### Stack

- **Backend**: Java, Spring Boot, Spring Security (session-based, BCrypt 12), Spring Data JPA, Flyway, PostgreSQL
- **Frontend**: Angular, Angular Material, standalone components, lazy-loaded feature modules
- **Architecture**: Monorepo — backend serves the built frontend as static assets on port 8090 (production)

### Key Constraints

- Never use deprecated or legacy APIs.
- Only ADMIN can manage populations and memberships.
- Population `name` is unique. Status is `ACTIVE` or `CLOSED`.
- A membership always references an existing, enabled `Person` and an existing, enabled `CatalogEntry` of type `FUNCTION`; function is always mandatory.
- No uniqueness constraint on `(population_id, person_id)`: a person may have several distinct membership periods in the same population over time.
- Disabling a person (UC-04) must automatically set `end_date = disabling date` on every membership of that person where `end_date` is null or in the future. This cross-use-case logic must be implemented in this use case's service layer (or a shared domain service invoked from `PersonService.disable(...)`).
- Adding a disabled person as a new member must be rejected.

---

## What to Generate

### 1. Backend

#### Entities

- `Population` entity: `id` (UUID), `name` (unique), `status` (enum: `ACTIVE`, `CLOSED`).
- `PopulationMember` entity: `id` (UUID), `population` (FK), `person` (FK), `function` (FK to `CatalogEntry`), `startDate`, `endDate` (nullable).

#### Repositories

- `PopulationRepository extends JpaRepository<Population, UUID>`, method `Optional<Population> findByName(String name)`.
- `PopulationMemberRepository extends JpaRepository<PopulationMember, UUID>`, methods `List<PopulationMember> findByPopulationId(UUID populationId)`, `List<PopulationMember> findByPersonIdAndEndDateIsNullOrEndDateGreaterThanEqual(UUID personId, LocalDate today)`.

#### Population API

Endpoints under `/api/populations` (ADMIN only):

- `GET /api/populations`: list populations with name, status, member count.
- `POST /api/populations`: create `{ name, status? }` (defaults to `ACTIVE`). Validate name uniqueness.
- `PUT /api/populations/{id}`: update `name` and/or `status`. Validate name uniqueness.
- `GET /api/populations/{id}/members`: list members of a population (person info, function, start/end date).
- `POST /api/populations/{id}/members`: add a member `{ personId, functionId, startDate, endDate? }`. Validate person is enabled, function is enabled, `endDate >= startDate` if provided.
- `PUT /api/populations/{id}/members/{memberId}`: update `functionId` and/or `endDate` of a specific membership.

#### Cross-use-case Cascade (Person Disable → Close Memberships)

- Implement a domain service (e.g. `PopulationMembershipClosureService`) with a method `closeActiveMemberships(UUID personId, LocalDate closingDate)` that sets `endDate = closingDate` on all active memberships of that person.
- Invoke this service from the person-disabling flow (UC-04's `PersonService.disable(...)`), so that disabling a person always closes active memberships as a single transactional operation.

#### DTOs

```java
// PopulationDtos.java
record PopulationResponse(UUID id, String name, String status, long memberCount) {}
record CreatePopulationRequest(String name, String status) {}
record UpdatePopulationRequest(String name, String status) {}
record PopulationMemberResponse(UUID id, UUID personId, String personFullName, String functionLabel, LocalDate startDate, LocalDate endDate) {}
record AddPopulationMemberRequest(UUID personId, UUID functionId, LocalDate startDate, LocalDate endDate) {}
record UpdatePopulationMemberRequest(UUID functionId, LocalDate endDate) {}
```

#### Security

- `SecurityFilterChain`: protect `/api/populations/**` with `hasRole("ADMIN")`.

#### Flyway Migration

- File: `V5__UC-05-population-management.sql`
- SQL header comment: `-- Use case: UC-05`
- Creates `population (id, name UNIQUE, status)`.
- Creates `population_member (id, population_id FK, person_id FK -> person, function_id FK -> catalog_entry, start_date, end_date NULL)`.

---

### 2. Frontend

#### Population Management Feature

Lazy-loaded at `/admin/populations` (ADMIN only via `adminGuard`).

##### Population List Page

- Table columns: `name`, `status`, `member count`, `actions` (Edit, View members).

##### Population Detail / Member List Page

- Displays population name/status and its members: person full name, function, start date, end date, actions (Edit membership).
- "Add member" action: select an enabled person, an enabled function, a start date, and an optional end date.

#### Population Service

```typescript
interface PopulationDto { id: string; name: string; status: 'ACTIVE' | 'CLOSED'; memberCount: number; }
interface PopulationMemberDto { id: string; personId: string; personFullName: string; functionLabel: string; startDate: string; endDate: string | null; }
interface AddPopulationMemberDto { personId: string; functionId: string; startDate: string; endDate?: string; }
interface UpdatePopulationMemberDto { functionId?: string; endDate?: string; }
```

---

## Expected File Structure

```
backend/
├── src/main/java/.../
│   ├── entity/Population.java
│   ├── entity/PopulationMember.java
│   ├── repository/PopulationRepository.java
│   ├── repository/PopulationMemberRepository.java
│   ├── dto/PopulationDtos.java
│   ├── controller/PopulationController.java
│   └── service/
│       ├── PopulationService.java
│       └── PopulationMembershipClosureService.java
└── src/main/resources/
    └── db/migration/V5__UC-05-population-management.sql

frontend/
└── src/app/features/populations/
    ├── population-list/population-list.component.ts
    └── population-detail/population-detail.component.ts
```

---

## Validation Checklist

- [ ] ADMIN can list, create, and edit populations (name, status).
- [ ] Population name uniqueness is enforced.
- [ ] ADMIN can add an existing, enabled person as a member with a mandatory function and a start date.
- [ ] A disabled person cannot be added as a new member.
- [ ] End date, if provided, cannot be earlier than the start date.
- [ ] The same person can have multiple, separate membership periods within the same population without any duplicate person record.
- [ ] Disabling a person (UC-04) automatically closes all their active memberships across all populations.
- [ ] Flyway V5 runs cleanly on a database already containing V1/V2/V3/V4.

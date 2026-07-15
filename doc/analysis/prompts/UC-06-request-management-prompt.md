# UC-06 - Request Management for a Population — Generation Prompt

## Context

This prompt is used to generate all the code and resources required to implement UC-06 (Request Management for a Population) in the ClearReq application.

Requests are created for members of a population and follow a common lifecycle with type-specific data.

Initial request types:

- `SCREENING_LIGHT`
- `CDN_ACCOUNT`
- `SECURITY_CLEARANCE`

The design must stay extensible for additional request types in later iterations.

### Stack

- **Backend**: Java, Spring Boot, Spring Security (session-based, BCrypt 12), Spring Data JPA, Flyway, PostgreSQL
- **Frontend**: Angular, Angular Material, standalone components, lazy-loaded feature modules
- **Architecture**: Monorepo — backend serves the built frontend as static assets on port 8090 (production)

### Key Constraints

- Never use deprecated or legacy APIs.
- Keep one Flyway SQL migration file for UC-06 only.
- A request target must be an enabled person who is an active member of the population at `requestDate`.
- Common workflow: `DRAFT` -> `SUBMITTED` -> `ACCEPTED`/`REFUSED` -> `CLOSED`.
- Request comments must be persisted as history.
- `SCREENING_LIGHT` and `SECURITY_CLEARANCE`:
  - POPULATION_MANAGER creates/edits in draft and submits.
  - SECURITY_OFFICER processes post-submit fields and decisions.
- `CDN_ACCOUNT`:
  - POPULATION_MANAGER manages the full lifecycle.
- For `SECURITY_CLEARANCE` only:
  - Periodic controls are tracked.
  - Next control due is auto-calculated by level and manually adjustable.
  - Review records are linked to a main security clearance request and do not invalidate it by default.

---

## What to Generate

### 1. Backend

#### Domain Model

Create entities (or equivalent aggregate model) for:

- `PopulationRequest`
  - Common fields: `id`, `population`, `person`, `type`, `status`, `requestDate`, `createdAt`, `updatedAt`
- `PopulationRequestComment`
  - `id`, `request`, `author`, `createdAt`, `content`
- `PopulationRequestScreening`
  - `request` (PK/FK), `returnDate`, `validityDate`, `result`, `resultComment`
- `PopulationRequestCdnDocument`
  - `id`, `request`, `documentCode` (`FORMULAIRE`, `PHOTO`), `status` (`TO_PROVIDE`, `RECEIVED`, `VALIDATED`)
- `PopulationRequestSecurityClearance`
  - `request` (PK/FK), `clearanceLevel`, `requestFormStatus` (`TO_PROVIDE`, `RECEIVED`, `VALIDATED`)
- `SecurityClearanceControl`
  - `id`, `securityClearanceRequest`, `controlDate`, `result`, `comment`, `nextDueDate`
- `SecurityClearanceReview`
  - `id`, `securityClearanceRequest`, review date fields, comment/trace fields

Use enums for request type, request status, screening result, checklist status, and clearance level.

#### Repositories

Create repositories for request aggregate and child entities with practical lookup methods:

- By population
- By person
- By status
- By type
- By security clearance request id

#### Services and Validation

Create service-layer logic for:

- Creating/editing/submitting requests by type
- Role/type/state transition checks
- Common and type-specific validation
- Comments append history
- Security clearance control scheduling and recording
- Security clearance review creation linked to main security clearance

Validation rules must include:

- Membership active at request date
- Date consistency (request/return/validity)
- Type-specific required fields
- Role-based post-submit restrictions
- Valid document-status transitions for `CDN_ACCOUNT` and `SECURITY_CLEARANCE`

#### API

Expose endpoints under `/api/populations/{populationId}/requests`.

Suggested endpoints:

- `GET /api/populations/{populationId}/requests`
- `POST /api/populations/{populationId}/requests`
- `GET /api/populations/{populationId}/requests/{requestId}`
- `PUT /api/populations/{populationId}/requests/{requestId}`
- `POST /api/populations/{populationId}/requests/{requestId}/submit`
- `POST /api/populations/{populationId}/requests/{requestId}/decision` (accept/refuse)
- `POST /api/populations/{populationId}/requests/{requestId}/close`
- `POST /api/populations/{populationId}/requests/{requestId}/comments`

Security-clearance-specific:

- `GET /api/populations/{populationId}/requests/{requestId}/controls`
- `POST /api/populations/{populationId}/requests/{requestId}/controls`
- `PUT /api/populations/{populationId}/requests/{requestId}/controls/{controlId}`
- `POST /api/populations/{populationId}/requests/{requestId}/reviews`
- `GET /api/populations/{populationId}/requests/{requestId}/reviews`

#### DTOs

Create dedicated DTOs for:

- Common request list/detail
- Type-specific creation/update payloads
- Decision/transition actions
- Comments
- Control/review payloads

#### Security

Update `SecurityFilterChain` and method-level checks to enforce:

- `SCREENING_LIGHT` and `SECURITY_CLEARANCE` processing actions for `SECURITY_OFFICER` (and ADMIN fallback)
- `CDN_ACCOUNT` lifecycle actions for `POPULATION_MANAGER` (and ADMIN fallback)
- Read access according to UC-06 visibility rules

#### Flyway Migration

- File: `V6__UC-06-request-management.sql`
- SQL header comment: `-- Use case: UC-06`
- Creates all tables required by UC-06.
- Adds required indexes and FK constraints.

---

### 2. Frontend

#### Feature Structure

Create a dedicated requests feature under populations, for example:

- list page by population
- create/edit form page
- detail page with lifecycle timeline/comments
- security clearance controls/reviews section

Integrate from population detail context.

#### Routing

Add routes such as:

- `/admin/populations/:populationId/requests`
- `/admin/populations/:populationId/requests/new`
- `/admin/populations/:populationId/requests/:requestId`
- `/admin/populations/:populationId/requests/:requestId/edit`

#### Service and Models

Create a request service and strongly typed interfaces for:

- Common request data
- Discriminated type payloads
- Comments
- Controls and reviews

#### Forms and UI Behavior

- Use reactive forms.
- Render type-specific sections conditionally.
- Enforce date and required-field validation.
- Implement checklist status updates for CDN.
- Implement status actions based on role/type/state.

#### Guards and Permissions

Implement role-aware UI guards and action-level UI checks:

- POPULATION_MANAGER draft/edit/submit for screening and security clearance
- SECURITY_OFFICER processing actions for screening and security clearance
- POPULATION_MANAGER full lifecycle for CDN
- ADMIN fallback where needed

---

## Expected File Structure

```
backend/
├── src/main/java/.../
│   ├── entity/PopulationRequest*.java
│   ├── repository/PopulationRequest*.java
│   ├── dto/RequestDtos.java
│   ├── controller/PopulationRequestController.java
│   └── service/
│       ├── PopulationRequestService.java
│       └── SecurityClearanceControlService.java
└── src/main/resources/
    └── db/migration/V6__UC-06-request-management.sql

frontend/
└── src/app/
    ├── core/services/request.service.ts
    └── features/populations/requests/
        ├── request-list/
        ├── request-form/
        ├── request-detail/
        ├── security-clearance-controls/
        └── security-clearance-reviews/
```

---

## Validation Checklist

- [ ] Requests can be created only for active population members at request date.
- [ ] Workflow transitions are enforced by role/type/state rules.
- [ ] Comments are persisted and visible in history.
- [ ] Screening result supports enum + free comment.
- [ ] CDN checklist supports per-document status (`TO_PROVIDE`, `RECEIVED`, `VALIDATED`).
- [ ] Security clearance `REQUEST_FORM` supports status (`TO_PROVIDE`, `RECEIVED`, `VALIDATED`).
- [ ] Security clearance periodic controls are auto-scheduled by level and manually adjustable.
- [ ] Security clearance reviews are linked to the main security clearance and do not invalidate it by default.
- [ ] API returns clear validation/authorization errors.
- [ ] Frontend forms and actions reflect role-based permissions.
- [ ] Flyway V6 runs cleanly on a database already containing V1..V5.

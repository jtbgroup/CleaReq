# UC-06 - Request Management for a Population

## Summary

Allows request management for a given population member. Each request has a common lifecycle and type-specific data.

Initial request types in scope:

- `SCREENING_LIGHT`
- `CDN_ACCOUNT`
- `SECURITY_CLEARANCE`

The model must remain extensible for future request types.

A request lifecycle is independent from the validity lifecycle of a security clearance. Closing a request does not automatically invalidate an existing security clearance.

## Actors

- POPULATION_MANAGER
- SECURITY_OFFICER
- ADMIN (supervision and fallback access)

## Preconditions

- The actor is authenticated.
- The target population exists.
- The target person exists, is enabled, and is an active member of the population at the request date.

## Common Request Data

- `requestDate`
- `populationId`
- `personId`
- `status`: `DRAFT`, `SUBMITTED`, `ACCEPTED`, `REFUSED`, `CLOSED`
- `comments` (history of request comments)

## Type-specific Data

### `SCREENING_LIGHT`

- `returnDate`
- `validityDate`
- `result`: enum + free comment

### `CDN_ACCOUNT`

- All `SCREENING_LIGHT` fields
- Document checklist with status per required document:
  - `FORMULAIRE`: `TO_PROVIDE`, `RECEIVED`, `VALIDATED`
  - `PHOTO`: `TO_PROVIDE`, `RECEIVED`, `VALIDATED`

### `SECURITY_CLEARANCE`

- All `SCREENING_LIGHT` fields
- `clearanceLevel`
- `REQUEST_FORM` status: `TO_PROVIDE`, `RECEIVED`, `VALIDATED`
- Periodic controls (see dedicated flow)
- Optional review records linked to the main security clearance request (see dedicated flow)

## Permission Rules by Type

### `SCREENING_LIGHT`

- POPULATION_MANAGER can create and edit while status is `DRAFT`.
- POPULATION_MANAGER can submit.
- SECURITY_OFFICER processes after submission and manages outcome fields.
- POPULATION_MANAGER can view status at any time.

### `CDN_ACCOUNT`

- POPULATION_MANAGER can manage the full lifecycle, including checklist updates and final closure.
- SECURITY_OFFICER read access is optional and not required for baseline flow.

### `SECURITY_CLEARANCE`

- POPULATION_MANAGER can create and edit while status is `DRAFT`.
- POPULATION_MANAGER can submit.
- SECURITY_OFFICER processes after submission, records outcome fields, and manages periodic controls.
- POPULATION_MANAGER can view status at any time.

## Main Flow — Create and Submit Request

1. The actor opens a population and chooses a member.
2. The actor selects a request type.
3. The system displays common fields and type-specific fields.
4. The actor fills required data.
5. The backend validates membership and field consistency.
6. The request is saved as `DRAFT`.
7. The actor submits the request.
8. The request moves to `SUBMITTED` and comment history is updated.

## Main Flow — Process Request (Security Workflow)

1. SECURITY_OFFICER opens a submitted `SCREENING_LIGHT` or `SECURITY_CLEARANCE` request.
2. SECURITY_OFFICER records processing data (`returnDate`, `validityDate`, `result`, comments, and type-specific fields).
3. SECURITY_OFFICER sets status to `ACCEPTED` or `REFUSED`.
4. Optionally, request is moved to `CLOSED` when administrative tracking is complete.

## Main Flow — Manage CDN Request (Population Manager Workflow)

1. POPULATION_MANAGER opens a `CDN_ACCOUNT` request.
2. POPULATION_MANAGER updates checklist items (`FORMULAIRE`, `PHOTO`) through `TO_PROVIDE` -> `RECEIVED` -> `VALIDATED`.
3. POPULATION_MANAGER sets final status (`ACCEPTED`/`REFUSED`) and closes request when done.

## Main Flow — Periodic Control for Security Clearance

1. After an accepted security clearance request, control schedule is initialized.
2. Next control due date is automatically calculated from level:
   - `CTS`: every 6 months
   - `S` or `TS`: every 12 months
3. SECURITY_OFFICER can manually adjust the next due date when needed.
4. Each control execution is recorded with date, result, comment, and next due date.

## Main Flow — Security Clearance Review Linked to Main Request

1. SECURITY_OFFICER (or authorized flow actor) creates a review entry linked to an accepted security clearance request when administrative context changes.
2. The review keeps the same person and the same clearance level as the main security clearance.
3. The system records review-specific dates and comments.
4. The main security clearance remains valid while the review is tracked.

## Alternative Flow — Invalid Membership Scope

1. The actor selects a person who is not an active member at `requestDate`.
2. The backend rejects the request.
3. The system displays a validation error.

## Alternative Flow — Invalid Dates

1. The actor submits inconsistent dates (for example `returnDate < requestDate` or invalid validity chronology).
2. The backend rejects the request.
3. The system displays field-level validation errors.

## Alternative Flow — Unauthorized Transition

1. An actor attempts a status transition not allowed by role/type/state.
2. The backend returns forbidden/validation error.
3. The UI keeps the request unchanged and shows an error message.

## Postconditions

- A request exists with auditable lifecycle and comments.
- Type-specific data is persisted according to request type.
- For security clearance requests, periodic controls and optional reviews are traceable and linked.
- Security clearance validity remains distinct from request closure.

## Data Model

- `population_request`: `id` (UUID), `population_id` (FK), `person_id` (FK), `type`, `status`, `request_date`, timestamps.
- `population_request_comment`: `id`, `request_id` (FK), `author`, `created_at`, `content`.
- `population_request_screening`: `request_id` (PK/FK), `return_date`, `validity_date`, `result`, `result_comment`.
- `population_request_cdn_document`: `id`, `request_id` (FK), `document_code` (`FORMULAIRE`, `PHOTO`), `status`.
- `population_request_security_clearance`: `request_id` (PK/FK), `clearance_level`, `request_form_status`.
- `security_clearance_control`: `id`, `security_clearance_request_id` (FK), `control_date`, `result`, `comment`, `next_due_date`.
- `security_clearance_review`: `id`, `security_clearance_request_id` (FK), review dates, comment, trace fields.

## Non-functional Requirements

- Authorization must be enforced server-side for each action (not only route-level UI guards).
- Type-specific validation must be centralized and testable.
- Request type design must allow adding future types with minimal impact.
- Date calculations for periodic controls must be deterministic and auditable.
- All status changes and controls/reviews must be traceable with actor and timestamp.

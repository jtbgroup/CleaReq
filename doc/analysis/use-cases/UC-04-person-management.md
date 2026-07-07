# UC-04 - Person Management

## Summary

Allows an ADMIN to manage the reference list of persons (people) that can later be assigned to populations (see UC-05). A person exists exactly once in the system, identified by their email address, regardless of how many populations they belong to over time. A person can be disabled (soft delete), which automatically ends their current membership in any population they belong to.

## Actors

- ADMIN

## Preconditions

- The ADMIN is authenticated.
- The Function catalog (UC-03) contains at least one enabled entry.

## Main Flow — Create Person

1. The ADMIN navigates to the Person Management area.
2. The system displays the list of existing persons (last name, first name, email, function, status).
3. The ADMIN clicks "Create person".
4. The ADMIN provides: `last name`, `first name`, `email`, `function` (selected from the enabled entries of the Function catalog).
5. The backend validates the input (email uniqueness, email format, function must reference an enabled catalog entry).
6. The backend stores the person with `enabled=true`.
7. The system confirms creation and updates the person list.

## Main Flow — Edit Person

1. The ADMIN selects a person and clicks "Edit".
2. The ADMIN updates allowed fields: `last name`, `first name`, `function`. The `email` is the person's unique identifier and is read-only after creation.
3. The backend validates the update.
4. The backend saves the changes.
5. The system confirms the update and refreshes the person list.

## Main Flow — Disable Person

1. The ADMIN selects a person and clicks "Disable".
2. The backend sets `enabled=false` (soft delete) on the person.
3. The backend automatically closes any active population membership for that person by setting the membership `end date` to the disabling date, for every population where the person is currently active (no end date, or an end date in the future).
4. The system confirms the person is disabled and reflects the closed membership(s) in any affected population view.

## Alternative Flow — Email Already Exists

1. The ADMIN tries to create a person with an email that already exists.
2. The backend rejects the request with a validation error.
3. The system displays a message: *"A person with this email already exists"*.

## Alternative Flow — Invalid Input

1. The ADMIN submits invalid or incomplete data (blank required fields, invalid email format, disabled or unknown function).
2. The backend rejects the request with validation errors.
3. The system displays appropriate field-level error messages.

## Postconditions

- **Create person**: The person exists with `enabled=true` and a valid function reference.
- **Edit person**: The person's non-identifying fields are updated.
- **Disable person**: The person is marked as disabled; any active population membership is automatically closed with an end date.

## Data Model

- `person`: `id` (UUID), `last_name`, `first_name`, `email` (unique), `function_id` (FK to `catalog_entry`, restricted to catalog type `FUNCTION`), `enabled` (boolean).
- The person is a single, reusable record independent of population membership (see UC-05 for the membership/relation model).

## Non-functional Requirements

- Only ADMIN can manage persons (temporary restriction — see `doc/roles.md` for future evolution).
- Email is the uniqueness key for a person, for the current scope.
- Disabling a person must never delete historical data; it is a soft delete and must cascade as an automatic closure (end date) of active population memberships, never a deletion of the membership record itself.
- The function assigned to a person must always reference an existing (possibly disabled, for already-assigned persons) entry of the Function catalog; new assignments must reference an enabled entry only.

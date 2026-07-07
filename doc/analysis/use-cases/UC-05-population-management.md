# UC-05 - Population Management

## Summary

Allows an ADMIN to define and manage populations within a department. A population has a name, a status (`ACTIVE` or `CLOSED`), and a list of members. Each membership links an existing person (see UC-04) to the population, together with the function held during that membership and a start/end date. A person is never duplicated: the same person (identified by email) can belong to one or more populations, and can even have several distinct membership periods within the same population, without ever creating a second person record.

This use case is a foundation for a future capability (not part of this scope) to create and track requests for the persons of a population.

## Actors

- ADMIN

## Preconditions

- The ADMIN is authenticated.
- At least one enabled person exists (UC-04) to be added as a member.

## Main Flow — Create Population

1. The ADMIN navigates to the Population Management area.
2. The system displays the list of existing populations (name, status, member count).
3. The ADMIN clicks "Create population".
4. The ADMIN provides: `name` and `status` (defaults to `ACTIVE`).
5. The backend validates the input (name uniqueness).
6. The backend stores the population.
7. The system confirms creation and updates the population list.

## Main Flow — Edit Population

1. The ADMIN selects a population and clicks "Edit".
2. The ADMIN updates `name` and/or `status` (`ACTIVE` / `CLOSED`).
3. The backend validates and saves the changes.
4. The system confirms the update.

## Main Flow — Add Member to Population

1. The ADMIN opens a population and clicks "Add member".
2. The ADMIN selects an existing, enabled person, a `function` (from the enabled entries of the Function catalog, always required), and a membership `start date` (optional `end date`).
3. The backend validates the input (person must be enabled, function must be enabled, start date required, end date — if provided — must not be before the start date).
4. The backend stores the membership, linking the population and the person, without duplicating the person record.
5. The system confirms and refreshes the member list of the population.

## Main Flow — Edit / End Membership

1. The ADMIN selects a member entry within a population.
2. The ADMIN updates the `function` and/or the `end date` of that specific membership period.
3. The backend validates and saves the change.
4. The system confirms and refreshes the member list.

## Alternative Flow — Duplicate Population Name

1. The ADMIN tries to create or rename a population to a name that already exists.
2. The backend rejects the request with a validation error.
3. The system displays a message: *"A population with this name already exists"*.

## Alternative Flow — Add Disabled Person

1. The ADMIN attempts to add a disabled person as a member.
2. The backend rejects the request.
3. The system displays a message: *"This person is disabled and cannot be added to a population"*.

## Alternative Flow — Person Disabled While Active in a Population

1. A person who is an active member of one or more populations is disabled via UC-04.
2. As described in UC-04, every active membership of that person is automatically closed with an end date equal to the disabling date.
3. The population's member list reflects the closed membership without any manual action from the ADMIN.

## Alternative Flow — Invalid Membership Dates

1. The ADMIN submits a membership with an end date earlier than the start date.
2. The backend rejects the request with a validation error.
3. The system displays a field-level error message.

## Postconditions

- **Create/Edit population**: The population exists with its name and status.
- **Add member**: A membership record links the population, the person, the function, and the period, without duplicating the person.
- **Edit/End membership**: The membership period and/or function is updated.
- **Person disabled (cross-UC effect)**: Any active membership of that person, in any population, is automatically closed.

## Data Model

- `population`: `id` (UUID), `name` (unique), `status` (`ACTIVE` / `CLOSED`).
- `population_member`: `id` (UUID), `population_id` (FK), `person_id` (FK to `person`), `function_id` (FK to `catalog_entry`, type `FUNCTION`), `start_date`, `end_date` (nullable). No uniqueness constraint on `(population_id, person_id)` alone, since a person may have several distinct membership periods in the same population over time.

## Non-functional Requirements

- Only ADMIN can manage populations and memberships (temporary restriction — see `doc/roles.md` for future evolution).
- A person must never be duplicated to represent multiple memberships or multiple populations; all memberships reference the single `person` record.
- The function on a membership is always mandatory.
- This use case does not cover request creation/tracking for population members; that is out of scope and reserved for a future use case.

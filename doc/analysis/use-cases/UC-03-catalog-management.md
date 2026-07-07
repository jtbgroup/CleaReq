# UC-03 - Catalog Management

## Summary

Allows an ADMIN to manage generic catalogs used across the application. A catalog is a named, typed list of reusable reference entries (e.g. the "Function" catalog). The mechanism is generic so that new catalog types can be introduced in the future without requiring a new database migration or a new set of screens/endpoints — only a new catalog type needs to be registered.

The first concrete catalog delivered with this use case is the **Function catalog**, used later by UC-04 (Person Management) to qualify a person's function.

## Actors

- ADMIN

## Preconditions

- The ADMIN is authenticated.

## Main Flow — Manage Catalog Types

1. The ADMIN navigates to the Catalog Management area.
2. The system displays the list of available catalog types (e.g. `FUNCTION`).
3. The ADMIN selects a catalog type to manage its entries.

## Main Flow — Manage Catalog Entries

1. The system displays the list of entries for the selected catalog type (label, status).
2. The ADMIN can create a new entry by providing a label (unique within the catalog type).
3. The ADMIN can edit the label of an existing entry.
4. The ADMIN can disable (soft delete) an entry so it can no longer be assigned to new records, while remaining visible on records that already reference it.
5. The ADMIN can re-enable a previously disabled entry.

## Alternative Flow — Duplicate Entry Label

1. The ADMIN tries to create or rename an entry to a label that already exists within the same catalog type.
2. The backend rejects the request with a validation error.
3. The system displays a message: *"This entry already exists in the catalog"*.

## Alternative Flow — Disable Entry In Use

1. The ADMIN disables a catalog entry that is currently referenced by existing records (e.g. a Function assigned to a Person).
2. The entry is disabled (soft delete) but is not removed; existing references remain valid and continue to display the entry's label.
3. The entry no longer appears as a selectable option for new assignments.

## Postconditions

- **Create/Edit entry**: The catalog entry is persisted and immediately available (if enabled) for selection in other parts of the application.
- **Disable entry**: The entry is marked as disabled; existing references are preserved; the entry is excluded from selection lists for new assignments.

## Data Model

Catalogs are modeled generically:

- `catalog_type`: registry of catalog types (e.g. `FUNCTION`). Adding a new catalog type is a data operation (insert a row), not a schema change.
- `catalog_entry`: entries belonging to a `catalog_type`, with a `label` and an `enabled` flag (soft delete). Uniqueness of `label` is enforced per `catalog_type`.

This generic structure allows future catalogs (e.g. other reference lists needed by later use cases) to be added without a new Flyway migration — only a new `catalog_type` row and, if needed, minor UI configuration.

## Non-functional Requirements

- Only ADMIN can manage catalog types and catalog entries.
- Disabling an entry must never delete historical data that references it (soft delete only).
- The mechanism must be generic enough that adding a new catalog type does not require a new database migration.

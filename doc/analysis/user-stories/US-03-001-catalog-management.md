# US-006 - Catalog Management (Admin)

## User Story

As an ADMIN,
I want to manage generic catalogs (starting with the Function catalog),
So that I can maintain reusable reference lists without needing a new database migration each time a new catalog is required.

## Related Use Case

[UC-03 - Catalog Management](../use-cases/UC-03-catalog-management.md)

## Acceptance Criteria

- Given I am logged in as an ADMIN
  - When I navigate to the Catalog Management page
  - Then I see the available catalog types (e.g. Function)

- Given I select a catalog type
  - When I view its entries
  - Then I see each entry's label and status (enabled/disabled)

- Given I am managing a catalog
  - When I create a new entry with a label that does not yet exist in that catalog
  - Then the entry is added and immediately selectable elsewhere in the application

- Given I am managing a catalog
  - When I create or rename an entry to a label that already exists in that catalog
  - Then the form is invalid and an appropriate error message is displayed

- Given an entry is referenced by existing records (e.g. a Function assigned to a Person)
  - When I disable that entry
  - Then it is soft-deleted: existing references keep displaying it, but it no longer appears as selectable for new assignments

- Given an entry is disabled
  - When I re-enable it
  - Then it becomes selectable again for new assignments

## Notes

- The catalog mechanism is generic: adding a new catalog type must not require a new Flyway migration.
- Only ADMIN can access catalog management.

# US-009 - Population Management (Admin)

## User Story

As an ADMIN,
I want to create and edit populations with a name and a status,
So that I can organize department members into trackable groups.

## Related Use Case

[UC-05 - Population Management](../use-cases/UC-05-population-management.md)

## Acceptance Criteria

- Given I am logged in as an ADMIN
  - When I navigate to the Population Management page
  - Then I see a list of populations with name, status, and member count

- Given I am on the Population Management page
  - When I create a new population with a unique name
  - Then the population is created with status ACTIVE by default

- Given I am on the Population Management page
  - When I try to create or rename a population to a name that already exists
  - Then the form is invalid and an appropriate error message is displayed

- Given I am on the Population Management page
  - When I edit a population's name or status (ACTIVE / CLOSED)
  - Then the changes are persisted and reflected in the list

## Notes

- Population name must be unique.
- Status is limited to ACTIVE and CLOSED for the current scope.

# US-007 - Person Management (Admin)

## User Story

As an ADMIN,
I want to create, edit and disable persons with their function,
So that I can maintain a single, reusable reference list of persons to be assigned to populations.

## Related Use Case

[UC-04 - Person Management](../use-cases/UC-04-person-management.md)

## Acceptance Criteria

- Given I am logged in as an ADMIN
  - When I navigate to the Person Management page
  - Then I see a list of persons with last name, first name, email, function, and status

- Given I am on the Person Management page
  - When I create a new person with a unique email, last name, first name, and an enabled function
  - Then the person is added to the list with status enabled

- Given I am on the Person Management page
  - When I try to create a person with an email that already exists
  - Then the form is invalid and an appropriate error message is displayed

- Given I am on the Person Management page
  - When I edit a person's last name, first name, or function
  - Then the changes are persisted and reflected in the list; the email remains unchanged

- Given I am on the Person Management page
  - When I try to select a disabled function for a person
  - Then the disabled function does not appear as a selectable option

## Notes

- Email is the person's unique identifier and cannot be changed after creation, for the current scope.
- Function is always mandatory and must be an enabled entry of the Function catalog.

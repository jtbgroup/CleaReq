# US-010 - Manage Population Membership (Admin)

## User Story

As an ADMIN,
I want to add existing persons to a population with a function and a membership period,
So that I can track who belongs to a population, in which function, and for how long, without duplicating person records.

## Related Use Case

[UC-05 - Population Management](../use-cases/UC-05-population-management.md)

## Acceptance Criteria

- Given I am viewing a population
  - When I add an existing, enabled person as a member with a function and a start date
  - Then the membership is created and the member appears in the population's member list

- Given I am adding a member
  - When I do not select a function
  - Then the form is invalid and submission is blocked, since function is always mandatory

- Given I am adding a member
  - When I provide an end date earlier than the start date
  - Then the form is invalid and an appropriate error message is displayed

- Given a person is disabled
  - When I try to add that person as a new member
  - Then the action is rejected with an appropriate error message

- Given a person already has a past (closed) membership in a population
  - When I add that same person again to the same population with a new start date
  - Then a new, separate membership period is created for that person in that population, without creating a duplicate person record

- Given I am viewing a member of a population
  - When I edit the function or set/change the end date of that specific membership
  - Then the change is persisted and reflected in the member list

## Notes

- A person can belong to several populations simultaneously, and can have several distinct membership periods within the same population, all referencing the single person record.
- Function is required on every membership.

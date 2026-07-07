# US-008 - Disabling a Person Closes Active Population Memberships

## User Story

As an ADMIN,
I want a disabled person's active population memberships to be automatically closed,
So that population data always reflects who is actually a current, active member.

## Related Use Case

[UC-04 - Person Management](../use-cases/UC-04-person-management.md)
[UC-05 - Population Management](../use-cases/UC-05-population-management.md)

## Acceptance Criteria

- Given a person is an active member of one or more populations (no end date, or a future end date)
  - When I disable that person
  - Then the person's status becomes disabled
  - And every active membership of that person is automatically closed with an end date equal to the disabling date

- Given a person has no active membership in any population
  - When I disable that person
  - Then only the person's status is changed; no membership is affected

- Given a person is disabled
  - When an ADMIN tries to add that person as a new member of a population
  - Then the action is rejected with an appropriate error message

## Notes

- This is a cross-cutting rule between UC-04 (Person Management) and UC-05 (Population Management); it must be implemented as part of the person-disabling operation, not as a manual step performed by the ADMIN in each population.
- Already-closed memberships (with a past end date) are left untouched.

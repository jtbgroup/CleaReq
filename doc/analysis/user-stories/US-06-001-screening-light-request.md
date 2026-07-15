# US-06-001 - Create and Submit Screening Light Request

## User Story

As a POPULATION_MANAGER,
I want to create and submit a screening light request for an active population member,
So that SECURITY_OFFICER can process and decide it.

## Related Use Case

[UC-06 - Request Management for a Population](../use-cases/UC-06-request-management.md)

## Acceptance Criteria

- Given I am a POPULATION_MANAGER on a population member context
  - When I create a `SCREENING_LIGHT` request in `DRAFT`
  - Then I can save common data and screening fields

- Given the request is `DRAFT`
  - When I edit it
  - Then I can update all editable draft fields

- Given the request is complete
  - When I submit it
  - Then status becomes `SUBMITTED`
  - And comment history records the submission context

- Given the person is not an active member at request date
  - When I try to save/submit
  - Then the backend rejects the action with a validation error

## Notes

- Required screening fields include `requestDate`, `returnDate`, `validityDate`, and `result`.
- `result` uses an enum plus optional free comment.

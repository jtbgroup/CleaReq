# US-06-006 - Create and Submit Security Clearance Request

## User Story

As a POPULATION_MANAGER,
I want to create and submit a security clearance request for an active population member,
So that SECURITY_OFFICER can process it with the required supporting data.

## Related Use Case

[UC-06 - Request Management for a Population](../use-cases/UC-06-request-management.md)

## Acceptance Criteria

- Given I am a POPULATION_MANAGER on a population member context
  - When I create a `SECURITY_CLEARANCE` request in `DRAFT`
  - Then I can save common request data, `clearanceLevel`, and `REQUEST_FORM` status

- Given the request is `DRAFT`
  - When I edit it
  - Then I can update all draft fields allowed for POPULATION_MANAGER

- Given the request is complete enough for submission
  - When I submit it
  - Then status becomes `SUBMITTED`
  - And comment history records the submission context

- Given the target person is not an active member at request date
  - When I try to save or submit
  - Then the backend rejects the action with a validation error

## Notes

- `REQUEST_FORM` is tracked with status `TO_PROVIDE`, `RECEIVED`, or `VALIDATED`.
- Post-submit security processing fields remain reserved for SECURITY_OFFICER.

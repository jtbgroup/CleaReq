# US-06-003 - Process Security Clearance Request

## User Story

As a SECURITY_OFFICER,
I want to process submitted security clearance requests,
So that I can decide acceptance/refusal and record traceable outcome data.

## Related Use Case

[UC-06 - Request Management for a Population](../use-cases/UC-06-request-management.md)

## Acceptance Criteria

- Given a POPULATION_MANAGER submitted a `SECURITY_CLEARANCE` request
  - When I open it as SECURITY_OFFICER
  - Then I can fill processing fields including dates, result, comments, and security-clearance-specific fields

- Given processing is complete
  - When I decide acceptance or refusal
  - Then status becomes `ACCEPTED` or `REFUSED`

- Given I finalize administrative tracking
  - When I close the request
  - Then status becomes `CLOSED`
  - And closure does not automatically invalidate an active security clearance

- Given a POPULATION_MANAGER tries to process post-submit security fields
  - When they save
  - Then the backend rejects the action as unauthorized

## Notes

- `clearanceLevel` is mandatory for security clearance requests.
- `REQUEST_FORM` must be tracked with status `TO_PROVIDE`, `RECEIVED`, or `VALIDATED`.
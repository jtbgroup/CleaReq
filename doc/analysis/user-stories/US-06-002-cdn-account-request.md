# US-06-002 - Manage CDN Account Request with Checklist

## User Story

As a POPULATION_MANAGER,
I want to manage a CDN account request and its document checklist,
So that I can complete the full request lifecycle without additional role handoff.

## Related Use Case

[UC-06 - Request Management for a Population](../use-cases/UC-06-request-management.md)

## Acceptance Criteria

- Given I create a `CDN_ACCOUNT` request
  - When I save it
  - Then it stores common request data and screening-like fields

- Given a CDN request exists
  - When I update checklist items for `FORMULAIRE` and `PHOTO`
  - Then each document status can move through `TO_PROVIDE`, `RECEIVED`, `VALIDATED`

- Given I complete processing
  - When I set outcome and close the request
  - Then final status and checklist are persisted

- Given an invalid checklist transition is attempted
  - When I save
  - Then the backend rejects with a validation error

## Notes

- In baseline UC-06, POPULATION_MANAGER owns the full `CDN_ACCOUNT` lifecycle.

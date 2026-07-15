# US-06-005 - Register Security Clearance Review Linked to Main Request

## User Story

As a SECURITY_OFFICER,
I want to register a review linked to an existing security clearance request,
So that administrative changes can be tracked without invalidating the main security clearance.

## Related Use Case

[UC-06 - Request Management for a Population](../use-cases/UC-06-request-management.md)

## Acceptance Criteria

- Given an accepted security clearance request exists
  - When I create a review entry
  - Then the review is linked to the original security clearance request

- Given a review is created
  - When I inspect inherited data
  - Then person and clearance level are identical to the main security clearance

- Given review processing progresses
  - When I save dates and comments
  - Then review timeline is persisted independently

- Given a review exists
  - When I check main security clearance validity
  - Then the main security clearance remains valid unless explicitly changed by dedicated decision logic

## Notes

- Review is modeled as a dedicated sub-object, not as a generic detached request.
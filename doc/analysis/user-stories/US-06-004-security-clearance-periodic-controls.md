# US-06-004 - Track Periodic Controls for Security Clearance

## User Story

As a SECURITY_OFFICER,
I want periodic controls to be scheduled and tracked for accepted security clearances,
So that validity monitoring remains auditable over time.

## Related Use Case

[UC-06 - Request Management for a Population](../use-cases/UC-06-request-management.md)

## Acceptance Criteria

- Given a security clearance request is accepted
  - When schedule is initialized
  - Then next control due date is auto-calculated from level (`CTS` = 6 months, `S/TS` = 12 months)

- Given a scheduled control exists
  - When I record a control execution
  - Then date, result, comment, and next due date are stored

- Given a justified exception exists
  - When I adjust next due date manually
  - Then the override is saved and traceable

- Given a control event is recorded
  - When request history is viewed
  - Then control records are visible and linked to the security clearance request

## Notes

- Automatic planning and manual adjustment must coexist in the same flow.
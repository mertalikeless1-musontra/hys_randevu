Feature: List Available Doctors
  Goal: Patients should see only doctors who are free at the requested time.

  Scenario: Filtering Busy Doctors
    Given a doctor named "Dr. House" exists
    And a doctor named "Dr. Wilson" exists
    And "Dr. House" has an appointment on "2025-11-22 14:00"
    When I request available doctors for "2025-11-22 14:00"
    Then the response should contain "Dr. Wilson"
    And the response should NOT contain "Dr. House"
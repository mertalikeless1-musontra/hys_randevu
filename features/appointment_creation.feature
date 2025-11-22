# features/appointment_creation.feature
Feature: Patient Appointment Creation
  Goal: Patients should be able to book appointments without conflicts.

  Scenario: Conflicting Appointment Error
    Given a doctor named "Dr. Ali" exists
    And the doctor has an appointment on "2025-12-25 14:00"
    When patient "Ahmet" tries to book an appointment for "2025-12-25 14:00" with Dr. Ali
    Then the system should return status code "422"
    And the error message should contain "Doctor is not available at this time"
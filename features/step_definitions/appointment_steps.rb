# features/step_definitions/appointment_steps.rb

# --- ORTAK ADIMLAR ---
Given("a doctor named {string} exists") do |doctor_name|
  doctor = Doctor.find_or_create_by!(name: doctor_name) do |d|
    d.specialty = "General"
  end
  @doctor_id = doctor.id
end

# --- RANDEVU SENARYOSU ADIMLARI ---

And("the doctor has an appointment on {string}") do |date_string|
  Appointment.create!(
    doctor_id: @doctor_id,
    patient_id: 999,
    scheduled_at: DateTime.parse(date_string),
    status: 'confirmed'
  )
end

When("patient {string} tries to book an appointment for {string} with Dr. Ali") do |patient_name, date_string|
  # ÇÖZÜM 1: Veriyi manuel JSON yapıyoruz
  payload = {
    appointment: {
      doctor_id: @doctor_id,
      patient_id: 2,
      scheduled_at: date_string
    }
  }.to_json

  # ÇÖZÜM 2: Header'ı manuel ekliyoruz
  headers = { 'CONTENT_TYPE' => 'application/json' }

  # Rack::Test standardında istek
  post '/api/v1/appointments', payload, headers
end

Then("the system should return status code {string}") do |status_code|
  # ÇÖZÜM 3: 'response' yerine 'last_response' kullanıyoruz (daha güvenli)
  expect(last_response.status).to eq(status_code.to_i)
end

And("the error message should contain {string}") do |error_message|
  json_response = JSON.parse(last_response.body)
  errors = json_response['errors']
  
  if errors.is_a?(Array)
    expect(errors).to include(error_message)
  else
    expect(errors.to_s).to include(error_message)
  end
end
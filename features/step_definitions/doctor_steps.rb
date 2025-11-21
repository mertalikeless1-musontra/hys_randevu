# features/step_definitions/doctor_steps.rb

# --- DOKTOR MÜSAİTLİK SENARYOSU ADIMLARI ---

Given("{string} has an appointment on {string}") do |doctor_name, date_string|
  doctor = Doctor.find_by!(name: doctor_name)
  Appointment.create!(
    doctor: doctor,
    patient_id: 999, 
    scheduled_at: DateTime.parse(date_string),
    status: 'confirmed'
  )
end

When("I request available doctors for {string}") do |date_string|
  # GET isteği
  get '/api/v1/doctors/available', { date: date_string }
end

Then("the response should contain {string}") do |doctor_name|
  # ÇÖZÜM: 'response' nil gelebilir, 'last_response' kullanıyoruz
  json_response = JSON.parse(last_response.body)
  
  doctor_names = json_response.map { |d| d['name'] }
  expect(doctor_names).to include(doctor_name)
end

Then("the response should NOT contain {string}") do |doctor_name|
  json_response = JSON.parse(last_response.body)
  
  doctor_names = json_response.map { |d| d['name'] }
  expect(doctor_names).not_to include(doctor_name)
end
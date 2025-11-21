# Clear existing data
Appointment.destroy_all
Doctor.destroy_all

# Create Doctors
d1 = Doctor.create!(name: "Dr. House", specialty: "Diagnostic")
d2 = Doctor.create!(name: "Dr. Wilson", specialty: "Oncology")

# Create Appointment for d1
time = DateTime.now.beginning_of_hour + 1.day
Appointment.create!(doctor: d1, scheduled_at: time)

# Check availability
available_doctors = Doctor.available_at(time)

puts "Total Doctors: #{Doctor.count}"
puts "Available Doctors at #{time}: #{available_doctors.map(&:name).join(', ')}"

if available_doctors.include?(d2) && !available_doctors.include?(d1)
  puts "SUCCESS: Logic is correct."
else
  puts "FAILURE: Logic is incorrect."
end

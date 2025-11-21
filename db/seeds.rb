# db/seeds.rb

puts "Veritabanı temizleniyor..."
Appointment.delete_all
Doctor.delete_all

puts "Yeni doktorlar ekleniyor..."
specialties = ["Dahiliye", "Nöroloji", "Kardiyoloji", "Ortopedi", "Pediatri"]

# Testlerin tükenmemesi için 10 tane doktor oluşturuyoruz
10.times do |i|
  Doctor.create!(
    name: "Dr. Uzman #{i+1}",
    specialty: specialties.sample
  )
end

puts "Tamamlandı! #{Doctor.count} adet doktor oluşturuldu."
class Doctor < ApplicationRecord
  has_many :appointments

  # Verilen saatte randevusu olan doktorları kesin olarak eler
  scope :available_at, ->(time) {
    # O saatteki randevuları bul
    busy_doctor_ids = Appointment.where(scheduled_at: time).select(:doctor_id)
    
    # Eğer meşgul doktor varsa listeden çıkar
    where.not(id: busy_doctor_ids)
  }
end
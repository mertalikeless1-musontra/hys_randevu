class Appointment < ApplicationRecord
  belongs_to :doctor, optional: true
  belongs_to :patient, optional: true

  validate :doctor_must_be_available

  def doctor_must_be_available
    return unless doctor_id && scheduled_at

    # ÇAKIŞMA MANTIĞI (Range Check):
    # Randevular 30 dk sürdüğü için, yeni randevunun saati
    # mevcut randevuların +/- 29 dakika yakınına denk gelmemeli.
    
    conflict = Appointment.where(doctor_id: doctor_id)
                          .where(scheduled_at: (scheduled_at - 29.minutes)..(scheduled_at + 29.minutes))
                          .where.not(id: id) # Kendini hariç tut
                          .exists?

    if conflict
      errors.add(:base, "Doctor is not available")
    end
  end
end

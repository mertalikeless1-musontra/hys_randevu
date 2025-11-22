import React, { useState } from 'react';

// --- AppointmentApp Bileşeni ---
const AppointmentApp = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = "http://localhost:3000/api/v1";

  const fetchDoctors = async () => {
    if (!selectedDate) {
      setMessage({ text: 'Lütfen önce bir tarih seçin.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });
    setDoctors([]);

    try {
      const response = await fetch(`${API_URL}/doctors/available?date=${selectedDate}`);
      if (!response.ok) throw new Error('Sunucudan veri alınamadı (Rails çalışıyor mu?)');
      const data = await response.json();
      setDoctors(data);

      if (data.length === 0) {
        setMessage({ text: 'Bu saatte müsait doktor bulunamadı.', type: 'error' });
      }
    } catch (error) {
      console.error("Fetch Hatası:", error);
      setMessage({ text: error.message || 'Bir hata oluştu.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const bookAppointment = async () => {
    if (!selectedDoctor) {
      setMessage({ text: 'Lütfen bir doktor seçin.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    const payload = {
      appointment: {
        doctor_id: selectedDoctor,
        patient_id: 1,
        scheduled_at: selectedDate
      }
    };

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 201) {
        setMessage({ text: `Randevunuz başarıyla oluşturuldu! (ID: ${data.id})`, type: 'success' });
        setDoctors([]);
        setSelectedDoctor('');
      } else {
        let errorMsg = 'Bir hata oluştu.';
        if (data.errors) {
          errorMsg = Array.isArray(data.errors) ? data.errors.join(', ') : JSON.stringify(data.errors);
        }
        setMessage({ text: `Hata: ${errorMsg}`, type: 'error' });
      }
    } catch (error) {
      console.error("Post Hatası:", error);
      setMessage({ text: 'Sunucu hatası (Rails konsolunu kontrol edin).', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="appointment-app">
      <h2 className="title">🏥 HYS Randevu Paneli</h2>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-group">
        <label>Randevu Tarihi ve Saati:</label>
        <input
          type="datetime-local"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <button onClick={fetchDoctors} disabled={loading}>
        {loading ? 'Yükleniyor...' : 'Doktor Ara'}
      </button>

      {doctors.length > 0 && (
        <div className="form-group">
          <label>Müsait Doktorlar:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
          >
            <option value="">Doktor Seçiniz...</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>

          <button
            onClick={bookAppointment}
            disabled={loading || !selectedDoctor}
          >
            {loading ? 'İşleniyor...' : 'Randevuyu Onayla'}
          </button>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <AppointmentApp />
    </div>
  );
}

export default App;

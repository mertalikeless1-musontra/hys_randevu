import React, { useState } from 'react';

// --- AppointmentApp Bileşeni (Tüm Mantık Burada) ---
const AppointmentApp = () => {
  // State Tanımları
  const [selectedDate, setSelectedDate] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success' | 'error'

  // API Base URL (Rails Sunucusu - Port 3000)
  const API_URL = "http://localhost:3000/api/v1";

  // 1. Müsait Doktorları Getir (GET /doctors/available)
  const fetchDoctors = async () => {
    if (!selectedDate) {
      setMessage({ text: 'Lütfen önce bir tarih seçin.', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' }); // Mesajı temizle
    setDoctors([]); // Listeyi temizle

    try {
      const response = await fetch(`${API_URL}/doctors/available?date=${selectedDate}`);
      
      if (!response.ok) {
        throw new Error('Sunucudan veri alınamadı (Rails çalışıyor mu?)');
      }
      
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

  // 2. Randevu Al (POST /appointments)
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
        patient_id: 1, // Simüle edilmiş hasta ID
        scheduled_at: selectedDate
      }
    };

    try {
      const response = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.status === 201) {
        // Başarılı: 201 Created
        setMessage({ text: `Randevunuz başarıyla oluşturuldu! (ID: ${data.id})`, type: 'success' });
        // Başarılı işlem sonrası formu temizle
        setDoctors([]);
        setSelectedDoctor('');
      } else {
        // Hata: 422 Unprocessable Entity (Validasyon Hatası) veya diğerleri
        let errorMsg = 'Bir hata oluştu.';
        if (data.errors) {
            // Rails errors bazen array, bazen object dönebilir, ikisini de yönetelim
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
    <div className="p-6 max-w-lg mx-auto font-sans bg-white shadow-lg rounded-lg mt-10 border border-gray-200">
      <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">🏥 HYS Randevu Paneli</h2>

      {/* Mesaj Kutusu (Hata veya Başarı) */}
      {message.text && (
        <div className={`p-3 mb-4 rounded text-sm font-semibold ${
            message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tarih Seçimi Alanı */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Randevu Tarihi ve Saati:</label>
        <input
          type="datetime-local"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Doktorları Bul Butonu */}
      <button 
        onClick={fetchDoctors} 
        disabled={loading}
        className={`w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'
        }`}
      >
        {loading ? 'Yükleniyor...' : 'Doktor Ara'}
      </button>

      <hr className="my-6 border-gray-300" />

      {/* Doktor Listesi ve Randevu Onay Kısmı */}
      {doctors.length > 0 && (
        <div className="mb-4 animate-fade-in">
          <label className="block text-gray-700 text-sm font-bold mb-2">Müsait Doktorlar:</label>
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Doktor Seçiniz...</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name} - {doc.specialty}
              </option>
            ))}
          </select>
          
          {/* Randevu Al Butonu */}
          <button 
            onClick={bookAppointment}
            disabled={loading || !selectedDoctor}
            className={`w-full mt-4 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
                loading || !selectedDoctor ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-700 text-white'
            }`}
          >
            {loading ? 'İşleniyor...' : 'Randevuyu Onayla'}
          </button>
        </div>
      )}
    </div>
  );
};

// --- Ana App Bileşeni ---
function App() {
    return (
        <div className="App bg-gray-100 min-h-screen py-10">
            <AppointmentApp />
        </div>
    )
}

export default App
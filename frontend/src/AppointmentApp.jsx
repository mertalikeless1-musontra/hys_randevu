import React, { useState } from 'react';

const AppointmentApp = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [formData, setFormData] = useState({
        doctor_id: '',
        patient_id: 1, // Hardcoded for now as per requirements
        scheduled_at: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setFormData({ ...formData, scheduled_at: e.target.value });
        setDoctors([]); // Clear doctors when date changes
    };

    const fetchDoctors = async () => {
        if (!selectedDate) {
            alert('Please select a date first.');
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch(`http://localhost:3000/api/v1/doctors/available?date=${selectedDate}`);
            if (!response.ok) {
                throw new Error('Failed to fetch doctors');
            }
            const data = await response.json();
            setDoctors(data);
            if (data.length === 0) {
                setMessage({ type: 'info', text: 'No doctors available for this date.' });
            }
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setMessage({ type: 'error', text: 'Error fetching doctors. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleDoctorSelect = (e) => {
        setFormData({ ...formData, doctor_id: e.target.value });
    };

    const bookAppointment = async () => {
        if (!formData.doctor_id || !formData.scheduled_at) {
            alert('Please select a doctor and date.');
            return;
        }

        setLoading(true);
        setMessage(null);
        try {
            const response = await fetch('http://localhost:3000/api/v1/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 201) {
                setMessage({ type: 'success', text: 'Success: Appointment booked!' });
                alert('Success: Appointment booked!');
                // Reset form or redirect? For now just stay.
            } else if (response.status === 422) {
                const errorData = await response.json();
                // Assuming API returns { error: "Doctor is not available" } or similar
                const errorMsg = errorData.error || 'Doctor is not available';
                setMessage({ type: 'error', text: errorMsg });
                alert(errorMsg);
            } else {
                throw new Error('Failed to book appointment');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            setMessage({ type: 'error', text: 'Error booking appointment. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="appointment-app">
            <h1>Book an Appointment</h1>

            <div className="form-group">
                <label>Select Date:</label>
                <input
                    type="datetime-local"
                    value={selectedDate}
                    onChange={handleDateChange}
                />
            </div>

            <div className="form-group">
                <button onClick={fetchDoctors} disabled={loading}>
                    {loading ? 'Loading...' : 'Find Doctors'}
                </button>
            </div>

            {doctors.length > 0 && (
                <div className="form-group">
                    <label>Select Doctor:</label>
                    <select onChange={handleDoctorSelect} value={formData.doctor_id}>
                        <option value="">-- Select a Doctor --</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} ({doctor.specialization})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="form-group">
                <button
                    onClick={bookAppointment}
                    disabled={loading || !formData.doctor_id}
                    className="book-btn"
                >
                    {loading ? 'Booking...' : 'Book Appointment'}
                </button>
            </div>

            {message && (
                <div className={`message ${message.type}`}>
                    {message.text}
                </div>
            )}
        </div>
    );
};

export default AppointmentApp;

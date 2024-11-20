import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
// import './DoctorProfile.css';

function DoctorProfile() {
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [updatedSlots, setUpdatedSlots] = useState([]);
    const [newSlot, setNewSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState('');
    const navigate = useNavigate();

    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/');
                return;
            }

            try {
                const response = await axios.get(`${url}/api/doctor/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDoctor(response.data);
                const slots = Array.isArray(response.data.availableSlots)
                    ? response.data.availableSlots
                    : JSON.parse(response.data.availableSlots || '[]');
                setAvailableSlots(slots);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setErrors("Error fetching doctor details");
            }
        };

        fetchDoctorDetails();
    }, [navigate]);

    const handleAddSlot = () => {
        if (!newSlot) return;

        const slotExists = availableSlots.includes(newSlot);
        if (!slotExists) {
            setAvailableSlots([...availableSlots, newSlot]);
            setNewSlot('');
        } else {
            setErrors('Slot already exists');
        }
    };

    const handleRemoveSlot = (slot) => {
        const filteredSlots = availableSlots.filter(s => s !== slot);
        setAvailableSlots(filteredSlots);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
            return;
        }

        try {
            const response = await axios.put(
                `${url}/api/doctor/available-slots`,
                { updatedSlots: availableSlots },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert(response.data.message);
            setUpdatedSlots(response.data.availableSlots);
        } catch (error) {
            setErrors('Error updating available slots');
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <Navbar />
            <div className="doctor-profile">
                {errors && <span className="error">{errors}</span>}
                <h1>Doctor Profile</h1>
                <div className="profile-details">
                    <p><strong>Name:</strong> {doctor?.name}</p>
                    <p><strong>Email:</strong> {doctor?.email}</p>
                    <p><strong>Specialization:</strong> {doctor?.specialization}</p>
                </div>

                <h2>Available Slots</h2>
                <div className="slots-list">
                    {availableSlots.length === 0 ? (
                        <p>No available slots</p>
                    ) : (
                        <ul>
                            {availableSlots.map((slot, index) => (
                                <li key={index}>
                                    {slot}
                                    <button onClick={() => handleRemoveSlot(slot)} className="remove-slot-btn">
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="add-slot">
                    <input
                        type="text"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                        placeholder="Add a new slot"
                    />
                    <button onClick={handleAddSlot} className="add-slot-btn">
                        Add Slot
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <button type="submit" className="update-btn">
                        Update Slots
                    </button>
                </form>
            </div>
        </div>
    );
}

export default DoctorProfile;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';  

const PatientConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConsultations = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You are not logged in');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:4000/api/patients/consultations', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.consultations) {
                setConsultations(response.data.consultations);
                } else {
                    setConsultations([]);
                }
            } catch (err) {
                setError('An error occurred while fetching consultations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    return (
        <div>
            <Navbar />
            <h1>Your Consultation Requests</h1>

            {loading ? (
                <p>Loading consultations...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : consultations.length === 0 ? (
                <p>You have not made any consultations yet.</p>
            ) : (
                <div className="consultation-list">
                    {consultations.map((consultation) => (
                        <div className="consultation-item" key={consultation.id}>
                            <h2>Consultation with Dr. {consultation.Doctor.name}</h2>
                            <p>Status: {consultation.status}</p>
                            <p>Slot: {new Date(consultation.slot).toLocaleString()}</p>
                            {/* <p>Reason: {consultation.reason}</p> */}

                            {/* View details link */}
                            {/* <Link to={`/consultations/${consultation.id}`}>
                                <button>View Details</button>
                            </Link> */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PatientConsultations;

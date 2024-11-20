import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import './DoctorConsultations.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const DoctorConsultations = () => {
    const [consultations, setConsultations] = useState([]);
    const [doctorName, setDoctorName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // const navigate = useNavigate();


    const url = "http://localhost:4000";

    useEffect(() => {
        const fetchConsultations = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Fetching consultations...");
                const response = await axios.get(`${url}/api/doctors/consultations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log("Consultations data:", response.data);
                setConsultations(response.data.consultations);
                                setDoctorName(response.data.doctorName);
            } catch (err) {
                console.error("Error fetching consultations:", err);
                setError(err.response?.data?.error || 'An error occurred while fetching consultations.');
            } finally {
                setLoading(false);
            }
        };

        fetchConsultations();
    }, []);

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('role');
    //     navigate('/'); 
    // };

    return (
        <div className="consultation-list">
            <Navbar />
            {/* <div className="header">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div> */}
            <h1>Consultation Requests of Dr. {doctorName}</h1>
            {loading ? (
                <p>Loading consultations...</p>
            ) : error ? (
                <p className="error">{error}</p>
            ) : consultations.length > 0 ? (
                <div className="consultation-boxes">
                    {consultations.map((consultation) => (
                        <div className="consultation-box" key={consultation.id}>
                            <h2>Consultation with {consultation.Patient.name}</h2>
                            <p>
                                Date/Time: {new Date(consultation.slot).toLocaleString('en-GB', {
                                    timeZone: 'UTC',
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false
                                })}
                            </p>
                            <p>Reason: {consultation.reason}</p>
                            <p>Status: {consultation.status}</p>

                            <Link to={`/consultation/${consultation.id}`}>
                                <button className="book-slots-btn">View Details</button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No consultations found.</p>
            )}
        </div>
    );
};

export default DoctorConsultations;
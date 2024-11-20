import React, { useEffect, useState } from "react";
import axios from "axios";
// import './DoctorList.css';
import { Link, useNavigate } from "react-router-dom";
import Navbar from './Navbar';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    const url = "http://localhost:4000";

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${url}/api/doctors`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setDoctors(response.data);
            } catch (error) {
                setErrors("Error fetching doctors");
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, [navigate]);

    // const handleLogout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('role');
    //     navigate('/');
    // };

    return (
        
        <div className="doctor-list">
            <Navbar />
            <h1>Doctors</h1>
            {errors && <span className="error">{errors}</span>}
            {loading ? (
                <p>Loading doctors...</p>
            ) : (
                <div className="doctor-boxes">
                    {doctors.map(doctor => (
                        <div className="doctor-box" key={doctor.doctorId}>
                            <h3>Dr. {doctor.name}</h3>
                            <p>Email: {doctor.email}</p>
                            <p>Specialization: {doctor.specialization}</p>

                            <Link to={`/api/doctor/${doctor.doctorId}/slots`}>
                                <button className="book-slots-btn">Book Slot</button>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

}

export default DoctorList;
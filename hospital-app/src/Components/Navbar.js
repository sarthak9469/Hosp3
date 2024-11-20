import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './Navbar.css';

const Navbar = () => {
    const userRole = localStorage.getItem('role');
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserData(null);
        navigate('/', {replace: true});
      };

    return (
        <div className="navbar">
            <ul>
                {userRole === 'patient' && (
                    <li><Link to="/api/doctors">Doctors</Link></li>
                )}
                {userRole === 'patient' && (
                    <li><Link to="/api/patients/consultations">My Consultation</Link></li>
                )}
                  {userRole === 'doctor' && (
                    <li><Link to="/api/doctors/consultations">Home</Link></li>
                )}
                {userRole === 'doctor' && (
                    <li><Link to="/api/doctors/profile">Profile</Link></li>
                )}
                
                <li><a href="#" onClick={handleLogout}>Logout</a></li>
                </ul>
            
        </div>
    );
};

export default Navbar;

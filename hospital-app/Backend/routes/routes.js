const express = require('express');
const multer = require('multer');
const router = express.Router();
const UserController = require('../controllers/UserController');
const DoctorControllers = require('../controllers/DoctorControllers');
const PatientControllers = require('../controllers/PatientControllers');
const upload = require('../middleware/upload');
const verifyToken = require('../middleware/verify');
const { doctorRegistration, patientRegistration, login } = require('../middleware/validationMiddleware');


router.post('/api/register/doctor', doctorRegistration, DoctorControllers.registerDoctor); //to register doctor
router.post('/api/register/patient', patientRegistration, PatientControllers.registerPatient); //to register patient
router.post('/api/set-password', UserController.setPassword);
router.post('/api/login', login, UserController.login); // to login
router.post('/api/consultations', verifyToken, upload, PatientControllers.requestConsultation); //to book consultations
router.get('/api/doctors', verifyToken, PatientControllers.getDoctors); //get doctors list
router.get('/api/doctor/:doctorId/slots', PatientControllers.getDoctorSlots); //check doctor's full detail
router.get('/api/patients/consultations', verifyToken, PatientControllers.getConsultationsForPatient); //check consultations by patients
router.get('/api/doctors/consultations', verifyToken, DoctorControllers.getConsultationsForDoctor); //check consultations by doctors
router.get('/api/consultations/:consultationId', verifyToken, DoctorControllers.getConsultationDetails);
router.get('/api/doctor/profile', verifyToken, DoctorControllers.getDoctorProfile);
router.put('/api/consultations/:consultationId/status', verifyToken, DoctorControllers.updateConsultationStatus); //update status of consultation
router.put('/api/doctors/available-slots', verifyToken, DoctorControllers.updateAvailableSlots);



module.exports = router;
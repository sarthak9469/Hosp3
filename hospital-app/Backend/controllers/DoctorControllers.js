const jwt = require('jsonwebtoken');
const Doctor = require('../models/doctor');
const Consultation = require('../models/consultation');
const Image = require('../models/image');
const Patient = require('../models/patient');
const sendVerificationEmail = require('../middleware/sendVerificationEmail');
const baseUrl = 'http://localhost:4000';



exports.registerDoctor = async (req, res) => {
    const { name, email, specialization, availableSlots } = req.body;

    let slots = Array.isArray(availableSlots) ? availableSlots : JSON.parse(availableSlots);

    if (!email || !specialization) {
        return res.status(400).json({ error: 'Email and specialization are required' });
    }

    try {
        const existingDoctor = await Doctor.findOne({ where: { email } });
        if (existingDoctor) return res.status(400).json({ error: 'Email is already registered' });

        const newDoctor = await Doctor.create({
            name,
            email,
            specialization,
            availableSlots: slots, 
        });

        const token = jwt.sign({ email: newDoctor.email, id: newDoctor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await sendVerificationEmail(newDoctor.email, token);
        res.status(201).json({ message: 'Doctor registered, check email to set password.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
};


exports.getConsultationsForDoctor = async (req, res) => {
    console.log('Received a request to /api/doctors/consultations');
    const doctorId = parseInt(req.userId, 10);
    // console.log('Decoded User ID:', req.userId);
    // console.log('Parsed Doctor ID:', doctorId);

    try {
        const doctorExists = await Doctor.findByPk(doctorId);
        if (!doctorExists) {
            console.error(`Doctor with ID ${doctorId} not found.`);
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const consultations = await Consultation.findAll({
            where: { doctorId },
            include: [
                {
                    model: Patient,
                    attributes: ['name', 'email']
                },
                {
                    model: Doctor,
                    attributes: ['name']
                }
            ]
        });

        if (!consultations.length) {
            return res.status(200).json({ consultations: [], doctorName: doctorExists.name });
        }

        res.status(200).json({consultations,
            doctorName: doctorExists.name 
        });
    } catch (error) {
        console.error('Error fetching consultations:', error);
        res.status(500).json({ error: 'An error occurred while fetching consultations' });
    }
};


exports.getConsultationDetails = async (req, res) => {
    try {
        const { consultationId } = req.params;

        const consultation = await Consultation.findOne({
            where: { id: consultationId },
            include: [
                {
                    model: Patient,
                    attributes: ['name', 'email']
                },
                {
                    model: Image,
                    attributes: ['imageUrl']
                }
            ]
        });

        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        let images = [];
        if (consultation.Images && consultation.Images.length > 0) {
            images = consultation.Images.map(image => {
                return `${req.protocol}://${req.get('host')}/${image.imageUrl}`
        });
        }

        res.status(200).json({
            ...consultation.toJSON(),
            images: images
        });
    } catch (error) {
        console.error("Error fetching consultation details:", error);
        res.status(500).json({ error: 'An error occurred while fetching consultation details' });
    }
};


exports.updateConsultationStatus = async (req, res) => {
    const { consultationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['Accepted', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    try {
        const consultation = await Consultation.findByPk(consultationId);

        if (!consultation) {
            return res.status(404).json({ error: 'Consultation not found' });
        }

        consultation.status = status;
        await consultation.save();

        res.status(200).json({
            message: 'Consultation status updated successfully',
            consultation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the consultation status' });
    }
};


exports.getDoctorProfile = async (req, res) => {
    const doctorId = req.userId;  

    try {
        const doctor = await Doctor.findByPk(doctorId);

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        return res.status(200).json({
            name: doctor.name,
            email: doctor.email,
            specialization: doctor.specialization,
            availableSlots: doctor.availableSlots, 
        });
    } catch (error) {
        console.error('Error fetching doctor profile:', error);
        return res.status(500).json({ error: 'An error occurred while fetching doctor profile' });
    }
};


exports.updateAvailableSlots = async (req, res) => {
    const doctorId = parseInt(req.userId, 10); 
    const { updatedSlots = [] } = req.body; 

    try {
        if (!Array.isArray(updatedSlots)) {
            return res.status(400).json({ error: 'updatedSlots should be an array' });
        }

        const doctor = await Doctor.findByPk(doctorId);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        let currentSlots = doctor.availableSlots;

        if (!Array.isArray(currentSlots)) {
            try {
                currentSlots = JSON.parse(currentSlots);
            } catch (error) {
                currentSlots = []; 
            }
        }

        currentSlots = currentSlots || [];

        updatedSlots.forEach(newSlot => {
            const index = currentSlots.findIndex(slot => slot === newSlot.oldValue);
            if (index !== -1) {
                currentSlots[index] = newSlot.newValue;
            } else {
                currentSlots.push(newSlot.newValue);
            }
        });

        doctor.availableSlots = currentSlots;
        await doctor.save();

        res.status(200).json({
            message: 'Available slots updated successfully',
            availableSlots: doctor.availableSlots
        });
    } catch (error) {
        console.error('Error updating available slots:', error);
        res.status(500).json({ error: 'An error occurred while updating available slots' });
    }
};





const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');
const { isAuthenticated, isAdmin, checkWorkshopEnrollment } = require('../middleware/auth');

// Get all workshops
router.get('/', async (req, res) => {
    try {
        const workshops = await Workshop.find()
            .sort({ date: 'asc' });
        
        res.json({
            success: true,
            count: workshops.length,
            data: workshops
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workshops'
        });
    }
});

// Get single workshop
router.get('/:id', async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);
        
        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        res.json({
            success: true,
            data: workshop
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching workshop'
        });
    }
});

// Create new workshop (Admin only)
router.post('/', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const workshop = await Workshop.create(req.body);
        
        res.status(201).json({
            success: true,
            data: workshop
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Update workshop (Admin only)
router.put('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        res.json({
            success: true,
            data: workshop
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});

// Delete workshop (Admin only)
router.delete('/:id', isAuthenticated, isAdmin, async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndDelete(req.params.id);

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        res.json({
            success: true,
            message: 'Workshop deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting workshop'
        });
    }
});

// Enroll in workshop
router.post('/:id/enroll', isAuthenticated, async (req, res) => {
    try {
        const workshop = await Workshop.findById(req.params.id);

        if (!workshop) {
            return res.status(404).json({
                success: false,
                message: 'Workshop not found'
            });
        }

        // Check if already enrolled
        if (workshop.enrolledParticipants.includes(req.user._id)) {
            return res.status(400).json({
                success: false,
                message: 'Already enrolled in this workshop'
            });
        }

        // Check capacity
        if (workshop.enrolledParticipants.length >= workshop.capacity) {
            return res.status(400).json({
                success: false,
                message: 'Workshop is full'
            });
        }

        workshop.enrolledParticipants.push(req.user._id);
        await workshop.save();

        res.json({
            success: true,
            message: 'Successfully enrolled in workshop'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error enrolling in workshop'
        });
    }
});

module.exports = router;

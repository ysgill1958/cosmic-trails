const mongoose = require('mongoose');

const workshopSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, // in hours
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    enrolledParticipants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    imageUrl: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    topics: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    }
}, {
    timestamps: true
});

// Add index for searching
workshopSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Workshop', workshopSchema);

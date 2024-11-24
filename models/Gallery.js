const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['milky-way', 'deep-sky', 'star-trails', 'nightscape', 'telescopic'],
        required: true
    },
    equipment: {
        camera: String,
        lens: String,
        telescope: String,
        mount: String,
        filters: [String],
        other: String
    },
    technicalDetails: {
        exposure: String,
        iso: String,
        aperture: String,
        focalLength: String,
        stacking: Number,
        processing: String
    },
    location: {
        type: String,
        required: true
    },
    dateTaken: {
        type: Date,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: String
    }],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Add indexes for searching and filtering
gallerySchema.index({ title: 'text', description: 'text', tags: 'text' });
gallerySchema.index({ category: 1, featured: 1 });

module.exports = mongoose.model('Gallery', gallerySchema);

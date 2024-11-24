const User = require('../models/User');

exports.isAuthenticated = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({
            success: false,
            message: 'Please login to access this resource'
        });
    }

    try {
        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error authenticating user'
        });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role (${req.user.role}) is not allowed to access this resource`
            });
        }
        next();
    };
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};

exports.checkWorkshopEnrollment = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('enrolledWorkshops');
        
        const isEnrolled = user.enrolledWorkshops.some(
            workshop => workshop._id.toString() === req.params.workshopId
        );

        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: 'Please enroll in this workshop to access its resources'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking workshop enrollment'
        });
    }
};

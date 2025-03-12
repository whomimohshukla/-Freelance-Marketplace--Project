const mongoose = require('mongoose');

exports.validateObjectId = (paramName) => {
    return (req, res, next) => {
        const id = req.params[paramName];
        
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: `Invalid ${paramName} format. Must be a 24 character hex string.`
            });
        }
        next();
    };
};

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'], 
        trim: true 
    },
    isAdmin: { 
        type: Boolean, 
        default: true // Set to true for admin, false for regular users (if needed later)
    }
}, {
    timestamps: true // Add createdAt and updatedAt automatically
});

module.exports = mongoose.model('User', userSchema);
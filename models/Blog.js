const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        unique: true, 
        trim: true 
    },
    content: { 
        type: String, 
        required: [true, 'Content is required'], 
        trim: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    },
    likes: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
    imageUrl: { 
        type: String, 
        default: '', 
        trim: true 
    }
}, {
    timestamps: true // Add createdAt and updatedAt automatically
});

module.exports = mongoose.model('Blog', blogSchema);
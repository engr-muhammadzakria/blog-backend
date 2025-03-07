const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    blogId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Blog', 
        required: [true, 'Blog ID is required'] 
    },
    content: { 
        type: String, 
        required: [true, 'Content is required'], 
        trim: true 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Add createdAt and updatedAt automatically
});

module.exports = mongoose.model('Comment', commentSchema);
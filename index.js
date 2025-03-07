const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Blog = require('./models/Blog');
const Comment = require('./models/Comment');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS to allow frontend on InfinityFree to access the backend

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI ||'mongodb+srv://bloguser:c1B5sq1hI7s99Uer:c1B5sq1hI7s99Uer@blog-cluster.pbnn0.mongodb.net/?retryWrites=true&w=majority&appName=blog-cluster', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Storage for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'public/uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// API Routes

// Blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ date: -1 });
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/blogs/:blogId', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/blogs', async (req, res) => {
    try {
        const { title, content, imageUrl } = req.body;
        const blog = new Blog({ title, content, imageUrl, date: new Date(), likes: 0 });
        await blog.save();
        res.json(blog);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.put('/api/blogs/:blogId/like', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        blog.likes = (blog.likes || 0) + 1;
        await blog.save();
        res.json(blog);
    } catch (error) {
        console.error('Error liking blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/api/blogs/:blogId', async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.blogId);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Image Upload
app.post('/api/blogs/upload-image', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

// Comments
app.get('/api/comments/:blogId', async (req, res) => {
    try {
        const comments = await Comment.find({ blogId: req.params.blogId }).sort({ date: -1 });
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/comments', async (req, res) => {
    try {
        const { blogId, content } = req.body;
        const comment = new Comment({ blogId, content, date: new Date() });
        await comment.save();
        res.json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login (optional, can be removed if not needed)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === 'admin@example.com' && password === 'password123') {
            const token = 'fake-jwt-token'; // In production, use a real JWT library
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start the server
const port = process.env.PORT || 3000; // Render assigns a port via process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
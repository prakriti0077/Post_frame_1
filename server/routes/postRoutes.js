const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware.js');
const Post = require('../models/Post.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname-timestamp.ext
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create Post (Now accepts Files)
// Note: 'image' is the key name expected from frontend form data
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { text } = req.body;
    // If a file was uploaded, req.file will exist. Save the path.
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    if (!text && !imagePath) {
        return res.status(400).json({ msg: 'Post must have text or image' });
    }

    const newPost = new Post({
      user: req.user.id,
      text,
      image: imagePath, // Store the local path in DB
    });

    const post = await newPost.save();
    await post.populate('user', 'username');
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// ... Keep Get, Like, Comment routes exactly the same as before ...
// (Re-paste the GET, PUT like, POST comment code from previous steps here if needed, 
// strictly only the Create Post route changed above)

// Get All Posts (Unchanged)
router.get('/', async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }).populate('user', 'username');
      res.json(posts);
    } catch (err) {
      res.status(500).send('Server Error');
    }
});

// Like/Unlike (Unchanged)
router.put('/:id/like', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
      if (post.likes.includes(req.user.id)) {
        post.likes = post.likes.filter(id => id.toString() !== req.user.id);
      } else {
        post.likes.push(req.user.id);
      }
      await post.save();
      res.json(post.likes);
    } catch (err) {
      res.status(500).send('Server Error');
    }
});

// Comment (Unchanged)
router.post('/:id/comment', auth, async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ msg: 'Post not found' });
      const newComment = { user: req.user.id, username: req.user.username, text: req.body.text };
      post.comments.push(newComment);
      await post.save();
      res.json(post.comments);
    } catch (err) {
      res.status(500).send('Server Error');
    }
});

module.exports = router;
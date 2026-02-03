const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Import path
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (allowedOrigins.length === 0) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));



app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
// ... imports


// ... rest of code
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

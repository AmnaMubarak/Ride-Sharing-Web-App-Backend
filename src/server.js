const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth.routes');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Ride Sharing API' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
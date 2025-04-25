const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./config/db');
const authRoutes = require('./route/userRoutes');
const productRoutes = require('./route/productRoutes');
const Allroute=require('./route/index')
const { errorHandler } = require('./utils/helpers');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize database
initDB()
  .then(() => console.log('Database initialized successfully'))
  .catch(err => {
    console.error('Database initialization failed:', err);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if doesn't exist
const fs = require('fs');
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api', productRoutes);

app.use('/api',Allroute)

// Home route
app.get('/', (req, res) => {
  res.send('Product Management API');
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require('express');
const cors    = require('cors');
const path    = require('path');
const http    = require('http');
require('dotenv').config();

// Prevent unhandled rejections from killing the process
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

const authRoutes    = require('./routes/auth');
const reportRoutes  = require('./routes/reports');
const commentRoutes = require('./routes/comments');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',    authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/reports', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'ZUT Maintenance Reporter API is running' });
});

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err.message);
});
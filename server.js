const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
sequelize.authenticate()
  .then(async () => {
    console.log('✅ MySQL connected');
    await sequelize.sync();
    console.log('✅ Database synced');
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const startServer = (host, port) => {
  const server = app.listen(port, host, () => {
    console.log(`🚀 Server running on http://${host}:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRNOTAVAIL' && host !== '127.0.0.1') {
      console.error(`❌ Cannot bind to ${host}:${port}. Trying 127.0.0.1 instead...`);
      startServer('127.0.0.1', port);
      return;
    }

    if (err.code === 'EADDRINUSE') {
      const nextPort = Number(port) + 1;
      console.error(`❌ Port ${port} is already in use. Trying ${nextPort}...`);
      startServer(host, nextPort);
      return;
    }

    console.error('❌ Server listen error:', err);
    process.exit(1);
  });
};

startServer(HOST, Number(PORT));
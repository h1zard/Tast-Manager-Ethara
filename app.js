const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const viewRoutes = require('./routes/viewRoutes');

const app = express();

// ✅ Railway PORT
const PORT = process.env.PORT || 8080;

// ✅ Required for cookies in production
app.set('trust proxy', 1);

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', viewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.status(404).render('404', { title: 'Page not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  if (req.originalUrl.startsWith('/api/')) {
    return res.status(err.status || 500).json({ error: err.message || 'Server error' });
  }
  res.status(err.status || 500).render('error', { message: err.message || 'Server error' });
});

// 🚀 Start server
async function startServer() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is required');
    }

    await mongoose.connect(mongoUri);

    console.log('✅ Connected to MongoDB');

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
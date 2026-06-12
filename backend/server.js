const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectMongo, connectPG } = require('./config/db');
const initDB = require('./config/initDB');

console.log('Loading auth routes...');
const authRoutes = require('./routes/auth');
console.log('authRoutes type:', typeof authRoutes);

console.log('Loading application routes...');
const applicationRoutes = require('./routes/applications');
console.log('applicationRoutes type:', typeof applicationRoutes);

console.log('Loading note routes...');
const noteRoutes = require('./routes/notes');
console.log('noteRoutes type:', typeof noteRoutes);

const app = express();
app.use(cors({
  origin: '*'
}));
app.use(express.json());

const start = async () => {
  await connectMongo();
  await connectPG();
  await initDB();

  app.use('/api/auth', authRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/notes', noteRoutes);

  app.get('/', (req, res) => res.send('API running'));

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();
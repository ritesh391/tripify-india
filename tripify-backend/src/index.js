const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const tripRoutes = require('./routes/trips');
const placesRoutes = require('./routes/places');
const bookingsRoutes = require('./routes/bookings');
const staysRoutes = require('./routes/stays');
const communityRoutes = require('./routes/community');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Tripify India Backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/stays', staysRoutes);
app.use('/api/community', communityRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
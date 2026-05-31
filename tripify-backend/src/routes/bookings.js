const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Get all bookings for user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json({ bookings: bookings.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, title, date, price, details } = req.body;
    const booking_ref = `TRP-${Math.floor(10000 + Math.random() * 90000)}-IN`;
    const newBooking = await pool.query(
      `INSERT INTO bookings (user_id, booking_ref, type, title, date, price, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, booking_ref, type, title, date, price, details]
    );
    res.status(201).json({ message: 'Booking created!', booking: newBooking.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel a booking
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 AND user_id = $3',
      ['cancelled', req.params.id, req.user.id]
    );
    res.json({ message: 'Booking cancelled!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
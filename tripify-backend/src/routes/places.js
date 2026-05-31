const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all places
router.get('/', async (req, res) => {
  try {
    const places = await pool.query(
      'SELECT * FROM places ORDER BY rating DESC'
    );
    res.json({ places: places.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get places by city
router.get('/city/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const places = await pool.query(
      'SELECT * FROM places WHERE LOWER(city) = LOWER($1)',
      [city]
    );
    res.json({ places: places.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single place
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const place = await pool.query(
      'SELECT * FROM places WHERE id = $1',
      [id]
    );
    if (place.rows.length === 0) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json({ place: place.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
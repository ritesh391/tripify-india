const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { city, type, maxPrice } = req.query;
    let query = 'SELECT * FROM stays WHERE 1=1';
    const params = [];
    if (city) { params.push(`%${city}%`); query += ` AND LOWER(city) LIKE LOWER($${params.length})`; }
    if (type && type !== 'all') { params.push(type); query += ` AND type = $${params.length}`; }
    if (maxPrice) { params.push(maxPrice); query += ` AND price <= $${params.length}`; }
    query += ' ORDER BY rating DESC';
    const result = await pool.query(query, params);
    res.json({ stays: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM stays WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Stay not found' });
    res.json({ stay: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
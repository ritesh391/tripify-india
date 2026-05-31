const pool = require('../config/db');

// Create a new trip
const createTrip = async (req, res) => {
  try {
    const { title, destination, start_date, end_date, budget, travelers } = req.body;
    const user_id = req.user.id;

    const newTrip = await pool.query(
      `INSERT INTO trips (user_id, title, destination, start_date, end_date, budget, travelers)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, title, destination, start_date, end_date, budget, travelers]
    );

    res.status(201).json({
      message: 'Trip created successfully!',
      trip: newTrip.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all trips for a user
const getMyTrips = async (req, res) => {
  try {
    const user_id = req.user.id;

    const trips = await pool.query(
      'SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.json({ trips: trips.rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single trip
const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const trip = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    if (trip.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json({ trip: trip.rows[0] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a trip
const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2',
      [id, user_id]
    );

    res.json({ message: 'Trip deleted successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createTrip, getMyTrips, getTripById, deleteTrip };
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Get all posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name as author_name 
       FROM community_posts p 
       JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC`
    );
    res.json({ posts: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { place, quote, tags } = req.body;
    const result = await pool.query(
      `INSERT INTO community_posts (user_id, place, quote, tags, likes)
       VALUES ($1, $2, $3, $4, 0) RETURNING *`,
      [req.user.id, place, quote, tags || []]
    );
    res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like a post
router.patch('/:id/like', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE community_posts SET likes = likes + 1 WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    res.json({ post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query(
      'DELETE FROM community_posts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Post deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
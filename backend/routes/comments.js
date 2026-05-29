const express = require('express');
const db      = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/reports/:id/comments — both roles can comment
router.post('/:id/comments', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { body } = req.body;

  if (!body || body.trim() === '') {
    return res.status(400).json({ message: 'Comment body is required' });
  }

  try {
    // Make sure the report exists
    const report = await db.query(
      'SELECT id, user_id FROM reports WHERE id = $1',
      [id]
    );

    if (report.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Students can only comment on their own reports
    if (
      req.user.role !== 'admin' &&
      report.rows[0].user_id !== req.user.userId
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const result = await db.query(
      `INSERT INTO comments (body, user_id, report_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [body.trim(), req.user.userId, id]
    );

    // Return comment with author info
    const full = await db.query(
      `SELECT comments.*, users.name AS author, users.role AS author_role
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(full.rows[0]);

  } catch (err) {
    console.error('Comment error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const db       = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const valid = allowed.test(path.extname(file.originalname).toLowerCase());
    if (valid) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, webp)'));
    }
  }
});

// GET /api/reports
// Admin gets all reports, student gets only their own
router.get('/', requireAuth, async (req, res) => {
  try {
    let result;

    if (req.user.role === 'admin') {
      result = await db.query(
        `SELECT reports.*, users.name AS submitted_by
         FROM reports
         JOIN users ON reports.user_id = users.id
         ORDER BY reports.created_at DESC`
      );
    } else {
      result = await db.query(
        `SELECT reports.*, users.name AS submitted_by
         FROM reports
         JOIN users ON reports.user_id = users.id
         WHERE reports.user_id = $1
         ORDER BY reports.created_at DESC`,
        [req.user.userId]
      );
    }

    res.json(result.rows);

  } catch (err) {
    console.error('Get reports error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reports/:id
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const reportResult = await db.query(
      `SELECT reports.*, users.name AS submitted_by
       FROM reports
       JOIN users ON reports.user_id = users.id
       WHERE reports.id = $1`,
      [id]
    );

    if (reportResult.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const report = reportResult.rows[0];

    // Students can only view their own reports
    if (req.user.role !== 'admin' && report.user_id !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Get comments for this report
    const commentsResult = await db.query(
      `SELECT comments.*, users.name AS author, users.role AS author_role
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.report_id = $1
       ORDER BY comments.created_at ASC`,
      [id]
    );

    res.json({ ...report, comments: commentsResult.rows });

  } catch (err) {
    console.error('Get report error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reports — students only
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  const { title, description, location, category } = req.body;

  if (!title || !description || !location || !category) {
    return res.status(400).json({ message: 'Title, description, location and category are required' });
  }

  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    const result = await db.query(
      `INSERT INTO reports (title, description, location, category, image_url, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, location, category, imageUrl, req.user.userId]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error('Create report error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/reports/:id — admin updates status
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['Pending', 'In Progress', 'Resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const result = await db.query(
      `UPDATE reports
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Update report error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/reports/:id — admin only
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM reports WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });

  } catch (err) {
    console.error('Delete report error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
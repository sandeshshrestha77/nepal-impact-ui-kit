const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all programs
router.get('/', (req, res) => {
  const db = getDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status || 'active';
  const featured = req.query.featured;

  let query = 'SELECT * FROM programs WHERE status = ?';
  let countQuery = 'SELECT COUNT(*) as total FROM programs WHERE status = ?';
  let params = [status];

  if (featured !== undefined) {
    query += ' AND featured = ?';
    countQuery += ' AND featured = ?';
    params.push(featured === 'true' ? 1 : 0);
  }

  query += ' ORDER BY featured DESC, created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.get(countQuery, params.slice(0, -2), (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.all(query, params, (err, programs) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      // Parse features JSON
      const parsedPrograms = programs.map(program => ({
        ...program,
        features: JSON.parse(program.features || '[]')
      }));

      res.json({
        programs: parsedPrograms,
        pagination: {
          page,
          limit,
          total: countResult.total,
          pages: Math.ceil(countResult.total / limit)
        }
      });
    });
  });
});

// Get program by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const programId = req.params.id;

  db.get(
    'SELECT * FROM programs WHERE id = ?',
    [programId],
    (err, program) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }

      // Parse features JSON
      program.features = JSON.parse(program.features || '[]');

      res.json({ program });
    }
  );
});

// Create program (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').isLength({ min: 3 }),
  body('description').isLength({ min: 10 }),
  body('duration').notEmpty(),
  body('format').notEmpty(),
  body('participants').notEmpty(),
  body('features').isArray(),
  body('next_cohort').notEmpty()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const {
    title,
    description,
    duration,
    format,
    participants,
    features,
    next_cohort,
    featured = false,
    image,
    status = 'active'
  } = req.body;

  db.run(
    `INSERT INTO programs (title, description, duration, format, participants, features, next_cohort, featured, image, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, duration, format, participants, JSON.stringify(features), next_cohort, featured ? 1 : 0, image, status],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({
        message: 'Program created successfully',
        program: { id: this.lastID, ...req.body }
      });
    }
  );
});

// Update program (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().isLength({ min: 3 }),
  body('description').optional().isLength({ min: 10 }),
  body('features').optional().isArray()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const programId = req.params.id;
  const {
    title,
    description,
    duration,
    format,
    participants,
    features,
    next_cohort,
    featured,
    image,
    status
  } = req.body;

  const updates = [];
  const params = [];

  if (title) {
    updates.push('title = ?');
    params.push(title);
  }

  if (description) {
    updates.push('description = ?');
    params.push(description);
  }

  if (duration) {
    updates.push('duration = ?');
    params.push(duration);
  }

  if (format) {
    updates.push('format = ?');
    params.push(format);
  }

  if (participants) {
    updates.push('participants = ?');
    params.push(participants);
  }

  if (features) {
    updates.push('features = ?');
    params.push(JSON.stringify(features));
  }

  if (next_cohort) {
    updates.push('next_cohort = ?');
    params.push(next_cohort);
  }

  if (featured !== undefined) {
    updates.push('featured = ?');
    params.push(featured ? 1 : 0);
  }

  if (image !== undefined) {
    updates.push('image = ?');
    params.push(image);
  }

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(programId);

  db.run(
    `UPDATE programs SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }

      res.json({ message: 'Program updated successfully' });
    }
  );
});

// Delete program (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const programId = req.params.id;

  db.run(
    'DELETE FROM programs WHERE id = ?',
    [programId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Program not found' });
      }

      res.json({ message: 'Program deleted successfully' });
    }
  );
});

module.exports = router;
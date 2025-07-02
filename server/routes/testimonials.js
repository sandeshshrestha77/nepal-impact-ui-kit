const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all testimonials
router.get('/', (req, res) => {
  const db = getDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status || 'active';
  const featured = req.query.featured;

  let query = 'SELECT * FROM testimonials WHERE status = ?';
  let countQuery = 'SELECT COUNT(*) as total FROM testimonials WHERE status = ?';
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

    db.all(query, params, (err, testimonials) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        testimonials,
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

// Get testimonial by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const testimonialId = req.params.id;

  db.get(
    'SELECT * FROM testimonials WHERE id = ?',
    [testimonialId],
    (err, testimonial) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      res.json({ testimonial });
    }
  );
});

// Create testimonial (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').isLength({ min: 2 }),
  body('business').isLength({ min: 2 }),
  body('location').isLength({ min: 2 }),
  body('quote').isLength({ min: 10 }),
  body('achievement').isLength({ min: 2 }),
  body('program').isLength({ min: 2 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const {
    name,
    business,
    location,
    quote,
    achievement,
    program,
    image,
    featured = false,
    status = 'active'
  } = req.body;

  db.run(
    `INSERT INTO testimonials (name, business, location, quote, achievement, program, image, featured, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, business, location, quote, achievement, program, image, featured ? 1 : 0, status],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({
        message: 'Testimonial created successfully',
        testimonial: { id: this.lastID, ...req.body }
      });
    }
  );
});

// Update testimonial (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('name').optional().isLength({ min: 2 }),
  body('business').optional().isLength({ min: 2 }),
  body('location').optional().isLength({ min: 2 }),
  body('quote').optional().isLength({ min: 10 }),
  body('achievement').optional().isLength({ min: 2 }),
  body('program').optional().isLength({ min: 2 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const testimonialId = req.params.id;
  const {
    name,
    business,
    location,
    quote,
    achievement,
    program,
    image,
    featured,
    status
  } = req.body;

  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }

  if (business) {
    updates.push('business = ?');
    params.push(business);
  }

  if (location) {
    updates.push('location = ?');
    params.push(location);
  }

  if (quote) {
    updates.push('quote = ?');
    params.push(quote);
  }

  if (achievement) {
    updates.push('achievement = ?');
    params.push(achievement);
  }

  if (program) {
    updates.push('program = ?');
    params.push(program);
  }

  if (image !== undefined) {
    updates.push('image = ?');
    params.push(image);
  }

  if (featured !== undefined) {
    updates.push('featured = ?');
    params.push(featured ? 1 : 0);
  }

  if (status) {
    updates.push('status = ?');
    params.push(status);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(testimonialId);

  db.run(
    `UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      res.json({ message: 'Testimonial updated successfully' });
    }
  );
});

// Delete testimonial (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const testimonialId = req.params.id;

  db.run(
    'DELETE FROM testimonials WHERE id = ?',
    [testimonialId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }

      res.json({ message: 'Testimonial deleted successfully' });
    }
  );
});

module.exports = router;
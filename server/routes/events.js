const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all events
router.get('/', (req, res) => {
  const db = getDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status;
  const featured = req.query.featured;

  let query = 'SELECT * FROM events';
  let countQuery = 'SELECT COUNT(*) as total FROM events';
  let params = [];
  let conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (featured !== undefined) {
    conditions.push('featured = ?');
    params.push(featured === 'true' ? 1 : 0);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
    countQuery += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY featured DESC, date DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.get(countQuery, params.slice(0, -2), (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.all(query, params, (err, events) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        events,
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

// Get event by ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const eventId = req.params.id;

  db.get(
    'SELECT * FROM events WHERE id = ?',
    [eventId],
    (err, event) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ event });
    }
  );
});

// Create event (admin only)
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('title').isLength({ min: 3 }),
  body('description').isLength({ min: 10 }),
  body('date').isISO8601(),
  body('type').isLength({ min: 2 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const {
    title,
    description,
    date,
    location,
    type,
    capacity,
    image,
    featured = false,
    status = 'upcoming'
  } = req.body;

  db.run(
    `INSERT INTO events (title, description, date, location, type, capacity, image, featured, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, date, location, type, capacity, image, featured ? 1 : 0, status],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({
        message: 'Event created successfully',
        event: { id: this.lastID, ...req.body }
      });
    }
  );
});

// Update event (admin only)
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  body('title').optional().isLength({ min: 3 }),
  body('description').optional().isLength({ min: 10 }),
  body('date').optional().isISO8601(),
  body('type').optional().isLength({ min: 2 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const eventId = req.params.id;
  const {
    title,
    description,
    date,
    location,
    type,
    capacity,
    registered,
    image,
    featured,
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

  if (date) {
    updates.push('date = ?');
    params.push(date);
  }

  if (location !== undefined) {
    updates.push('location = ?');
    params.push(location);
  }

  if (type) {
    updates.push('type = ?');
    params.push(type);
  }

  if (capacity !== undefined) {
    updates.push('capacity = ?');
    params.push(capacity);
  }

  if (registered !== undefined) {
    updates.push('registered = ?');
    params.push(registered);
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
  params.push(eventId);

  db.run(
    `UPDATE events SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event updated successfully' });
    }
  );
});

// Delete event (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const eventId = req.params.id;

  db.run(
    'DELETE FROM events WHERE id = ?',
    [eventId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.json({ message: 'Event deleted successfully' });
    }
  );
});

// Register for event
router.post('/:id/register', [
  body('name').isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').optional().isLength({ min: 10 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const eventId = req.params.id;
  const { name, email, phone } = req.body;

  // Check if event exists and has capacity
  db.get(
    'SELECT * FROM events WHERE id = ? AND status = "upcoming"',
    [eventId],
    (err, event) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!event) {
        return res.status(404).json({ message: 'Event not found or not available for registration' });
      }

      if (event.capacity && event.registered >= event.capacity) {
        return res.status(400).json({ message: 'Event is full' });
      }

      // Update registered count
      db.run(
        'UPDATE events SET registered = registered + 1 WHERE id = ?',
        [eventId],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Database error' });
          }

          res.json({ 
            message: 'Successfully registered for event',
            event: {
              id: event.id,
              title: event.title,
              date: event.date
            }
          });
        }
      );
    }
  );
});

module.exports = router;
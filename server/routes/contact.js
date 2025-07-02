const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Submit contact message
router.post('/', [
  body('name').isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('message').isLength({ min: 10 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const { name, email, message } = req.body;

  db.run(
    'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
    [name, email, message],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.status(201).json({
        message: 'Message sent successfully',
        id: this.lastID
      });
    }
  );
});

// Get all contact messages (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const status = req.query.status;

  let query = 'SELECT * FROM contact_messages';
  let countQuery = 'SELECT COUNT(*) as total FROM contact_messages';
  let params = [];

  if (status) {
    query += ' WHERE status = ?';
    countQuery += ' WHERE status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.get(countQuery, status ? [status] : [], (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.all(query, params, (err, messages) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        messages,
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

// Get contact message by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const messageId = req.params.id;

  db.get(
    'SELECT * FROM contact_messages WHERE id = ?',
    [messageId],
    (err, message) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.json({ message });
    }
  );
});

// Update message status (admin only)
router.put('/:id/status', [
  authenticateToken,
  requireAdmin,
  body('status').isIn(['unread', 'read', 'replied'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const messageId = req.params.id;
  const { status } = req.body;

  db.run(
    'UPDATE contact_messages SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, messageId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.json({ message: 'Status updated successfully' });
    }
  );
});

// Delete contact message (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const messageId = req.params.id;

  db.run(
    'DELETE FROM contact_messages WHERE id = ?',
    [messageId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.json({ message: 'Message deleted successfully' });
    }
  );
});

// Newsletter subscription
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const { email } = req.body;

  db.run(
    'INSERT OR REPLACE INTO newsletter_subscriptions (email, status) VALUES (?, "active")',
    [email],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({ message: 'Successfully subscribed to newsletter' });
    }
  );
});

// Get newsletter subscriptions (admin only)
router.get('/newsletter/subscriptions', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const countQuery = 'SELECT COUNT(*) as total FROM newsletter_subscriptions WHERE status = "active"';
  const query = 'SELECT * FROM newsletter_subscriptions WHERE status = "active" ORDER BY created_at DESC LIMIT ? OFFSET ?';

  db.get(countQuery, (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.all(query, [limit, offset], (err, subscriptions) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        subscriptions,
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

module.exports = router;
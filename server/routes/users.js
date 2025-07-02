const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';

  let query = 'SELECT id, email, name, role, avatar, created_at FROM users';
  let countQuery = 'SELECT COUNT(*) as total FROM users';
  let params = [];

  if (search) {
    query += ' WHERE name LIKE ? OR email LIKE ?';
    countQuery += ' WHERE name LIKE ? OR email LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  db.get(countQuery, search ? [`%${search}%`, `%${search}%`] : [], (err, countResult) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    db.all(query, params, (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      res.json({
        users,
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

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
  const db = getDatabase();
  const userId = req.params.id;

  // Users can only view their own profile unless they're admin
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  db.get(
    'SELECT id, email, name, role, avatar, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    }
  );
});

// Update user
router.put('/:id', [
  authenticateToken,
  body('name').optional().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['admin', 'user'])
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const userId = req.params.id;
  const { name, email, role } = req.body;

  // Users can only update their own profile unless they're admin
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Only admins can change roles
  if (role && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can change user roles' });
  }

  const updates = [];
  const params = [];

  if (name) {
    updates.push('name = ?');
    params.push(name);
  }

  if (email) {
    updates.push('email = ?');
    params.push(email);
  }

  if (role && req.user.role === 'admin') {
    updates.push('role = ?');
    params.push(role);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  updates.push('updated_at = CURRENT_TIMESTAMP');
  params.push(userId);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ message: 'Email already exists' });
        }
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully' });
    }
  );
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const userId = req.params.id;

  // Prevent admin from deleting themselves
  if (req.user.id === parseInt(userId)) {
    return res.status(400).json({ message: 'Cannot delete your own account' });
  }

  db.run(
    'DELETE FROM users WHERE id = ?',
    [userId],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User deleted successfully' });
    }
  );
});

// Change password
router.put('/:id/password', [
  authenticateToken,
  body('currentPassword').isLength({ min: 6 }),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const db = getDatabase();
  const userId = req.params.id;
  const { currentPassword, newPassword } = req.body;

  // Users can only change their own password unless they're admin
  if (req.user.role !== 'admin' && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    db.get(
      'SELECT password FROM users WHERE id = ?',
      [userId],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }

        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password (skip for admin changing other user's password)
        if (req.user.id === parseInt(userId)) {
          const isValidPassword = await bcrypt.compare(currentPassword, user.password);
          if (!isValidPassword) {
            return res.status(400).json({ message: 'Current password is incorrect' });
          }
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        db.run(
          'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [hashedPassword, userId],
          function(err) {
            if (err) {
              return res.status(500).json({ message: 'Database error' });
            }

            res.json({ message: 'Password updated successfully' });
          }
        );
      }
    );
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
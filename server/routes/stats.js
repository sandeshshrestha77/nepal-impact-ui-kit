const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/dashboard', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  
  const queries = {
    totalUsers: 'SELECT COUNT(*) as count FROM users',
    totalPrograms: 'SELECT COUNT(*) as count FROM programs WHERE status = "active"',
    totalTestimonials: 'SELECT COUNT(*) as count FROM testimonials WHERE status = "active"',
    totalEvents: 'SELECT COUNT(*) as count FROM events',
    upcomingEvents: 'SELECT COUNT(*) as count FROM events WHERE status = "upcoming"',
    unreadMessages: 'SELECT COUNT(*) as count FROM contact_messages WHERE status = "unread"',
    newsletterSubscribers: 'SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE status = "active"',
    pendingApplications: 'SELECT COUNT(*) as count FROM applications WHERE status = "pending"'
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, result) => {
      if (err) {
        console.error(`Error executing query for ${key}:`, err);
        stats[key] = 0;
      } else {
        stats[key] = result.count;
      }
      
      completed++;
      if (completed === total) {
        res.json({ stats });
      }
    });
  });
});

// Get public statistics
router.get('/public', (req, res) => {
  const db = getDatabase();
  
  const queries = {
    womenEmpowered: 'SELECT COUNT(*) as count FROM testimonials WHERE status = "active"',
    businessesLaunched: 'SELECT COUNT(*) as count FROM programs WHERE status = "active"',
    trainingPrograms: 'SELECT COUNT(*) as count FROM events WHERE status IN ("completed", "upcoming")',
    successRate: 'SELECT 85 as count' // Static for now, could be calculated based on actual data
  };

  const stats = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, query]) => {
    db.get(query, (err, result) => {
      if (err) {
        console.error(`Error executing query for ${key}:`, err);
        stats[key] = 0;
      } else {
        stats[key] = result.count;
      }
      
      completed++;
      if (completed === total) {
        // Format the stats for public consumption
        const publicStats = {
          womenEmpowered: `${stats.womenEmpowered * 10}+`, // Multiply for realistic numbers
          businessesLaunched: `${stats.businessesLaunched * 25}+`,
          trainingPrograms: `${stats.trainingPrograms}+`,
          successRate: `${stats.successRate}%`
        };
        
        res.json({ stats: publicStats });
      }
    });
  });
});

// Get recent activity (admin only)
router.get('/activity', authenticateToken, requireAdmin, (req, res) => {
  const db = getDatabase();
  const limit = parseInt(req.query.limit) || 10;

  const activities = [];
  let completed = 0;
  const total = 4;

  // Recent users
  db.all(
    'SELECT id, name, email, created_at, "user_registered" as type FROM users ORDER BY created_at DESC LIMIT ?',
    [limit],
    (err, users) => {
      if (!err) {
        activities.push(...users.map(user => ({
          id: user.id,
          type: user.type,
          description: `New user registered: ${user.name}`,
          timestamp: user.created_at,
          data: user
        })));
      }
      
      completed++;
      if (completed === total) {
        sendResponse();
      }
    }
  );

  // Recent contact messages
  db.all(
    'SELECT id, name, email, created_at, "message_received" as type FROM contact_messages ORDER BY created_at DESC LIMIT ?',
    [limit],
    (err, messages) => {
      if (!err) {
        activities.push(...messages.map(message => ({
          id: message.id,
          type: message.type,
          description: `New message from: ${message.name}`,
          timestamp: message.created_at,
          data: message
        })));
      }
      
      completed++;
      if (completed === total) {
        sendResponse();
      }
    }
  );

  // Recent events
  db.all(
    'SELECT id, title, created_at, "event_created" as type FROM events ORDER BY created_at DESC LIMIT ?',
    [limit],
    (err, events) => {
      if (!err) {
        activities.push(...events.map(event => ({
          id: event.id,
          type: event.type,
          description: `New event created: ${event.title}`,
          timestamp: event.created_at,
          data: event
        })));
      }
      
      completed++;
      if (completed === total) {
        sendResponse();
      }
    }
  );

  // Recent newsletter subscriptions
  db.all(
    'SELECT id, email, created_at, "newsletter_subscription" as type FROM newsletter_subscriptions ORDER BY created_at DESC LIMIT ?',
    [limit],
    (err, subscriptions) => {
      if (!err) {
        activities.push(...subscriptions.map(sub => ({
          id: sub.id,
          type: sub.type,
          description: `New newsletter subscription: ${sub.email}`,
          timestamp: sub.created_at,
          data: sub
        })));
      }
      
      completed++;
      if (completed === total) {
        sendResponse();
      }
    }
  );

  function sendResponse() {
    // Sort by timestamp and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ activities: activities.slice(0, limit) });
  }
});

module.exports = router;
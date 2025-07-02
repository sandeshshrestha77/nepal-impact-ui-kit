const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'database.sqlite');

// Ensure database directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT DEFAULT 'user' CHECK(role IN ('admin', 'user')),
          avatar TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Programs table
      db.run(`
        CREATE TABLE IF NOT EXISTS programs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          duration TEXT NOT NULL,
          format TEXT NOT NULL,
          participants TEXT NOT NULL,
          features TEXT NOT NULL, -- JSON string
          next_cohort TEXT NOT NULL,
          featured BOOLEAN DEFAULT 0,
          image TEXT,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'draft')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Testimonials table
      db.run(`
        CREATE TABLE IF NOT EXISTS testimonials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          business TEXT NOT NULL,
          location TEXT NOT NULL,
          quote TEXT NOT NULL,
          achievement TEXT NOT NULL,
          program TEXT NOT NULL,
          image TEXT,
          featured BOOLEAN DEFAULT 0,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Events table
      db.run(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          date TEXT NOT NULL,
          location TEXT,
          type TEXT NOT NULL,
          capacity INTEGER,
          registered INTEGER DEFAULT 0,
          image TEXT,
          featured BOOLEAN DEFAULT 0,
          status TEXT DEFAULT 'upcoming' CHECK(status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Contact messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'unread' CHECK(status IN ('unread', 'read', 'replied')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Newsletter subscriptions table
      db.run(`
        CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          status TEXT DEFAULT 'active' CHECK(status IN ('active', 'unsubscribed')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Application submissions table
      db.run(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          program_id INTEGER,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          business_idea TEXT NOT NULL,
          experience TEXT,
          motivation TEXT NOT NULL,
          status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected', 'waitlist')),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (program_id) REFERENCES programs (id)
        )
      `);

      // Insert default admin user if not exists
      db.get("SELECT id FROM users WHERE email = 'admin@impactinitiativenepal.com'", (err, row) => {
        if (err) {
          console.error('Error checking for admin user:', err);
          return;
        }
        
        if (!row) {
          const bcrypt = require('bcryptjs');
          const hashedPassword = bcrypt.hashSync('admin123', 10);
          
          db.run(`
            INSERT INTO users (email, password, name, role)
            VALUES ('admin@impactinitiativenepal.com', ?, 'Admin User', 'admin')
          `, [hashedPassword], (err) => {
            if (err) {
              console.error('Error creating admin user:', err);
            } else {
              console.log('Default admin user created');
              console.log('Email: admin@impactinitiativenepal.com');
              console.log('Password: admin123');
            }
          });
        }
      });

      // Insert sample data
      insertSampleData();
    });

    db.on('error', (err) => {
      console.error('Database error:', err);
      reject(err);
    });

    // Wait a bit for all operations to complete
    setTimeout(() => {
      console.log('Database initialized successfully');
      resolve();
    }, 1000);
  });
};

const insertSampleData = () => {
  // Sample programs
  const samplePrograms = [
    {
      title: "Academy for Women Entrepreneurs (AWE)",
      description: "Our flagship program providing comprehensive business training, mentorship, and networking opportunities for women entrepreneurs across Nepal.",
      duration: "12 Weeks",
      format: "Hybrid - Online & In-Person",
      participants: "25-30 per cohort",
      features: JSON.stringify([
        "Business plan development",
        "Financial literacy & funding access",
        "Digital marketing & e-commerce",
        "Leadership & negotiation skills",
        "Peer networking & mentorship",
        "Graduation ceremony & certification"
      ]),
      next_cohort: "March 2024",
      featured: 1
    },
    {
      title: "Digital Skills Bootcamp",
      description: "Intensive training in digital literacy, social media marketing, and e-commerce platforms to help businesses reach online markets.",
      duration: "6 Weeks",
      format: "Online",
      participants: "40-50 per session",
      features: JSON.stringify([
        "Social media marketing",
        "E-commerce platform setup",
        "Digital payment systems",
        "Online customer service",
        "Website basics",
        "Digital security"
      ]),
      next_cohort: "February 2024",
      featured: 0
    }
  ];

  samplePrograms.forEach(program => {
    db.run(`
      INSERT OR IGNORE INTO programs (title, description, duration, format, participants, features, next_cohort, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [program.title, program.description, program.duration, program.format, program.participants, program.features, program.next_cohort, program.featured]);
  });

  // Sample testimonials
  const sampleTestimonials = [
    {
      name: "Sita Gurung",
      business: "Himalayan Handicrafts",
      location: "Kathmandu",
      quote: "The AWE program transformed my small craft business into a thriving enterprise. I learned everything from digital marketing to financial planning. Now I employ 8 women and export to 3 countries.",
      achievement: "300% Revenue Growth",
      program: "AWE Bootcamp 2023",
      featured: 1
    },
    {
      name: "Maya Thapa",
      business: "Green Valley Organic Farm",
      location: "Chitwan",
      quote: "IIN helped me transition from traditional farming to organic produce with direct market access. The mentorship and training gave me confidence to negotiate with buyers and expand my operations.",
      achievement: "50% Profit Increase",
      program: "Rural Entrepreneur Network",
      featured: 1
    }
  ];

  sampleTestimonials.forEach(testimonial => {
    db.run(`
      INSERT OR IGNORE INTO testimonials (name, business, location, quote, achievement, program, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [testimonial.name, testimonial.business, testimonial.location, testimonial.quote, testimonial.achievement, testimonial.program, testimonial.featured]);
  });

  // Sample events
  const sampleEvents = [
    {
      title: "Academy for Women Entrepreneurs (AWE) Bootcamp",
      description: "A comprehensive program designed to help women entrepreneurs scale their businesses. In Nepal, women-owned businesses contribute extensively to the economy, but face major challenges including limited access to financing and managerial skills.",
      date: "2024-03-15",
      location: "Kathmandu, Nepal",
      type: "Training Program",
      capacity: 30,
      featured: 1
    },
    {
      title: "Digital Marketing Workshop",
      description: "Learn essential digital marketing skills to grow your business online. This workshop covers social media marketing, content creation, and online advertising strategies.",
      date: "2024-02-20",
      location: "Online",
      type: "Workshop",
      capacity: 50,
      featured: 0
    }
  ];

  sampleEvents.forEach(event => {
    db.run(`
      INSERT OR IGNORE INTO events (title, description, date, location, type, capacity, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [event.title, event.description, event.date, event.location, event.type, event.capacity, event.featured]);
  });
};

const getDatabase = () => db;

module.exports = {
  initializeDatabase,
  getDatabase
};
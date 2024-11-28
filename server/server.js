const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const db = mysql.createConnection({
  host: 'Panda',
  user: 'Panda',
  password: 'panda',
  database: 'alumni_db',
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

// API to get all alumni
app.get('/api/alumni', (req, res) => {
  db.query('SELECT * FROM alumni', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post('/api/login', passport.authenticate('userLocal', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, jwtOptions.secretOrKey);
  res.json({ token });
});

// Passport configuration
passport.use(
  'userLocal',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM admin WHERE Admin_id = ? OR Inst_id = ?', [email, email], (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const user = results[0];
      if (!user.password) {
        console.log('User has no password:', user);
        return done(null, false, { message: 'Incorrect email or password' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);
        
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect email or password' });
        }
      });
    });
  })
);


passport.use(
  'alumniLocal',
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    db.query('SELECT * FROM user WHERE user_id = ? OR email = ?', [email, email], (err, results) => {
      if (err) return done(err);

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect email or password' });
      }

      const user = results[0];

      if (!user.password) {
        console.log('User has no password:', user);
        return done(null, false, { message: 'Incorrect email or password' });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return done(err);

        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Incorrect email or password' });
        }
      });
    });
  })
);
const jwtOptions = {
  secretOrKey:'panda2347',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
// ... (existing code)


// API to Alumni login
app.post('/api/alumnilogin', passport.authenticate('alumniLocal', { session: false }), (req, res) => {
  const token = jwt.sign({ id: req.user.id }, jwtOptions.secretOrKey);
  res.json({ token });
});

// API to register a new user
app.post('/api/register', (req, res) => {
  const { username, name, email, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const insertQuery = `INSERT INTO user (user_id, name, email ,password) VALUES (?, ?, ?, ?)`;
    db.query(insertQuery, [username, name, email, hash], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred during registration', error: err });
      } else {
        console.log('You have successfully registered');
        res.json({ message: 'You have successfully registered' });
      }
    })
})});

// API to register a new admin
app.post('/api/adminregister', (req, res) => {
  const { username, name, instid, phnum, email, notify, password } = req.body;

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;

    const insertQuery = 'INSERT INTO admin (Admin_id, name, Inst_id, Email, verifier, notifications, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(insertQuery, [username, name, instid, phnum, email, notify, hash], (err) => {
      if (err) {
        res.status(500).json({ message: 'An error occurred during registration' });
      } else {
        console.log('You have successfully registered');
        res.json({ message: 'You have successfully registered' });
      }
    });
  });
});


// API to store alumni details
app.post('/submitForm', (req, res) => {
  const {
    first_name,
    last_name,
    dob,
    mother,
    father,
    phone,
    instid,
    address,
    usn,
    grad,
    tc,
    mode,
    admd,
    Course,
  } = req.body;

  const user_id = 'm_panda_f';
  const verification_status = 'pending';

  const sql = `
    INSERT INTO ALUMNI (user_id, Name, dob, mothername, fathername, phone, Inst_id, address, USN, graduation_date,  TC_received, course, admission_mode, admission_date, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    user_id,
    first_name + ' ' + last_name,
    dob,
    mother,
    father,
    phone,
    instid,
    address,
    usn,
    grad,
    tc,
    Course,
    mode,
    admd,
    verification_status
  ], (err, result) => {
    if (err) {
      console.error('Error executing query: ' + err.stack);
      res.status(500).send(`Internal Server Error: ${err.message}`);
      return;
    }

    console.log('Record inserted successfully');
    res.status(200).json({ message: 'Record inserted successfully' });
  });
});


app.get('/api/admin', (req, res) => {
  // Use the pool to execute a query
  db.query(`SELECT * FROM admin`, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});

app.delete('/api/alumni/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM user WHERE user_id = ?';

  db.query(query, id, (error, results) => {
    if (error) {
      res.status(500).send({ message: 'An error occurred while trying to delete the alumni record.' });
    } else if (results.affectedRows === 0) {
      res.status(404).send({ message: 'Alumni not found.' });
    } else {
      res.status(200).send({ message: 'Alumni deleted successfully.' });
    }
  });
});

//verifu alumni
app.post('/verify-alumni/:id', (req, res) => {
  const alumniId = req.params.id; // Fixed here

  // Execute the SQL query to update verification_status
  db.query('UPDATE alumni SET verification_status = ? WHERE user_id = ?', ['verified', alumniId], (error, results) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      res.status(200).json({ message: 'Alumni verified successfully' });
    }
  });
});
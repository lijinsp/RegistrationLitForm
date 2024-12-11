const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.urlencoded({ extended: true })); // To handle form data
app.use(bodyParser.json()); // For JSON payloads

// PostgreSQL connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'demopost',
  password: 'Team@123',
  port: 5432,
});

// Route to handle form submission
app.post('/register', (req, res) => {
  const { fullname, email, password, dob, gender, languages, qualification, college } = req.body;

  const languagesArray = Array.isArray(languages) ? languages : [languages];

  pool.query(
    'INSERT INTO users (fullname, email, password, dob, gender, languages, qualification, college) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [
      fullname,
      email,
      password,
      dob,
      gender,
      languagesArray,
      qualification,
      college,
    ],
    (err, result) => {
      if (err) {
        console.error('Error saving user data:', err);
        return res.status(500).send('Error saving user data');
      }
      res.status(200).send('User registered successfully');
    }
  );
});

// Route to fetch users
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching users');
    }
    res.json(result.rows); // Send the user data as JSON
  });
});

app.get('/users1/:id', (req, res) => {
const id = req.params.id;
const fetch_query = 'SELECT * FROM users where id=$1';
  pool.query(fetch_query,[id], (err, result) => {
    if (err) {
      return res.status(500).send('Error fetching users');
    }
   // console.log(result.rows)
    res.json(result.rows[0]); // Send the user data as JSON
  });
});

// Route to edit a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { fullname, email, password, dob, gender, languages, qualification, college } = req.body;

  const languagesArray = Array.isArray(languages) ? languages : [languages];

  pool.query(
    'UPDATE users SET fullname = $1, email = $2, password = $3, gender = $5, languages = $6, qualification = $7, college = $8, dob = $4 WHERE id = $9',
    [
      fullname,
      email,
      password,
      dob,
      gender,
      languagesArray,
      qualification,
      college,
      id,
    ],
    (err, result) => {
      if (err) {
        console.error('Error updating user data:', err);
        return res.status(500).send('Error updating user data');
      }
      res.status(200).send('User updated successfully');
    }
  );
});

// Route to delete a user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  pool.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send('Error deleting user');
    }
    res.status(200).send('User deleted successfully');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

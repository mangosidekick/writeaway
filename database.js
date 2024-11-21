database.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Vincent17',
  database: process.env.DB_NAME || 'writeaway_schema',
});

connection.connect((err) => {
  if (err) {
<<<<<<< HEAD
    console.error('Error connecting to the MySQL:', err.message);
=======
    console.error("error connecting to the MySQL:", err.message);
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c
    return;
  }
  console.log('Connected to the MySQL Server.');
});

// Create database if it doesn't exist (optional)
connection.query('CREATE DATABASE IF NOT EXISTS writeaway_schema;', (err) => {
  if (err) {
<<<<<<< HEAD
    console.error('Error creating database:', err.message);
=======
    console.error("error creating database", err.message);
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c
  } else {
    console.log('Database created or already exists');

    // Switch to the newly created database
    connection.changeUser({ database: 'writeaway_schema' }, (err) => {
      if (err) {
<<<<<<< HEAD
        console.error('Error switching database:', err.message);
=======
        console.error("error switching database", err.message);
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c
        return;
      }

      console.log('Switched to writeaway_schema database.');

      // Create user table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS signup_table (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE,
          password VARCHAR(255) NOT NULL,
          bio TEXT,
          INDEX (email)
        );
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
<<<<<<< HEAD
          console.error('Error creating table:', err.message);
=======
          console.error("error creating table", err.message);
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c
        } else {
          console.log('Signup table created or already exists');
        }
      });

      // Create notebooks table if it doesn't exist
      const createNotebooksTableQuery = `
        CREATE TABLE IF NOT EXISTS notebooks (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          cover_color VARCHAR(7) NOT NULL,
          email VARCHAR(255),
          content TEXT,
          background_color VARCHAR(7),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX (email)
        );
      `;

      connection.query(createNotebooksTableQuery, (err) => {
        if (err) {
          console.error('Error creating notebooks table:', err.message);
        } else {
          console.log('Notebooks table created or already exists');
        }
      });
    });
  }
});

// Save progress endpoint
app.post('/saveProgress', (req, res) => {
  const { notebookId, content, backgroundColor } = req.body;
  const sql = 'UPDATE notebooks SET content = ?, background_color = ? WHERE id = ?';
  connection.query(sql, [content, backgroundColor, notebookId], (err, results) => {
    if (err) {
      console.error('Error saving journal entry:', err);
      return res.status(500).send('Error saving journal entry');
    }
    res.send('Journal entry saved successfully');
  });
});

// Function to find user by email
function findUserByEmail(email, callback) {
  const query = 'SELECT * FROM signup_table WHERE email = ?';
  connection.query(query, [email], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0]);
  });
}

// Export the connection and function
module.exports = {
  connection,
  findUserByEmail
};

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
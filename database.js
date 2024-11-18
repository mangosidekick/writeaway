const mysql = require("mysql2");

// Create Connection to MySQL server
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mang03sRbest",
  database: "writeaway_schema",
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the MySQL:", err.message);
    return;
  }
  console.log("Connected to the MySQL Server.");
});

// Create database if it doesn't exist (optional)
connection.query("CREATE DATABASE IF NOT EXISTS signup_table;", (err) => {
  if (err) {
    console.error("Error creating database", err.message);
  } else {
    console.log("Database created or already exists");

    // Switch to the newly created database
    connection.changeUser({database: 'writeaway_schema'}, (err) => {
      if (err) {
        console.error("Error switching database", err.message);
        return;
      }

      console.log("Switched to signup_table database.");

      // Create user table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS signup_table (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstname VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          bio TEXT
        );
      `;

      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error("Error creating table", err.message);
        } else {
          console.log("Signup table created or already exists");
        }
      });
    });
  }
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
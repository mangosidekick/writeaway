const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connection, findUserByEmail } = require('./database');
const app = express();
const port = 3000;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'signup' and 'assets' directories
app.use(express.static(path.join(__dirname, 'signup')));
app.use('/assets', express.static(path.join(__dirname, 'signup', 'assets')));

// Serve the signup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup', 'signup.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { firstname, email, password, repeatPassword } = req.body;

    // Basic validation
    if (password !== repeatPassword) {
        return res.status(400).send('Passwords do not match');
    }

    // Check if user already exists
    findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('Error finding user:', err.message);
            return res.status(500).send('Internal server error');
        }

        if (user) {
            return res.status(400).send('User already exists');
        }

        // Add user to database
        const newUser = { firstname, email, password };
        const insertQuery = 'INSERT INTO signup_table (firstname, email, password) VALUES (?, ?, ?)';
        connection.query(insertQuery, [newUser.firstname, newUser.email, newUser.password], (err, results) => {
            if (err) {
                console.error('Error inserting writer:', err.message);
                return res.status(500).send('Internal server error');
            }
            res.send(`User added: ${newUser.firstname}`);
        });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
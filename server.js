const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connection, findUserByEmail } = require('./db');
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

    console.log('Form Data:', req.body); // Log the form data

    // Basic validation
    if (!firstname || !email || !password || password !== repeatPassword) {
        console.log('Validation failed'); // Log validation failure
        return res.status(400).json({ success: false, message: 'Validation failed' });
    }

    // Check if user already exists
    findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('Error finding user:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (user) {
            console.log('User already exists'); // Log existing user
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Add user to database
        const newUser = { firstname, email, password };
        const insertQuery = 'INSERT INTO writers (firstname, email, password) VALUES (?, ?, ?)';
        connection.query(insertQuery, [newUser.firstname, newUser.email, newUser.password], (err, results) => {
            if (err) {
                console.error('Error inserting writer:', err.message);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
            console.log('User registered successfully'); // Log successful registration
            res.json({ success: true, message: 'User registered successfully' });
        });
    });
});

//login handle
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('Error finding user:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, message: 'Wrong email or password' });
        }

        res.json({ success: true, message: 'Login successful' });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
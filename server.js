const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { connection, findUserByEmail } = require('./database');
const app = express();
const port = 3000;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'index' and 'assets' directories
app.use(express.static(path.join(__dirname, 'signup')));
app.use('/assets', express.static(path.join(__dirname, 'signup', 'assets')));

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup', 'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
    const { firstname, email, password, repeatPassword } = req.body;

    console.log('Form Data:', req.body); // Log the form data

    // Basic validation
    if (!firstname || !email || !password || password !== repeatPassword) {
        console.log('Validation failed'); // Log validation failure
        return res.status(400).json({ success: false, message: 'validation failed' });
    }

    // Check if user already exists
    findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('error finding user:', err.message);
            return res.status(500).json({ success: false, message: 'internal server error' });
        }

        if (user) {
            console.log('User already exists'); // Log existing user
            return res.status(400).json({ success: false, message: 'user already exists' });
        }

        // Add user to database
        const newUser = { firstname, email, password };
        const insertQuery = 'INSERT INTO index_table (firstname, email, password) VALUES (?, ?, ?)';
        connection.query(insertQuery, [newUser.firstname, newUser.email, newUser.password], (err, results) => {
            if (err) {
                console.error('error inserting user:', err.message);
                return res.status(500).json({ success: false, message: 'internal server error' });
            }
            console.log('user registered successfully'); // Log successful registration
            res.json({ success: true, message: 'user registered successfully' });
        });
    });
});

//login handle
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, (err, user) => {
        if (err) {
            console.error('error finding user:', err.message);
            return res.status(500).json({ success: false, message: 'internal server error' });
        }

        if (!user || user.password !== password) {
            return res.status(400).json({ success: false, message: 'wrong email or password' });
        }

        res.json({ success: true, message: 'login successful' });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
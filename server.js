const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'signup' directory
app.use(express.static(path.join(__dirname, 'signup')));

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
    if (findUserByEmail(email)) {
        return res.status(400).send('User already exists');
    }

    // Add user to database
    const newUser = { firstname, email, password };
    addUser(newUser);

    res.send(`User added: ${firstname}`);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const { connection, findUserByEmail } = require('./database');
const app = express();
const port = 3001;

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true in production
}));

// Use body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'signup' and 'assets' directories
app.use(express.static(path.join(__dirname, 'signup')));
app.use('/assets', express.static(path.join(__dirname, 'signup', 'assets')));

// Serve the signup page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup', 'index.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
    const { firstname, email, password, repeatPassword } = req.body;

    console.log('Form Data:', req.body); // Log the form data

    // Basic validation
    if (!firstname || !email || !password || password !== repeatPassword) {
        console.log('Validation failed'); // Log validation failure
        return res.status(400).json({ success: false, message: 'Validation failed' });
    }

    // Check if user already exists
    findUserByEmail(email, async (err, user) => {
        if (err) {
            console.error('Error finding user:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (user) {
            console.log('User already exists'); // Log existing user
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Add user to database
            const newUser = { firstname, email, password: hashedPassword };
            const insertQuery = 'INSERT INTO signup_table (firstname, email, password) VALUES (?, ?, ?)';
            connection.query(insertQuery, [newUser.firstname, newUser.email, newUser.password], (err, results) => {
                if (err) {
                    console.error('Error inserting user:', err.message);
                    return res.status(500).json({ success: false, message: 'Internal server error' });
                }
                console.log('User registered successfully'); // Log successful registration
                res.json({ success: true, message: 'User registered successfully' });
            });
        } catch (hashErr) {
            console.error('Error hashing password:', hashErr.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

// Handle login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    findUserByEmail(email, async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ success: false, message: 'Wrong email or password' });
        }

        // Clear existing session data
        req.session.regenerate((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            // Store user's email in session
            req.session.user = { email: user.email };
            res.json({ success: true, message: 'Login successful' });
        });
    });
});

// Handle notebook creation
app.post('/createNotebook', (req, res) => {
    const { title, coverColor } = req.body;
    const userEmail = req.session.user.email;

    if (!title || !coverColor) {
        return res.status(400).json({ success: false, message: 'Title and cover color are required' });
    }

    const checkTitleQuery = 'SELECT * FROM notebooks WHERE email = ? AND title = ?';
    connection.query(checkTitleQuery, [userEmail, title], (err, results) => {
        if (err) {
            console.error('Error checking for duplicate title:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length > 0) {
            return res.status(400).json({ success: false, message: 'Title already exists. Please choose a different title.' });
        }

        const insertQuery = 'INSERT INTO notebooks (title, cover_color, email) VALUES (?, ?, ?)';
        connection.query(insertQuery, [title, coverColor, userEmail], (err, results) => {
            if (err) {
                console.error('Error inserting notebook:', err.message);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }

            const createdAt = new Date().toISOString();
            res.json({ success: true, message: 'Notebook created successfully', notebookId: results.insertId, createdAt: createdAt, email: userEmail });
        });
    });
});

// Fetch notebooks for the logged-in user
app.get('/notebooks', (req, res) => {
    const userEmail = req.session.user?.email; // Get the user's email from the session

    if (!userEmail) {
        return res.status(400).json({ success: false, message: 'User not logged in' });
    }

    const fetchQuery = 'SELECT * FROM notebooks WHERE email = ?';
    connection.query(fetchQuery, [userEmail], (err, results) => {
        if (err) {
            console.error('Error fetching notebooks:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
        res.json({ success: true, notebooks: results });
    });
});

// Handle fetching notebook content
app.get('/getNotebookContent', (req, res) => {
    const notebookId = req.query.notebookId;

    if (!notebookId) {
        return res.status(400).json({ success: false, message: 'Notebook ID is required' });
    }

    const fetchQuery = 'SELECT * FROM notebooks WHERE id = ?';
    connection.query(fetchQuery, [notebookId], (err, results) => {
        if (err) {
            console.error('Error fetching notebook content:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        console.log('Fetched notebook content:', results[0]); // Debug log
        res.json({ success: true, notebook: results[0] });
    });
});

// Handle saving notebook progress
app.post('/saveProgress', (req, res) => {
    const { notebookId, content, backgroundColor } = req.body;
    const userEmail = req.session.user.email;

    if (!notebookId || !userEmail) {
        return res.status(400).json({ success: false, message: 'Notebook ID and user email are required' });
    }

    const updateQuery = 'UPDATE notebooks SET content = ?, background_color = ? WHERE id = ? AND email = ?';
    connection.query(updateQuery, [content, backgroundColor, notebookId, userEmail], (err, results) => {
        if (err) {
            console.error('Error saving notebook content:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        res.json({ success: true, message: 'Progress saved successfully' });
    });
});

// Handle deleting a notebook
app.delete('/deleteNotebook', (req, res) => {
    const notebookId = req.query.notebookId;
    const userEmail = req.session.user.email;

    if (!notebookId || !userEmail) {
        return res.status(400).json({ success: false, message: 'Notebook ID and user email are required' });
    }

    const deleteQuery = 'DELETE FROM notebooks WHERE id = ? AND email = ?';
    connection.query(deleteQuery, [notebookId, userEmail], (err, results) => {
        if (err) {
            console.error('Error deleting notebook:', err.message);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Notebook not found' });
        }

        res.json({ success: true, message: 'Notebook deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

const registerEyeBtn = document.querySelector(".password-icon");
const registerInputField = document.querySelector(".password");

const registerEyeBtn2 = document.querySelector(".forget-password-icon");
const registerInputField2 = document.querySelector(".repeat-password");

<<<<<<< HEAD
// Log the elements to ensure they are being selected correctly
console.log('registerEyeBtn:', registerEyeBtn);
console.log('registerInputField:', registerInputField);
console.log('registerEyeBtn2:', registerEyeBtn2);
console.log('registerInputField2:', registerInputField2);

if (registerEyeBtn && registerInputField) {
    registerEyeBtn.addEventListener("click", () => {
        if (registerInputField.type === "password") {
            registerInputField.type = "text";
            registerEyeBtn.classList.replace("fa-eye", "fa-eye-slash");
            console.log(registerEyeBtn);
        } else {
            registerInputField.type = "password";
            registerEyeBtn.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
}
=======
// Serve static files from the 'index' and 'assets' directories
app.use(express.static(path.join(__dirname, 'signup')));
app.use('/assets', express.static(path.join(__dirname, 'signup', 'assets')));

// Serve the index page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup', 'index.html'));
});
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c

if (registerEyeBtn2 && registerInputField2) {
    registerEyeBtn2.addEventListener("click", () => {
        if (registerInputField2.type === "password") {
            registerInputField2.type = "text";
            registerEyeBtn2.classList.replace("fa-eye", "fa-eye-slash");
            console.log(registerEyeBtn2);
        } else {
            registerInputField2.type = "password";
            registerEyeBtn2.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
}

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

<<<<<<< HEAD
    const formData = new FormData(this);

    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
    }

    if (validateForm(formData)) {
        fetch('/submit', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)), // Convert formData to JSON string
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const firstname = formData.get('firstname'); // Get the user's first name
                window.location.href = `/confirm.html?name=${encodeURIComponent(firstname)}`;
            } else {
                document.getElementById('error-message').textContent = data.message;
            }                        
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('error-message').textContent = 'An error occurred. Please try again.';
=======
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
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c
        });
    } else {
        document.getElementById('error-message').textContent = 'Please fill out all required fields correctly.';
    }
});

<<<<<<< HEAD
function validateForm(formData) {
    // Implement your form validation logic here
    return true; // Return true if validation passes
}
=======
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
>>>>>>> b77f0d3e34323805ac01b8d703ee887cb24f5a2c

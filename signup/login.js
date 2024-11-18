const registerEyeBtn = document.querySelector(".password-icon");
const registerInputField = document.querySelector(".password");

// Toggle password visibility
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

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    const email = document.getElementById('email-input').value;
    const password = document.getElementById('password-input').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/home/home.html'; // Redirect to home page
        } else {
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.color = 'red';
            errorMessage.textContent = 'Wrong email or password';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.style.color = 'red';
        errorMessage.textContent = 'An error occurred. Please try again.';
    });
});
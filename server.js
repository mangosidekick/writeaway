const registerEyeBtn = document.querySelector(".password-icon");
const registerInputField = document.querySelector(".password");

const registerEyeBtn2 = document.querySelector(".forget-password-icon");
const registerInputField2 = document.querySelector(".repeat-password");

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

    const formData = new FormData(this);

    // Log form data for debugging
    for (let [key, value] of formData.entries()) {
        console.log($`{key}: ${value}`);
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
        });
    } else {
        document.getElementById('error-message').textContent = 'Please fill out all required fields correctly.';
    }
});

function validateForm(formData) {
    // Implement your form validation logic here
    return true; // Return true if validation passes
}
const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const eyeBtn = document.querySelector(".fa-eye");
const inputField = document.querySelector(".password-field");

eyeBtn.addEventListener("click", () => {
    if (inputField.type === "password"){
        inputField.type = "text";
        eyeBtn.classList.replace("fa-eye", "fa-eye-slash");
        console.log(eyeBtn);
    }else{
        inputField.type = "password";
        eyeBtn.classList.replace("fa-eye-slash", "fa-eye");
    }
});




loginBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "#9ead79";
    registerBtn.style.backgroundColor = "rgba(0, 0, 0, 0)";

    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;
})

registerBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "rgba(0, 0, 0, 0)";
    registerBtn.style.backgroundColor = "#9ead79"; 

    loginForm.style.left = "150%";
    registerForm.style.left = "50%";

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;
    
})
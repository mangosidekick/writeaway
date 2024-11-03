const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

const loginEyeBtn = document.querySelector(".login-icon");
const loginInputField = document.querySelector(".login-password-field");

const registerEyeBtn = document.querySelector(".register-icon");
const registerInputField = document.querySelector(".register-password-field");

//login password visibility
loginEyeBtn.addEventListener("click", () => {
    if (loginInputField.type === "password"){
        loginInputField.type = "text";
        loginEyeBtn.classList.replace("fa-eye", "fa-eye-slash");
        console.log(loginEyeBtn);
    }else{
        loginInputField.type = "password";
        loginEyeBtn.classList.replace("fa-eye-slash", "fa-eye");
    }
});

//register password visibility
registerEyeBtn.addEventListener("click", () => {
    if (registerInputField.type === "password"){
        registerInputField.type = "text";
        registerEyeBtn.classList.replace("fa-eye", "fa-eye-slash");
        console.log(registerEyeBtn);
    }else{
        registerInputField.type = "password";
        registerEyeBtn.classList.replace("fa-eye-slash", "fa-eye");
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
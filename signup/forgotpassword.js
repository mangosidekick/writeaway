const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");

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
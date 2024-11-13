const loginEyeBtn = document.querySelector(".login-icon");
const loginInputField = document.querySelector(".login-password-field");


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
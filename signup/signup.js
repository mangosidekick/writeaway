const registerEyeBtn = document.querySelector(".register-icon");
const registerInputField = document.querySelector(".register-password-field");

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
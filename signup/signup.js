const registerEyeBtn = document.querySelector(".password-icon");
const registerInputField = document.querySelector(".password");

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
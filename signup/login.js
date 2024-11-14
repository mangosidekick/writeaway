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

const registerEyeBtn2 = document.querySelector(".forget-password-icon");
const registerInputField2 = document.querySelector(".repeat-password");

//register repeat password visibility
registerEyeBtn2.addEventListener("click", () => {
    if (registerInputField2.type === "password"){
        registerInputField2.type = "text";
        registerEyeBtn2.classList.replace("fa-eye", "fa-eye-slash");
        console.log(registerEyeBtn2);
    }else{
        registerInputField2.type = "password";
        registerEyeBtn2.classList.replace("fa-eye-slash", "fa-eye");
    }
});
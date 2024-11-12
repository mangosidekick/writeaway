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
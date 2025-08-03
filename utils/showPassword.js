export function showPasswordSignup() {
  const eye = signupForm.querySelector(".fa-eye");
  const eyeBlock = signupForm.querySelector(".fa-eye-slash");
  const password = document.querySelector("#signupPassword");

  eye.addEventListener("click", () => {
    password.type = "text";

    eye.style.display = "none";
    eyeBlock.style.display = "block";

    password.focus();
  });

  eyeBlock.addEventListener("click", () => {
    password.type = "password";

    eye.style.display = "block";
    eyeBlock.style.display = "none";

    password.focus();
  });
}

export function showPasswordLogin() {
  const eye = loginForm.querySelector(".fa-eye");
  const eyeBlock = loginForm.querySelector(".fa-eye-slash");
  const password = document.querySelector("#loginPassword");

  eye.addEventListener("click", () => {
    password.type = "text";

    eye.style.display = "none";
    eyeBlock.style.display = "block";

    password.focus();
  });

  eyeBlock.addEventListener("click", () => {
    password.type = "password";

    eye.style.display = "block";
    eyeBlock.style.display = "none";

    password.focus();
  });
}
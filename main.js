import httpRequest from "./utils/httpRequest.js";
import * as exportMain from "./export-main.js";

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const signupBtn = document.querySelector(".signup-btn");
  const loginBtn = document.querySelector(".login-btn");
  const authModal = document.getElementById("authModal");
  const modalClose = document.getElementById("modalClose");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");
  
  exportMain.search();

  // Function to show signup form
  function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
    
    exportMain.showPasswordSignup();
  }

  // Function to show login form
  function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";

    exportMain.showPasswordLogin();
  }

  // Function to open modal
  function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  // Open modal with Sign Up form when clicking Sign Up button
  signupBtn.addEventListener("click", function () {
    showSignupForm();
    openModal();
  });

  // Open modal with Login form when clicking Login button
  loginBtn.addEventListener("click", function () {
    showLoginForm();
    openModal();
  });

  // Close modal function
  function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
  }

  // Close modal when clicking close button
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking overlay (outside modal container)
  authModal.addEventListener("click", function (e) {
    if (e.target === authModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && authModal.classList.contains("show")) {
      closeModal();
    }
  });

  // Switch to Login form
  showLoginBtn.addEventListener("click", function () {
    showLoginForm();
  });

  // Switch to Signup form
  showSignupBtn.addEventListener("click", function () {
    showSignupForm();
  });

  // Register
  signupForm
    .querySelector(".auth-form-content")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#signupEmail").value;
      const password = document.querySelector("#signupPassword").value;
      const username = document.querySelector("#signupUsername").value;

      const credentials = {
        email,
        password,
        username,
      };
      try {

        const { user, access_token } = await httpRequest.post(
          "auth/register",
          credentials
        );

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("currentUser", user);

        updateCurrentUser(user);

      } catch (error) {
        // console.dir(error);
        const formGroup = document.querySelectorAll(".form-group");
        // console.log(formGroup);

        if (error?.response?.error?.code === "USERNAME_EXISTS") {

          formGroup[2].classList.add("invalid");
          console.log(formGroup[2]);

          formGroup[2]
            .querySelector(".error-message")
            .querySelector("span").textContent = error.response.error.message;

        } else if (error?.response?.error?.code === "EMAIL_EXISTS") {

          formGroup[0].classList.add("invalid");
          formGroup[0]
            .querySelector(".error-message")
            .querySelector("span").textContent = error.response.error.message;

        } else if (error?.response?.error?.code === "VALIDATION_ERROR") {

          formGroup[1].classList.add("invalid");
          formGroup[1]
            .querySelector(".error-message")
            .querySelector("span").textContent =
            error.response.error.details[0].message;

        }
      };
    });

  // Login
  loginForm
    .querySelector(".auth-form-content")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.querySelector("#loginEmail").value;
      const password = document.querySelector("#loginPassword").value;
      // console.log(email, password);

      const info = {
        email,
        password,
      };

      try {

        const { user, access_token } = await httpRequest.post(
          "auth/login",
          info
        );

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("currentUser", user);

        updateCurrentUser(user);

      } catch (error) {
        console.log(error);
      };
    });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  // Toggle dropdown when clicking avatar
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && userDropdown.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  // Handle logout button click
  logoutBtn.addEventListener("click", async () => {
    // Close dropdown first
    userDropdown.classList.remove("show");
    try {

      const result = await httpRequest.post("auth/logout");
      // console.log(result);
      
      localStorage.clear();

      const inputForms = document.querySelectorAll(".form-input");
      inputForms.forEach((inputForm) => {
        inputForm.value = "";
      });

      logoutCurrentUser();
      
    } catch (error) {
      console.log(error);
    };
  });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async () => {
  // TODO: Implement other functionality here

  try {

    const { user } = await httpRequest.get("users/me");

    updateCurrentUser(user);

  } catch (error) {
    // console.log(error);
  };
});

function updateCurrentUser(user) {

  const authButtons = document.querySelector(".auth-buttons");
  authButtons.style.display = "none";

  const userMenu = document.querySelector(".user-menu");
  userMenu.style.display = "flex";

  const userAvatarImg = userMenu.querySelector("img");
  if (user.avatar_url) {
    userAvatarImg.src = user.avatar_url;
  };

  const userName = userMenu.querySelector(".user-name");
  userName.textContent = user.username;

  authModal.classList.remove("show");

};

function logoutCurrentUser() {

  const authButtons = document.querySelector(".auth-buttons");
  authButtons.style.display = "flex";

  const userMenu = document.querySelector(".user-menu");
  userMenu.style.display = "none";

};



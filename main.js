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
  const spotifyIcon = document.querySelector(".fa-spotify");
  const homeIcon = document.querySelector(".fa-home");

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

  // Back To Home
  document.addEventListener("click", (e) => {
    if (e.target === spotifyIcon || e.target === homeIcon) {
      window.location.href = "/";
    }

    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
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
      console.log(123);
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
      }
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
        const { user, access_token, refresh_token } = await httpRequest.post(
          "auth/login",
          info
        );

        localStorage.setItem("accessToken", access_token);
        localStorage.setItem("currentUser", user);
        localStorage.setItem("refreshToken", refresh_token);

        updateCurrentUser(user);
      } catch (error) {
        console.log(error);
      }
    });

  // ======== Logout ========
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  // Toggle dropdown when clicking avatar
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
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
    }
  });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", async () => {
  renderHome();
  // ============================= Sidebar ================================================
  const sideBar = document.querySelector(".sidebar");
  const searchSidebar = document.querySelector(".search-library");
  const searchBtn = document.querySelector(".search-library-btn");
  const searchInput = document.querySelector(".search-sidebar-input");
  const recentBtn = document.querySelector(".sort-btn");
  const recentMenu = document.querySelector(".recent-menu");
  const libraryContent = document.querySelector(".library-content");

  document.addEventListener("click", function (e) {
    if (!recentBtn.contains(e.target) && !recentMenu.contains(e.target)) {
      recentMenu.classList.remove("show");
    }

    if (!searchBtn.contains(e.target) && !searchInput.contains(e.target)) {
      searchInput.hidden = true;
      searchInput.value = "";
      recentBtn.style.display = "flex";
    }
  });

  searchBtn.addEventListener("click", () => {
    searchInput.hidden = false;
    searchInput.focus();
    recentBtn.style.display = "none";
  });

  searchSidebar.addEventListener("click", (e) => {
    // e.preventDefault();
    if (e.target === recentBtn) {
      recentMenu.classList.add("show");
    }
  });

  // ========= Show Artists In Sidebar ============
  try {
    const { artists } = await httpRequest.get("artists?limit=3&offset=0");
    console.log(artists);

    const html = artists
      .map((item) => {
        return `
            <div class="library-item">
              <img
                src="${item.image_url}"
                alt="${item.name}"
                class="item-image"
              />
              <div class="item-info">
                <div class="item-title">${item.name}</div>
                <div class="item-subtitle">Artist</div>
              </div>
            </div>
    `;
      })
      .join("");

    libraryContent.innerHTML = html;
  } catch (error) {
    console.log(error);
  }

  // ============= List Artists Sidebar ==================
  const libraryItems = Array.from(
    libraryContent.querySelectorAll(".library-item")
  );
  console.log(libraryItems);

  // === Search Input Sidebar ====
  searchInput.addEventListener("input", () => {
    libraryContent.innerHTML = "";

    libraryItems.filter((item) => {
      // console.log(item.children[1].children[0].textContent);

      if (
        item.children[1].children[0].textContent
          .toLowerCase()
          .includes(searchInput.value.toLowerCase())
      ) {
        // console.log(item);
        libraryContent.append(item);
      }
    });

    // console.log(libraryItem);
  });

  // ============= Display Type ==================
  const recentMenuIcon = document.querySelector(".recent-menu-icon");
  const typeItem = recentMenuIcon.querySelector(".fa-list");
  const typeName = recentMenuIcon.querySelector(".fa-bars");
  const typeAlbum = recentMenuIcon.querySelector(".fa-table-cells");
  const typeAlbumBig = recentMenuIcon.querySelector(".fa-border-all");

  let activeElement = typeItem;

  // ==== Type Recent ====
  recentMenuIcon.addEventListener("click", (e) => {
    // ========== Change Icon RecentBtn ============
    const recentIcon = recentBtn.querySelector(".fa-solid");
    recentIcon.classList.remove(recentIcon.classList[1]);
    recentIcon.classList.add(e.target.classList[1]);

    libraryContent.innerHTML = "";

    // === Type Name ===
    if (e.target === typeName) {
      const htmlTypeName = libraryItems
        .map((item) => {
          return `
            <div class="library-item">
              <div class="item-info">
                <div class="item-title">${item.children[1].children[0].textContent}</div>
                <div class="item-subtitle">Artist</div>
              </div>
            </div>
    `;
        })
        .join("");

      libraryContent.innerHTML = htmlTypeName;

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // Type Item
    if (e.target === typeItem) {
      const htmlTypeItem = libraryItems
        .map((item) => {
          return `
            <div class="library-item">
              <img
                src="${item.children[0].currentSrc}"
                alt="${item.children[1].children[0].textContent}"
                class="item-image"
              />
              <div class="item-info">
                <div class="item-title">${item.children[1].children[0].textContent}</div>
                <div class="item-subtitle">Artist</div>
              </div>
            </div>
        `;
        })
        .join("");

      libraryContent.innerHTML = htmlTypeItem;

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // === Type Album ===
    if (e.target === typeAlbum) {
      libraryContent.innerHTML = "";
      const content = document.createElement("div");
      content.className = "content";

      const htmlAlbum = libraryItems
        .map((item) => {
          return `
            <div class="library-item album">
              <img
                src="${item.children[0].currentSrc}"
                alt="${item.children[1].children[0].textContent}"
                class="item-image album"
              />
            </div>
    `;
        })
        .join("");

      content.innerHTML = htmlAlbum;
      libraryContent.appendChild(content);

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // === Type Big Album ===
    if (e.target === typeAlbumBig) {
      libraryContent.innerHTML = "";
      const content = document.createElement("div");
      content.className = "content";

      const htmlAlbum = libraryItems
        .map((item) => {
          return `
            <div class="library-item album big">
              <img
                src="${item.children[0].currentSrc}"
                alt="${item.children[1].children[0].textContent}"
                class="item-image album big"
              />
            </div>
    `;
        })
        .join("");

      content.innerHTML = htmlAlbum;
      libraryContent.appendChild(content);

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }

      // sideBar.style.paddingRight = getScrollSideBar();
    }

    // ======== Fix Scrollbar ========
    if (sideBar.offsetWidth > sideBar.clientWidth) {
      sideBar.style.paddingRight = getScrollSideBar();
      if (sideBar.offsetWidth <= sideBar.clientWidth) {
        sideBar.style.paddingRight = null;
      }
    }
  });

  // ==== Library Content ====
  const trackSection = document.querySelector(".tracks-section");

  libraryItems.forEach((item) => {
    item.addEventListener("click", async () => {
      const { tracks } = await httpRequest.get("tracks?limit=20&offset=0");
      console.log(tracks);
      tracks.forEach((track) => {
        
        if (item.children[1].children[0].textContent === track.artist_name) {
          console.log(track);
        };
      });
      // trackSection.appendChild(html);
    });
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
  }
});

function updateCurrentUser(user) {
  const authButtons = document.querySelector(".auth-buttons");
  authButtons.style.display = "none";

  const userMenu = document.querySelector(".user-menu");
  userMenu.style.display = "flex";

  const userAvatarImg = userMenu.querySelector("img");
  if (user.avatar_url) {
    userAvatarImg.src = user.avatar_url;
  }

  const userName = userMenu.querySelector(".user-name");
  userName.textContent = user.username;

  authModal.classList.remove("show");
}

function logoutCurrentUser() {
  const authButtons = document.querySelector(".auth-buttons");
  authButtons.style.display = "flex";

  const userMenu = document.querySelector(".user-menu");
  userMenu.style.display = "none";
}

async function renderHome() {
  // ====== Body Top ======
  const hitsGrid = document.querySelector(".hits-grid");

  // Get Track API
  const { tracks } = await httpRequest.get("tracks?limit=6&offset=0");
  try {
    const htmlTracks = tracks
      .map((track) => {
        return `
              <div class="hit-card">
                <div class="hit-card-cover">
                  <img
                    src="${track.artist_image_url}"
                    alt="${track.title}"
                  />
                  <button class="hit-play-btn">
                    <i class="fas fa-play"></i>
                  </button>
                </div>
                <div class="hit-card-info">
                  <h3 class="hit-card-title">${track.title}</h3>
                  <p class="hit-card-artist">${track.artist_name}</p>
                </div>
              </div>
    `;
      })
      .join("");

    hitsGrid.innerHTML = htmlTracks;
  } catch (error) {
    console.log(error);
  }

  // ====== Body Center ======
  const artistsGrid = document.querySelector(".artists-grid");

  // Get Artists Popular
  try {
    const { artists } = await httpRequest.get("artists?limit=6&offset=0");
    const htmlArtists = artists
      .map((artist) => {
        return `
              <div class="artist-card">
                <div class="artist-card-cover">
                  <img
                    src="${artist.background_image_url}"
                    alt="${artist.name}"
                  />
                  <button class="artist-play-btn">
                    <i class="fas fa-play"></i>
                  </button>
                </div>
                <div class="artist-card-info">
                  <h3 class="artist-card-name">${artist.name}</h3>
                  <p class="artist-card-type">Artist</p>
                </div>
              </div>
    `;
      })
      .join("");

    artistsGrid.innerHTML = htmlArtists;
  } catch (error) {
    console.log(error);
  }
}

function getScrollSideBar() {
  const div = document.createElement("div");
  div.style.overflowY = "scroll";
  const child = document.createElement("div");
  div.appendChild(child);
  document.body.appendChild(div);
  const scrollbarWidth = div.offsetWidth - child.offsetWidth;
  document.body.removeChild(div);
  return scrollbarWidth + "px";
}

function getArtistId(e) {
  console.log(e.target.children[1].children[0].textContent);
}

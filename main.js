import httpRequest from "./utils/httpRequest.js";
import * as exportMain from "./export-main.js";
import updateUI from "./utils/updateUI.js";
console.log(updateUI);
updateUI.update()

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

  // Function to show login formF
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
      signup();
    });

  // Login
  loginForm
    .querySelector(".auth-form-content")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      login();
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
    logoutCurrentUser();
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

  libraryContent.addEventListener("click", async (e) => {
    // ======== Wrapper Content ========
    const trackSection = document.querySelector(".tracks-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");

    // ==== Event ====
    const artistItemTarget = e.target.closest(".library-item.artist-item");
    if (artistItemTarget) {
      const id = artistItemTarget.dataset.id;

      trackSection.innerHTML = "";
      hitsSection.hidden = true;
      artistsSection.hidden = true;

      const inner = document.createElement("div");
      inner.className = "inner-section";

      // Get Artists
      try {
        const artist = await httpRequest.get(`artists/${id}`);
        // console.log(artist);

        const html = `
              <section class="artist-hero">
                <div class="hero-background">
                  <img
                    src="${artist.background_image_url}"
                    alt="${artist.name}"
                    class="hero-image"
                  />
                  <div class="hero-overlay"></div>
                </div>
                <div class="hero-content">
                  <div class="verified-badge">
                    <i class="fas fa-check-circle"></i>
                    <span>Verified Artist</span>
                  </div>
                  <h1 class="artist-name">${artist.name}</h1>
                  <p class="monthly-listeners">${artist.monthly_listeners} monthly listeners</p>
                </div>
              </section>

              <section class="artist-controls">
                <button class="play-btn-large">
                  <i class="fas fa-play"></i>
                </button>
              </section>
            `;

        inner.innerHTML = html;
        trackSection.appendChild(inner);
      } catch (error) {
        console.log(error);
      }

      // Get Tracks
      try {
        const { tracks } = await httpRequest.get("tracks");
        // console.log(tracks);

        const popularSection = document.createElement("section");
        popularSection.className = "popular-section";
        const titleSection = document.createElement("h2");
        titleSection.className = "section-title";
        titleSection.textContent = "Popular";
        const trackList = document.createElement("div");
        trackList.className = "track-list";

        const html = tracks
          .map((track) => {
            if (id !== track.artist_id) return "";
            return `
            <div class="track-item" data-id="${track.id}">
                <div class="track-number">${track.track_number}</div>
                <div class="track-image">
                  <img
                    src="${track.artist_image_url}"
                    alt="${track.title}"
                  />
                </div>
                <div class="track-info">
                  <div class="track-name">${track.title}</div>
                </div>
                <div class="track-plays">${track.play_count}</div>
                <div class="track-duration">${track.duration}s</div>
                <button class="track-menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
          `;
          })
          .join("");
        // console.log(html);

        trackList.innerHTML = html;
        popularSection.appendChild(titleSection);
        popularSection.appendChild(trackList);
        trackSection.append(popularSection);
      } catch (error) {
        console.log(error);
      }
    }

    const playlistItemTarget = e.target.closest(".library-item.playlist-item");
    if (playlistItemTarget) {
      try {
        const trackOfPlaylist = await httpRequest.get("");
      } catch (error) {}
    }
  });

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
  // try {
  //   const { artists } = await httpRequest.get("artists?limit=3&offset=0");
  //   // console.log(artists);

  //   const html = artists
  //     .map((item) => {
  //       return `
  //           <div class="library-item" data-id="${item.id}">
  //             <img
  //               src="${item.image_url}"
  //               alt="${item.name}"
  //               class="item-image"
  //             />
  //             <div class="item-info">
  //               <div class="item-title">${item.name}</div>
  //               <div class="item-subtitle">Artist</div>
  //             </div>
  //           </div>
  //   `;
  //     })
  //     .join("");

  //   libraryContent.innerHTML = html;
  // } catch (error) {
  //   console.log(error);
  // }

  // ============= List Artists Sidebar ==================
  // const libraryItems = Array.from(
  //   document.querySelectorAll(".library-item")
  // );
  // console.log(libraryItems);

  // === Search Input Sidebar ====
  // searchInput.addEventListener("input", () => {
  //   libraryContent.innerHTML = "";

  //   libraryItems.filter((item) => {
  //     // console.log(item.children[1].children[0].textContent);

  //     if (
  //       item.children[1].children[0].textContent
  //         .toLowerCase()
  //         .includes(searchInput.value.toLowerCase())
  //     ) {
  //       // console.log(item);
  //       libraryContent.append(item);
  //     }
  //   });

  //   // console.log(libraryItem);
  // });

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

    // libraryContent.innerHTML = "";

    // === Type Name ===
    if (e.target === typeName) {
      libraryContent.setAttribute("data-type", "type-name");

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // ==== Type Item ====
    if (e.target === typeItem) {
      libraryContent.setAttribute("data-type", "type-list");

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // === Type Album ===
    if (e.target === typeAlbum) {
      libraryContent.setAttribute("data-type", "type-album");

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // === Type Big Album ===
    if (e.target === typeAlbumBig) {
      libraryContent.setAttribute("data-type", "type-album");

      if (activeElement !== e.target) {
        e.target.classList.add("active");
        activeElement.classList.remove("active");
        activeElement = e.target;
      }
    }

    // ======== Fix Scrollbar ========
    // if (sideBar.offsetWidth > sideBar.clientWidth) {
    //   sideBar.style.paddingRight = getScrollSideBar();
    //   if (sideBar.offsetWidth <= sideBar.clientWidth) {
    //     sideBar.style.paddingRight = null;
    //   }
    // }
  });

  // ==== Playlists OR Artists ====
  const navTabs = document.querySelector(".nav-tabs");
  navTabs.addEventListener("click", async (e) => {
    const playlistBtn = document.querySelector(".nav-tab.playlists");
    const artistBtn = document.querySelector(".nav-tab.artists");
    const user = localStorage.getItem("currentUser");
    const playlistContent = document.querySelector(".inner-playlist");
    const artistContent = document.querySelector(".inner-artist");

    // ==== Show Playlists ====
    if (e.target === playlistBtn) {
      e.target.classList.add("active");
      artistBtn.classList.remove("active");

      playlistContent.hidden = false;
      artistContent.hidden = true;
    }

    // ==== Show Artist ====
    if (e.target === artistBtn) {
      e.target.classList.add("active");
      playlistBtn.classList.remove("active");

      playlistContent.hidden = true;
      artistContent.hidden = false;
    }
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
    logoutCurrentUser();
  }
});

async function updateCurrentUser(user) {
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

  const libraryContent = document.querySelector(".library-content");
  // =================== Load Artists =====================
  if (user) {
    // ==== artistBtn ====
    const artistsBtn = document.querySelector(".nav-tab.artists");

    // ==== playlistBtn =====
    const playlistsBtn = document.querySelector(".nav-tab.playlists");
    try {
      const { artists } = await httpRequest.get("artists?limit=3&offset=0");
      // console.log(artists);

      const htmlArtist = artists
        .map((item) => {
          return `
            <div class="library-item artist-item" data-id="${item.id}">
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
      const innerArtist = document.createElement("div");
      innerArtist.innerHTML = htmlArtist;
      innerArtist.className = "inner-artist";
      libraryContent.appendChild(innerArtist);

      // =========== Load Playlists ===================
      const { playlists } = await httpRequest.get("me/playlists");

      const htmlPlaylist = playlists
        .map((playlist) => {
          return `
            <div class="library-item playlist-item" data-id="${playlist.id}">
              <img
                src="placeholder.svg?height=48&width=48"
                alt="${playlist.name}"
                class="item-image"
              />
              <div class="item-info">
                <div class="item-title">${playlist.name}</div>
                <div class="item-subtitle"></div>
              </div>
            </div>
    `;
        })
        .join("");
      const innerPlaylist = document.createElement("div");
      innerPlaylist.innerHTML = htmlPlaylist;
      innerPlaylist.className = "inner-playlist";
      innerPlaylist.hidden = true;
      libraryContent.appendChild(innerPlaylist);

      // ==== Artist Items ====
      const artistItems = Array.from(document.querySelectorAll(".artist-item"));

      // ==== Playlist Items ====
      const playlistItems = Array.from(
        document.querySelectorAll(".playlist-item")
      );

      // ===== Search Input =====
      const searchInput = document.querySelector(".search-sidebar-input");
      searchInput.addEventListener("input", () => {
        // ==== IF Artists Active ====
        if (artistsBtn.classList.value.includes("active")) {
          innerArtist.innerHTML = "";

          artistItems.filter((artist) => {
            // console.log(item.children[1].children[0].textContent);

            if (
              artist.children[1].children[0].textContent
                .toLowerCase()
                .includes(searchInput.value.toLowerCase())
            ) {
              // console.log(item);
              innerArtist.append(artist);
            }
          });
        }

        // ==== IF Playlist Active ====
        if (playlistsBtn.classList.value.includes("active")) {
          innerPlaylist.innerHTML = "";

          playlistItems.filter((playlist) => {
            if (
              playlist.children[1].children[0].textContent
                .toLowerCase()
                .includes(searchInput.value.toLowerCase())
            ) {
              innerPlaylist.append(playlist);
            }
          });
        }
      });

      // ===== Create Playlist =====
      const createBtn = document.querySelector(".create-btn");
      createBtn.addEventListener("click", async () => {
        if (!playlistsBtn.classList.value.includes("active")) {
          playlistsBtn.classList.add("active");
          artistsBtn.classList.remove("active");
        }

        playlistModal();

        // Tạo modal để nhập thông tin playlist => Mở nhiệm vụ trên F8 để biết thêm thông tin chi tiết
      });
    } catch (error) {
      console.log(error);
    }
  }
}

async function logoutCurrentUser() {
  const authButtons = document.querySelector(".auth-buttons");
  authButtons.style.display = "flex";

  const userMenu = document.querySelector(".user-menu");
  userMenu.style.display = "none";

  // Close dropdown first
  userDropdown.classList.remove("show");
  try {
    const result = await httpRequest.post("auth/logout");
    // console.log(result);

    localStorage.clear();

    const libraryContent = document.querySelector(".library-content");
    libraryContent.innerHTML = "";

    const inputForms = document.querySelectorAll(".form-input");
    inputForms.forEach((inputForm) => {
      inputForm.value = "";
    });

    // logoutCurrentUser();
  } catch (error) {
    console.log(error);
  }
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

async function signup() {
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
      // console.log(formGroup[2]);

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
}

async function login() {
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
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("refreshToken", refresh_token);

    updateCurrentUser(user);
  } catch (error) {
    console.log(error);
  }
}

function playlistModal() {
  const playlistModal = document.querySelector("#playlistModal");
  playlistModal.classList.add("show");

  playlistModal.addEventListener("click", async (e) => {
    e.stopPropagation();
    const artistsBtn = document.querySelector(".nav-tab.artists");
    const playlistsBtn = document.querySelector("nav-tab.playlists");

    // ==== Close Playlist Modal ====
    const closeBtn = document.querySelector(".modal-close.playlist");
    if (
      e.target === closeBtn ||
      e.target.closest(".fa-times") ||
      e.target === playlistModal
    ) {
      playlistModal.classList.remove("show");
    }

    // ==== Choose File Image ====
    const imageFile = document.querySelector("#previewImage");
    const inputFile = document.querySelector(".file-input");
    imageFile.addEventListener("click", () => {
      inputFile.click();
    });

    // ==== Render Image On ImageFile ====
    inputFile.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (file.name) {
        imageFile.src = file.name;
      } else {
        return "";
      }
    });

    // ==== Save Playlist ====
    const playlistSaveBtn = document.querySelector(".auth-submit-btn.playlist");
    if (e.target === playlistSaveBtn) {
      e.preventDefault();
      const playlistName = document.querySelector("#playlistName").value;
      const playlistTitle = document.querySelector("#playlistTitle").value;
      const imageFileValue = imageFile.src;

      if (playlistName) {
        const playlistInfo = {
          name: playlistName,
          description: playlistTitle,
          image_url: imageFileValue,
        };

        try {
          const { name, description, image_url } = await httpRequest.post(
            "playlists",
            playlistInfo
          );

          playlistModal.classList.remove("show");
          window.location.href = "/"; // 
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Vui long nhap ten playlist");
      }
    }
  });
}

async function logout() {
  // const authButtons = document.querySelector(".auth-buttons");
  // authButtons.style.display = "flex";
  // const userMenu = document.querySelector(".user-menu");
  // userMenu.style.display = "none";
  // // Close dropdown first
  // userDropdown.classList.remove("show");
  // try {
  //   const result = await httpRequest.post("auth/logout");
  //   // console.log(result);
  //   localStorage.clear();
  //   const inputForms = document.querySelectorAll(".form-input");
  //   inputForms.forEach((inputForm) => {
  //     inputForm.value = "";
  //   });
  //   // logoutCurrentUser();
  // } catch (error) {
  //   console.log(error);
  // }
}

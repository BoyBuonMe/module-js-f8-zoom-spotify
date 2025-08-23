import httpRequest from "./utils/httpRequest.js";
import * as exportMain from "./export-main.js";
// import updateUI from "./utils/updateUI.js";

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
  // updateCurrentUser(localStorage.getItem("currentUser"));
  renderHome();

  // ============================= Sidebar ================================================
  const sideBar = document.querySelector(".sidebar");
  const searchSidebar = document.querySelector(".search-library");
  const searchBtn = document.querySelector(".search-library-btn");
  const searchInput = document.querySelector(".search-sidebar-input");
  const recentBtn = document.querySelector(".sort-btn");
  const recentMenu = document.querySelector(".recent-menu");
  const libraryContent = document.querySelector(".library-content");

  // ==== Playlists OR Artists ====
  const navTabs = document.querySelector(".nav-tabs");
  navTabs.addEventListener("click", async (e) => {
    const playlistBtn = document.querySelector(".nav-tab.playlists");
    const artistBtn = document.querySelector(".nav-tab.artists");
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      if (e.target === playlistBtn) {
        libraryContent.innerHTML = "";
        e.target.classList.add("active");
        artistBtn.classList.remove("active");
      }

      if (e.target === artistBtn) {
        libraryContent.innerHTML = "";
        e.target.classList.add("active");
        playlistBtn.classList.remove("active");
      }
    }

    if (user) {
      // ==== Show Playlists ====
      if (e.target === playlistBtn) {
        e.target.classList.add("active");
        artistBtn.classList.remove("active");

        await loadPlaylist();
      }

      // ==== Show Artist ====
      if (e.target === artistBtn) {
        e.target.classList.add("active");
        playlistBtn.classList.remove("active");

        // =================== Load Artists =====================
        await loadArtist();
      }
    }
  });

  libraryContent.addEventListener("click", async (e) => {
    // ======== Wrapper Content ========
    const trackSection = document.querySelector(".tracks-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");

    // ==== Event ====
    const artistItemTarget = e.target.closest(".artist-item");
    if (artistItemTarget) {
      await renderArtistContent(e);
    }

    const playlistItemTarget = e.target.closest(".library-item.playlist-item");
    if (playlistItemTarget) {
      const id = playlistItemTarget.dataset.id;

      // trackSection.innerHTML = "";
      // hitsSection.hidden = true;
      // artistsSection.hidden = true;

      try {
        const { tracks } = await httpRequest.get(`playlists/${id}/tracks`);

        if (tracks.length === 0) {
          toastr.error(
            "Playlist chưa có bài hát nào, vui lòng thêm bài hát!",
            "Lỗi"
          );
          return "";
        }

        trackSection.innerHTML = "";
        hitsSection.hidden = true;
        artistsSection.hidden = true;

        const html = tracks
          .map((track) => {
            if (track.position === 1) {
              const background = document.createElement("div");
              background.innerHTML = `
              <section class="artist-hero">
                <div class="hero-background">
                  <img
                    src="${track.album_cover_image_url}"
                    alt="${playlistItemTarget.textContent}"
                    class="hero-image"
                  />
                  <div class="hero-overlay"></div>
                </div>
                <div class="hero-content">
                  <div class="verified-badge">
                    <i class="fas fa-check-circle"></i>
                    <span>Verified Artist</span>
                  </div>
                  <h1 class="artist-name">${playlistItemTarget.textContent}</h1>
                </div>
              </section>

              <section class="artist-controls">
                <button class="play-btn-large">
                  <i class="fas fa-play"></i>
                </button>
              <button type="submit" class="auth-submit-btn follow">Follow</button>
              </section>
            `;
              trackSection.appendChild(background);
            }

            return `
              <div class="track-item" data-id="${track.id}">
                <div class="track-number">${track.position}</div>
                <div class="track-image">
                  <img
                    src="${track.artist_image_url}"
                    alt="${track.title}"
                  />
                </div>
                <div class="track-info">
                  <div class="track-name">${track.track_title}</div>
                </div>
                <div class="track-plays">${track.position}</div>
                <div class="track-duration">${track.track_duration}s</div>
                <button class="track-menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
          `;
          })
          .join("");

        const inner = document.createElement("div");
        inner.innerHTML = html;
        trackSection.appendChild(inner);
        trackSection.setAttribute("data-id", id);
      } catch (error) {
        toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
      }

      await checkPlaylistFollow();

      // ===== Follow Playlist ====
      handleFollowPlaylist();
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

    searchInputSidebar();
  });

  searchSidebar.addEventListener("click", (e) => {
    // e.preventDefault();
    if (e.target === recentBtn) {
      recentMenu.classList.add("show");
    }
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

  if (user) {
    if (!user) toastr.error("Bạn cần đăng nhập để tạo playlist!", "Lỗi");

    await loadPlaylist();

    // ===== Create Playlist =====
    const createBtn = document.querySelector(".create-btn");
    createBtn.addEventListener("click", () => {
      // if (!playlistsBtn.classList.value.includes("active")) {
      //   playlistsBtn.classList.add("active");
      //   artistsBtn.classList.remove("active");
      // }

      handlePlaylistModal();
    });
  }
}

function searchInputSidebar() {
  // ==== artistBtn ====
  const artistsBtn = document.querySelector(".nav-tab.artists");

  // ==== playlistBtn =====
  const playlistsBtn = document.querySelector(".nav-tab.playlists");

  const libraryItems = Array.from(document.querySelectorAll(".library-item"));

  // // ==== Artist Items ====
  // const artistItems = Array.from(document.querySelectorAll(".artist-item"));

  // // ==== Playlist Items ====
  // const playlistItems = Array.from(document.querySelectorAll(".playlist-item"));

  // ===== Search Input =====
  const searchInput = document.querySelector(".search-sidebar-input");
  const libraryContent = document.querySelector(".library-content");

  searchInput.addEventListener("input", () => {
    // ==== IF Artists Active ====
    if (artistsBtn.classList.value.includes("active")) {
      const innerArtist = document.querySelector(".inner-artist");
      innerArtist.innerHTML = "";

      libraryItems.filter((artist) => {
        // console.log(item.children[1].children[0].textContent);

        if (
          artist.children[1].children[0].textContent
            .toLowerCase()
            .includes(searchInput.value.toLowerCase())
        ) {
          // console.log(item);
          innerArtist.append(artist);
          // libraryContent.appendChild(innerArtist);
        }
      });
    }

    // ==== IF Playlist Active ====
    if (playlistsBtn.classList.value.includes("active")) {
      const innerPlaylist = document.querySelector(".inner-playlists");
      innerPlaylist.innerHTML = "";

      libraryItems.filter((playlist) => {
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
  hitsGrid.innerHTML = "";

  // Get Track API
  try {
    const { tracks } = await httpRequest.get("tracks?limit=6&offset=0");
    const htmlTracks = tracks
      .map((track) => {
        return `
              <div class="hit-card" data-id="${track.id}">
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
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }

  hitsGrid.addEventListener("click", async (e) => {
    const trackSection = document.querySelector(".tracks-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");

    if (e.target.closest(".hit-card")) {
      const id = e.target.closest(".hit-card").dataset.id;

      trackSection.innerHTML = "";
      hitsSection.hidden = true;
      artistsSection.hidden = true;

      const inner = document.createElement("div");
      inner.className = "inner-section";

      // Get Background Track
      try {
        const track = await httpRequest.get(`tracks/${id}`);

        const html = `
              <section class="artist-hero">
                <div class="hero-background">
                  <img
                    src="${track.album_cover_image_url}"
                    alt="${track.title}"
                    class="hero-image"
                  />
                  <div class="hero-overlay"></div>
                </div>
                <div class="hero-content">
                  <div class="verified-badge">
                    <i class="fas fa-check-circle"></i>
                    <span>Verified Artist</span>
                  </div>
                  <h1 class="artist-name">${track.title}</h1>
                  <h1 class="">${track.artist_name}</h1>
                </div>
              </section>

              <section class="artist-controls">
                <button class="play-btn-large">
                  <i class="fas fa-play"></i>
                </button>
              </section>

              <div class="track-item" data-id="${track.id}">
                <div class="track-number">1</div>
                <div class="track-image">
                  <img
                    src="${track.image_url}"
                    alt="${track.title}"
                  />
                </div>
                <div class="track-info">
                  <div class="track-name">${track.title}</div>
                  <div class="track-artist-name">${track.artist_name}</div>
                </div>
                <div class="track-duration">${track.duration}s</div>
                <button class="track-menu-btn">
                  <i class="fas fa-ellipsis-h"></i>
                </button>
              </div>
            `;

        inner.innerHTML = html;
        trackSection.appendChild(inner);
        trackSection.setAttribute("data-id", id);
      } catch (error) {
        console.log(error);
        toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
      }
    }
  });

  // ====== Body Center ======
  const artistsGrid = document.querySelector(".artists-grid");
  artistsGrid.innerHTML = "";

  // Get Artists Popular
  try {
    const { artists } = await httpRequest.get("artists?limit=6&offset=0");

    const htmlArtists = artists
      .map((artist) => {
        return `
              <div class="artist-card artist-item" data-id="${artist.id}">
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
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }

  artistsGrid.addEventListener("click", async (e) => {
    await renderArtistContent(e);
  });
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

    toastr.success("Đăng ký thành công!", "Thành công");

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("currentUser", user);

    updateCurrentUser(user);
  } catch (error) {
    toastr.error("Có lỗi xảy ra!", "Lỗi");
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
    toastr.success("Đăng nhập thành công!", "Thành công");

    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("refreshToken", refresh_token);

    updateCurrentUser(user);
  } catch (error) {
    console.log(error);
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }
}

async function loadPlaylist() {
  // =========== Load Playlists ===================
  const libraryContent = document.querySelector(".library-content");
  libraryContent.innerHTML = "";

  const innerPlaylist = document.createElement("div");
  innerPlaylist.className = "inner-playlists";
  try {
    const { playlists } = await httpRequest.get(
      "me/playlists/followed?limit=20&offset=0"
    );

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

    const inner = document.createElement("div");
    inner.innerHTML = htmlPlaylist;
    innerPlaylist.appendChild(inner);
    libraryContent.appendChild(innerPlaylist);
  } catch (error) {
    console.log(error);
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }

  try {
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

    const inner = document.createElement("div");
    inner.innerHTML = htmlPlaylist;
    innerPlaylist.appendChild(inner);
    libraryContent.appendChild(innerPlaylist);
  } catch (error) {
    console.log(error);
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }

  try {
    const { playlists } = await httpRequest.get("playlists?limit=2&offset=0");

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

    const inner = document.createElement("div");
    inner.innerHTML = htmlPlaylist;
    innerPlaylist.appendChild(inner);
    libraryContent.appendChild(innerPlaylist);
  } catch (error) {
    console.log(error);
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }
}

async function loadArtist() {
  // =================== Load Artists =====================
  const libraryContent = document.querySelector(".library-content");
  libraryContent.innerHTML = "";

  try {
    const { artists } = await httpRequest.get("me/following?limit=20&offset=0");
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
  } catch (error) {
    console.log(error);
    toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
  }
}

async function checkPlaylistFollow() {
  const trackSection = document.querySelector(".tracks-section");
  const followPlaylistBtn = document.querySelector(".auth-submit-btn.follow");

  const id = trackSection.getAttribute("data-id");
  // console.log(id);

  const { playlists } = await httpRequest.get(
    "me/playlists/followed?limit=20&offset=0"
  );
  // console.log(playlists);

  playlists.filter((playlist) => {
    // console.log(playlist);
    if (id !== playlist.id) return "";
    followPlaylistBtn.style.transition = "none";
    followPlaylistBtn.classList.add("active");
    followPlaylistBtn.textContent = "Unfollow";
  });

  // JSON.parse(localStorage.getItem("check-follow-playlist")).filter(
  //   (playlist) => {
  //     if (id !== playlist.id) return "";
  //     followPlaylistBtn.style.transition = "none";
  //     followPlaylistBtn.classList.add("active");
  //     followPlaylistBtn.textContent = "Unfollow";
  //   }
  // );
}

async function followPlaylist() {
  const id = document.querySelector(".tracks-section").getAttribute("data-id");
  // console.log(id);

  try {
    const { message } = await httpRequest.post(`playlists/${id}/follow`);
    toastr.success(message, "Success");
    await checkPlaylistFollow();
  } catch (error) {
    console.log(error);
    toastr.error(error.response.error.message, "Error");
  }
}

async function unfollowPlaylist() {
  const id = document.querySelector(".tracks-section").getAttribute("data-id");
  const followArtistBtn = document.querySelector(".auth-submit-btn.follow");
  // console.log(id);

  try {
    const { message } = await httpRequest.del(`playlists/${id}/follow`);
    toastr.success(message, "Success");

    await checkPlaylistFollow();

    followArtistBtn.style.transition = "none";
    followArtistBtn.classList.remove("active");
    followArtistBtn.textContent = "Follow";
  } catch (error) {
    console.log(error);
    toastr.error(error.response.error.message, "Error");
  }
}

async function checkArtistFollow() {
  const id = document.querySelector(".tracks-section").getAttribute("data-id");
  const followArtistBtn = document.querySelector(".auth-submit-btn.follow");
  // console.log(followArtistBtn);

  const { artists } = await httpRequest.get("me/following?limit=10&offset=0");
  // console.log(artists);

  artists.filter((artist) => {
    // console.log(artist);
    if (id !== artist.id) return "";
    followArtistBtn.style.transition = "none";
    followArtistBtn.classList.add("active");
    followArtistBtn.textContent = "Unfollow";
  });

  // JSON.parse(localStorage.getItem("check-follow-artist")).filter((artist) => {
  //   if (id !== artist.id) return "";
  //   followArtistBtn.style.transition = "none";
  //   followArtistBtn.classList.add("active");
  //   followArtistBtn.textContent = "Unfollow";
  // });
}

async function followArtist() {
  const id = document.querySelector(".tracks-section").getAttribute("data-id");

  try {
    const { message } = await httpRequest.post(`artists/${id}/follow`);
    toastr.success(message, "Success");
    await checkArtistFollow();
  } catch (error) {
    console.log(error);
    toastr.error(error.response.error.message, "Error");
  }
}

async function unfollowArtist() {
  const id = document.querySelector(".tracks-section").getAttribute("data-id");
  const followArtistBtn = document.querySelector(".auth-submit-btn.follow");
  // console.log(id);

  try {
    const { message } = await httpRequest.del(`artists/${id}/follow`);
    toastr.success(message, "Success");

    await checkArtistFollow();

    followArtistBtn.style.transition = "none";
    followArtistBtn.classList.remove("active");
    followArtistBtn.textContent = "Follow";
  } catch (error) {
    console.log(error);
    toastr.error(error.response.error.message, "Error");
  }
}

function handlePlaylistModal() {
  const playlistModal = document.querySelector("#playlistModal");
  const nameInput = document.querySelector("#playlistName");
  const titleInput = document.querySelector("#playlistTitle");
  const imageFile = document.querySelector("#previewImage");
  const inputFile = document.querySelector(".file-input");
  const playlistSaveBtn = document.querySelector(".auth-submit-btn.playlist");
  const closeBtn = document.querySelector(".modal-close.playlist");

  // Nếu trước đó đã lưu handler, remove chúng để tránh chồng chéo
  if (playlistModal._handleImageClick) {
    imageFile.removeEventListener("click", playlistModal._handleImageClick);
    inputFile.removeEventListener("change", playlistModal._handleFileChange);
    playlistModal.removeEventListener(
      "click",
      playlistModal._handleSavePlaylist
    );
    playlistModal.removeEventListener("click", playlistModal._handleCloseModal);
  }

  // ==== Handlers (tạo một lần cho lần mở này và lưu vào phần tử modal) ====
  const handleImageClick = () => {
    inputFile.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      imageFile.src = URL.createObjectURL(file);
    }
  };

  const handleSavePlaylist = async (e) => {
    if (e.target !== playlistSaveBtn) return;
    e.preventDefault();

    if (nameInput.value !== "") {
      const playlistInfo = {
        name: nameInput.value,
        description: titleInput.value,
        image_url: imageFile.src,
      };

      try {
        const { name, description, image_url } = await httpRequest.post(
          "playlists",
          playlistInfo
        );

        playlistModal.classList.remove("show");
        nameInput.value = "";
        titleInput.value = "";
        imageFile.src = "./placeholder.svg";
      } catch (error) {
        console.log(error);
        toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
      }
    } else {
      toastr.warning("Vui lòng nhập tên playlist!", "Cảnh báo");
    }
  };

  const handleCloseModal = (e) => {
    if (
      e.target === closeBtn ||
      e.target.closest(".fa-times") ||
      e.target === playlistModal
    ) {
      playlistModal.classList.remove("show");
      nameInput.value = "";
      titleInput.value = "";
      imageFile.src = "./placeholder.svg";
    }
  };

  // ==== Lưu tham chiếu handler lên modal để lần sau có thể remove ====
  playlistModal._handleImageClick = handleImageClick;
  playlistModal._handleFileChange = handleFileChange;
  playlistModal._handleSavePlaylist = handleSavePlaylist;
  playlistModal._handleCloseModal = handleCloseModal;

  // ==== Add listeners mới ====
  imageFile.addEventListener("click", handleImageClick);
  inputFile.addEventListener("change", handleFileChange);
  playlistModal.addEventListener("click", handleSavePlaylist);
  playlistModal.addEventListener("click", handleCloseModal);

  // Show modal
  playlistModal.classList.add("show");
}

function handleFollowArtist() {
  const libraryContent = document.querySelector(".library-content");
  const followBtn = document.querySelector(".auth-submit-btn.follow");

  // tippy(followBtn, {
  //   content: 'Tooltip bằng Tippy.js!',
  //   placement: 'top',   // top, right, bottom, left
  //   animation: 'scale', // scale, shift-away, shift-toward
  // });

  followBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (followBtn.classList.value.includes("active")) {
      await unfollowArtist();
    } else {
      await followArtist();
    }
    await loadArtist();

    // Get innerArtist ở dưới vì sau khi gọi hàm loadArtist mới tạo innerArtist.
    const innerArtist = document.querySelector(".inner-artist");

    if (libraryContent.childNodes[0] === innerArtist) {
      const artistsBtn = document.querySelector(".nav-tab.artists");
      const playlistBtn = document.querySelector(".nav-tab.playlists");
      artistsBtn.classList.add("active");
      playlistBtn.classList.remove("active");
    }
    // await updateCurrentUser(localStorage.getItem("currentUser"));
  });
}

function handleFollowPlaylist() {
  const libraryContent = document.querySelector(".library-content");
  const followBtn = document.querySelector(".auth-submit-btn.follow");
  followBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (followBtn.classList.value.includes("active")) {
      await unfollowPlaylist();
    } else {
      await followPlaylist();
    }
    await loadPlaylist();

    const innerPlaylist = document.querySelector(".inner-playlists");

    if (libraryContent.childNodes[0] === innerPlaylist) {
      const artistsBtn = document.querySelector(".nav-tab.artists");
      const playlistBtn = document.querySelector(".nav-tab.playlists");
      artistsBtn.classList.remove("active");
      playlistBtn.classList.add("active");
    }

    // Cách 2: Vì khi đăng nhập render ra giao diện của playlist, còn artist phải click vào artist mới render ra.
    // await updateCurrentUser(localStorage.getItem("currentUser"));
  });
}

async function renderArtistContent(e) {
  // ======== Wrapper Content ========
  const trackSection = document.querySelector(".tracks-section");
    const hitsSection = document.querySelector(".hits-section");
    const artistsSection = document.querySelector(".artists-section");

    if (e.target.closest(".artist-item")) {
      const id = e.target.closest(".artist-item").dataset.id;

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
              <button type="submit" class="auth-submit-btn follow">Follow</button>

              </section>
            `;

        inner.innerHTML = html;
        trackSection.appendChild(inner);
        trackSection.setAttribute("data-id", id);
      } catch (error) {
        console.log(error);
        toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
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
        toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");
      }
      await checkArtistFollow();
      handleFollowArtist();
    }
}



// toastr.error("Lỗi dữ liệu, vui lòng thử lại sau!", "Lỗi");

// Kiểm tra vì sao follow không được, fix lỗi đó, sau đó làm tiếp phần hit track sau đó làm controls phát nhạc. Còn thời gian thì tối ưu code (Tách hàm).
// Đổi API của artist sang follow artist.
// Tối ưu để tách render artist thành 1 hàm


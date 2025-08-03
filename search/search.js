export function search() {
  const searchSidebar = document.querySelector(".search-library");
  const searchBtn = document.querySelector(".search-library-btn");
  const searchIcon = document.querySelector(".fa-search");
  const searchInput = document.querySelector(".search-sidebar-input");
  const recentBtn = document.querySelector(".sort-btn");

  document.addEventListener("click", (e) => {
    if (e.target === searchIcon || e.target === searchBtn || e.target === searchInput) {
        searchInput.hidden = false;
        recentBtn.style.display = "none";
    } else {
        searchInput.hidden = true;
        searchInput.value = "";
        recentBtn.style.display = "flex";
    }
  });
}

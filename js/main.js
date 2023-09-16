function toggleNavbarTransparency() {
  const navbar = document.getElementById("navbar");
  const scrollY = window.scrollY;

  if (scrollY > 100) {
    navbar.classList.add("bg-secondary");
  } else {
    navbar.classList.remove("bg-secondary");
  }
}

window.addEventListener("scroll", toggleNavbarTransparency);

toggleNavbarTransparency();

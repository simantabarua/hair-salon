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

// js for swiper:

var swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});

const mobileMenuButton = document.querySelector(
  'button[aria-controls="mobile-menu"]'
);
const mobileMenu = document.querySelector("#mobile-menu");
const openIcon = document.querySelector(".open-icon");
const closeIcon = document.querySelector(".close-icon");

// Add click event listener to the mobile menu button
mobileMenuButton.addEventListener("click", () => {
  const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";

  // Toggle the visibility and position of the mobile menu
  if (isExpanded) {
    mobileMenu.style.transform = "translateX(-100%)";
  } else {
    mobileMenu.style.transform = "translateX(0%)";
  }
  mobileMenuButton.setAttribute("aria-expanded", !isExpanded);

  // Toggle the visibility of the icons
  openIcon.classList.toggle("hidden", !isExpanded);
  closeIcon.classList.toggle("hidden", isExpanded);
});


const openSidebarButton = document.getElementById('openSidebarButton');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

openSidebarButton.addEventListener('click', () => {
    sidebar.classList.remove('hidden');
    sidebarOverlay.style.display = 'block';
});

sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.add('hidden');
    sidebarOverlay.style.display = 'none';
});
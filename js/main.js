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

// JS for sidebar

const openSidebarButton = document.getElementById("openSidebarButton");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const sidebarClose = document.getElementById("sidebarClose");

// Check if elements exist before adding event listeners
if (openSidebarButton && sidebar && sidebarOverlay && sidebarClose) {
  openSidebarButton.addEventListener("click", () => {
    sidebar.classList.remove("hidden");
    sidebarOverlay.style.display = "block";
  });

  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    sidebarOverlay.style.display = "none";
  });

  sidebarClose.addEventListener("click", () => {
    sidebar.classList.add("hidden");
    sidebarOverlay.style.display = "none";
  });
} else {
  console.error("One or more elements not found. Check your HTML structure.");
}

// Tab

document.addEventListener("DOMContentLoaded", function () {
  const tabLinks = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-pane");

  tabLinks.forEach((tabLink) => {
      tabLink.addEventListener("click", () => {
          const tabId = tabLink.getAttribute("data-tab");

          // Hide all tab contents
          tabContents.forEach((content) => {
              content.classList.remove("active-tab-pane");
          });

          // Show the selected tab content
          const selectedTabContent = document.getElementById(tabId);
          selectedTabContent.classList.add("active-tab-pane");

          // Remove 'active-tab' class from all tab links
          tabLinks.forEach((link) => {
              link.classList.remove("active-tab");
          });

          // Add 'active-tab' class to the clicked tab link
          tabLink.classList.add("active-tab");
      });
  });
});
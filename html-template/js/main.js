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
    clickable: true,
  },
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
});

// JavaScript for navbar dropdown
const dropdownBtn = document.getElementById("navbar-dropdown-btn");
const dropdownItems = document.getElementById("navbar-dropdown-items");

try {
    if (!dropdownBtn || !dropdownItems) {
        throw new Error("Navbar dropdown button or dropdown items element not found.");
    }

    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent the click event from propagating to the document
    });

    dropdownBtn.addEventListener("mouseover", () => {
        dropdownItems.classList.add("scale-y-100");
    });

    document.addEventListener("click", () => {
        dropdownItems.classList.remove("scale-y-100");
    });

    // Close the dropdown when an item is clicked
    dropdownItems.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
            dropdownItems.classList.remove("scale-y-100");
        }
    });
} catch (error) {
    console.error("An error occurred in the navbar dropdown function:", error);
}

// JavaScript for Mobile nav
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

//JS for  Tab
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

// Js for shop page
function changeProductImage(newImageSrc, clickedThumbnailId) {
  // Get the main product image element
  let mainProductImage = document.getElementById("main-product-image");

  // Change the source of the main product image
  mainProductImage.src = newImageSrc;

  // Reset opacity for all thumbnails
  let thumbnails = document.querySelectorAll(".thumbnail-image");
  thumbnails.forEach(function (thumbnail) {
    thumbnail.classList.remove("active-thumbnail");
    thumbnail.classList.add("inactive-thumbnail");
  });

  // Set the active class for the clicked thumbnail
  let clickedThumbnail = document.getElementById(clickedThumbnailId);
  clickedThumbnail.classList.add("active-thumbnail");
  clickedThumbnail.classList.remove("inactive-thumbnail");
}

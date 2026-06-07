/* =========================================================
   FOOTER YEAR
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();


/* =========================================================
   MOBILE NAV TOGGLE
   ========================================================= */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

// Close mobile menu when clicking a link
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
});


/* =========================================================
   FLOATING HOME BUTTON
   ========================================================= */
const homeButton = document.getElementById("homeButton");

window.addEventListener("scroll", () => {
    if (window.scrollY > 250) {
        homeButton.classList.add("visible");
    } else {
        homeButton.classList.remove("visible");
    }
});

homeButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================================================
   GALLERY FILTER (MASONRY SAFE)
   ========================================================= */
const filterButtons = document.querySelectorAll(".filter-buttons button");
const galleryItems = document.querySelectorAll(".gallery-item");
const galleryGrid = document.querySelector(".gallery-grid");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // Update active button
        filterButtons.forEach(b => b.classList.remove("active"));
        button.classList.add("active");

        const filter = button.dataset.filter;

        // Show/hide items
        galleryItems.forEach(item => {
            const category = item.dataset.category;
            item.style.display = (filter === "all" || category === filter)
                ? "inline-block"
                : "none";
        });

        // Force masonry reflow
        galleryGrid.style.display = "none";
        galleryGrid.offsetHeight; // trigger reflow
        galleryGrid.style.display = "";
    });
});


/* =========================================================
   LIGHTBOX FUNCTIONALITY
   ========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("lightboxClose");
const nextBtn = document.getElementById("lightboxNext");
const prevBtn = document.getElementById("lightboxPrev");

let currentIndex = 0;
let galleryImages = [];

// Collect all gallery images
function updateGalleryImages() {
    galleryImages = Array.from(document.querySelectorAll(".gallery-item img"));
}
updateGalleryImages();

// Open lightbox
galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => {
        currentIndex = index;
        showLightboxImage();
        lightbox.classList.add("open");
    });
});

// Close lightbox
closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("open");
});

// Navigate next
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showLightboxImage();
});

// Navigate previous
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightboxImage();
});

// Close when clicking background
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("open");
    }
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "Escape") closeBtn.click();
});

// Update displayed image
function showLightboxImage() {
    const img = galleryImages[currentIndex];
    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.alt;
}

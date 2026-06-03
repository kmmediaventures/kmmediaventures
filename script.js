// =========================================================
// FOOTER YEAR
// =========================================================
document.getElementById("year").textContent = new Date().getFullYear();


// =========================================================
// MOBILE NAV TOGGLE
// =========================================================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

// Close menu when clicking a link (mobile)
document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("open");
    });
});


// =========================================================
// FLOATING HOME BUTTON (SHOW ON SCROLL)
// =========================================================
const homeButton = document.getElementById("homeButton");

window.addEventListener("scroll", () => {
    if (window.scrollY > 250) {
        homeButton.style.display = "block";
    } else {
        homeButton.style.display = "none";
    }
});

// Smooth scroll to top
homeButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


// =========================================================
// GALLERY FILTER (MASONRY SAFE)
// =========================================================
const buttons = document.querySelectorAll(".filter-buttons button");
const items = document.querySelectorAll(".gallery-item");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        items.forEach(item => {
            const category = item.getAttribute("data-category");

            if (filter === "all" || category === filter) {
                item.style.display = "inline-block";
            } else {
                item.style.display = "none";
            }
        });
    });
});


// =========================================================
// LIGHTBOX FUNCTIONALITY
// =========================================================
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const closeBtn = document.getElementById("lightboxClose");
const nextBtn = document.getElementById("lightboxNext");
const prevBtn = document.getElementById("lightboxPrev");

let currentIndex = 0;
let galleryImages = Array.from(document.querySelectorAll(".gallery-item img"));

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

// Next image
nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showLightboxImage();
});

// Previous image
prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightboxImage();
});

// Close on background click
lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
        lightbox.classList.remove("open");
    }
});

// Keyboard support
document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;

    if (e.key === "ArrowRight") nextBtn.click();
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "Escape") closeBtn.click();
});

// Update lightbox content
function showLightboxImage() {
    const img = galleryImages[currentIndex];
    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.alt;
}

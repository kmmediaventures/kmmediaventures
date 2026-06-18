/* =========================================================
   MOBILE NAV (Hamburger Menu)
   ========================================================= */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove("open");
    }
});


/* =========================================================
   FLOATING HOME BUTTON
   ========================================================= */
const homeButton = document.getElementById("homeButton");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        homeButton.classList.add("visible");
    } else {
        homeButton.classList.remove("visible");
    }
});

homeButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================================================
   FADE-UP ANIMATIONS
   ========================================================= */
const fadeElements = document.querySelectorAll(".fade-up");

const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                fadeObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.2 }
);

fadeElements.forEach((el) => fadeObserver.observe(el));


/* =========================================================
   GALLERY FILTERING
   ========================================================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        galleryItems.forEach((item) => {
            const category = item.dataset.category;

            if (filter === "all" || filter === category) {
                item.classList.remove("hidden");
            } else {
                item.classList.add("hidden");
            }
        });
    });
});


/* =========================================================
   LIGHTBOX
   ========================================================= */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const btnClose = document.getElementById("lightboxClose");
const btnNext = document.getElementById("lightboxNext");
const btnPrev = document.getElementById("lightboxPrev");

let galleryImages = Array.from(document.querySelectorAll(".gallery-item img"));
let currentIndex = 0;

function openLightbox(index) {
    currentIndex = index;
    const img = galleryImages[currentIndex];

    lightboxImage.src = img.src;
    lightboxCaption.textContent = img.alt || "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
}

function nextImage() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    openLightbox(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentIndex);
}

galleryImages.forEach((img, index) => {
    img.addEventListener("click", () => openLightbox(index));
});

btnClose.addEventListener("click", closeLightbox);
btnNext.addEventListener("click", nextImage);
btnPrev.addEventListener("click", prevImage);

lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
});


/* =========================================================
   CLIENT LOGIN MODAL
   ========================================================= */
const clientLoginBtn = document.getElementById("clientLoginBtn");
const passwordModal = document.getElementById("passwordModal");
const closePassword = document.getElementById("closePassword");
const cancelPassword = document.getElementById("cancelPassword");
const submitPassword = document.getElementById("submitPassword");
const toggleShow = document.getElementById("toggleShow");
const clientPassword = document.getElementById("clientPassword");
const passwordError = document.getElementById("passwordError");

const clientFolders = {
    "bundy2026": "https://example.com",
    "meyer2025": "https://example.com",
    "herrell2026": "https://example.com"
};

clientLoginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    passwordModal.classList.add("active");
    clientPassword.focus();
});

function closeModal() {
    passwordModal.classList.remove("active");
    clientPassword.value = "";
    passwordError.textContent = "";
}

closePassword.addEventListener("click", closeModal);
cancelPassword.addEventListener("click", closeModal);

passwordModal.addEventListener("click", (e) => {
    if (e.target === passwordModal) closeModal();
});

toggleShow.addEventListener("click", () => {
    if (clientPassword.type === "password") {
        clientPassword.type = "text";
        toggleShow.textContent = "Hide";
    } else {
        clientPassword.type = "password";
        toggleShow.textContent = "Show";
    }
});

submitPassword.addEventListener("click", () => {
    const entered = clientPassword.value.trim();

    if (entered in clientFolders) {
        window.location.href = clientFolders[entered];
    } else {
        passwordError.textContent = "Incorrect password. Please try again.";
    }
});


/* =========================================================
   FOOTER YEAR
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();

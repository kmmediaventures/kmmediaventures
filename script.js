/* =========================================================
   MOBILE NAV
   ========================================================= */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

/* Close menu when clicking a link (mobile) */
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });
});

/* =========================================================
   FLOATING HOME BUTTON
   ========================================================= */
const homeButton = document.getElementById("homeButton");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    homeButton.classList.add("visible");
  } else {
    homeButton.classList.remove("visible");
  }
});

homeButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   FADE-UP ANIMATION
   ========================================================= */
const fadeElements = document.querySelectorAll(".fade-up");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.2 }
);

fadeElements.forEach(el => observer.observe(el));

/* =========================================================
   GALLERY FILTERING
   ========================================================= */
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach(item => {
      const category = item.dataset.category;

      if (filter === "all" || category === filter) {
        item.style.display = "inline-block";
        item.style.opacity = "1";
      } else {
        item.style.display = "none";
        item.style.opacity = "0";
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
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

let currentIndex = 0;
let images = Array.from(galleryItems).map(item => ({
  src: item.querySelector("img").src,
  caption: item.querySelector(".photo-label").innerText
}));

function openLightbox(index) {
  currentIndex = index;
  lightboxImage.src = images[index].src;
  lightboxCaption.textContent = images[index].caption;
  lightbox.classList.add("open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
}

function showPrev() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openLightbox(currentIndex);
}

function showNext() {
  currentIndex = (currentIndex + 1) % images.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

lightboxClose.addEventListener("click", closeLightbox);
lightboxPrev.addEventListener("click", showPrev);
lightboxNext.addEventListener("click", showNext);

/* Close when clicking outside image */
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightbox();
});

/* Keyboard controls */
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") showPrev();
  if (e.key === "ArrowRight") showNext();
});

/* =========================================================
   FOOTER YEAR
   ========================================================= */
document.getElementById("year").textContent = new Date().getFullYear();

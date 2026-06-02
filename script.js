// KM Media Ventures – main script

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // YEAR IN FOOTER
  // =========================
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // =========================
  // MOBILE MENU
  // =========================
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // =========================
  // SMOOTH SCROLLING
  // =========================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetSelector = anchor.getAttribute("href");
      if (!targetSelector || targetSelector === "#") return;

      const target = document.querySelector(targetSelector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      setTimeout(updateActiveNav, 400);
    });
  });

  // =========================
  // SCROLL SPY
  // =========================
  function updateActiveNav() {
    const sections = document.querySelectorAll("main section[id]");
    let current = "";

    sections.forEach((section) => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      if (href.slice(1) === current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  // =========================
  // SCROLL ANIMATIONS
  // =========================
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".fade-up").forEach((el) => observer.observe(el));

  // =========================
  // CONTACT FORM
  // =========================
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector("#name");
      const email = contactForm.querySelector("#email");
      const message = contactForm.querySelector("#message");

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        alert("Please fill out all fields.");
        return;
      }

      alert("Thank you for reaching out! I will get back to you soon.");
      contactForm.reset();
    });
  }

  // =========================
  // GALLERY FILTER
  // =========================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  let filteredItems = [...galleryItems];
  let currentIndex = 0;

  function applyFilter(filter) {
    filteredItems = [];

    galleryItems.forEach((item) => {
      const category = item.dataset.category;
      const match = filter === "all" || category === filter;

      item.classList.toggle("hidden", !match);
      if (match) filteredItems.push(item);
    });

    attachLightboxListeners();
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter || "all";
      applyFilter(filter);
    });
  });

  // =========================
  // LIGHTBOX
  // =========================
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  function attachLightboxListeners() {
    filteredItems.forEach((item, index) => {
      item.onclick = () => {
        currentIndex = index;
        openLightbox();
      };
    });
  }

  function openLightbox() {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    const item = filteredItems[currentIndex];
    if (!item) return;

    const img = item.querySelector("img");
    const captionEl = item.querySelector(".gallery-overlay p");

    lightboxImage.src = img ? img.src : "";
    lightboxCaption.textContent = captionEl ? captionEl.textContent : "";

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function nextImage() {
    if (!filteredItems.length) return;
    currentIndex = (currentIndex + 1) % filteredItems.length;
    openLightbox();
  }

  function prevImage() {
    if (!filteredItems.length) return;
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    openLightbox();
  }

  if (lightboxClose) lightboxClose.onclick = closeLightbox;
  if (lightboxNext) lightboxNext.onclick = nextImage;
  if (lightboxPrev) lightboxPrev.onclick = prevImage;

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });

  // initial setup
  applyFilter("all");
});

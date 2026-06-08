document.addEventListener("DOMContentLoaded", () => {

  const navMenu = document.getElementById("navMenu");
  const hamburger = document.getElementById("hamburger");
  const homeButton = document.getElementById("homeButton");
  const yearSpan = document.getElementById("year");

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const fadeUps = document.querySelectorAll(".fade-up");

  let currentIndex = 0;


  // YEAR
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();


  // MOBILE NAV
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });

  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
  });


  // HOME BUTTON
  window.addEventListener("scroll", () => {
    homeButton.classList.toggle("visible", window.scrollY > 400);
  });

  homeButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  // FADE-UP
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    fadeUps.forEach(el => observer.observe(el));
  } else {
    fadeUps.forEach(el => el.classList.add("visible"));
  }


  // MASONRY REFLOW
  function masonryReflow() {
    const grid = document.querySelector(".gallery-grid");
    grid.style.display = "none";
    void grid.offsetHeight;
    grid.style.display = "";
  }


  // GET VISIBLE ITEMS
  function getVisibleItems() {
    return Array.from(galleryItems).filter(
      item => item.style.display !== "none"
    );
  }


  // FILTERING
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach(item => {
        const category = item.getAttribute("data-category");

        if (category === filter) {
          item.style.display = "inline-block";
          item.style.opacity = "1";
          item.style.pointerEvents = "auto";
        } else {
          item.style.display = "none";
          item.style.opacity = "0";
          item.style.pointerEvents = "none";
        }
      });

      masonryReflow();
    });
  });


  // LIGHTBOX
  galleryItems.forEach(item => {
    const img = item.querySelector("img");

    img.addEventListener("click", () => {
      const visible = getVisibleItems();
      currentIndex = visible.indexOf(item);
      openLightbox();
    });
  });

  function openLightbox() {
    const visible = getVisibleItems();
    const item = visible[currentIndex];

    const img = item.querySelector("img");
    const label = item.querySelector(".photo-label");

    lightboxImage.src = img.src;
    lightboxCaption.textContent = label ? label.textContent : "";

    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
  }

  function showPrev() {
    const visible = getVisibleItems();
    currentIndex = (currentIndex - 1 + visible.length) % visible.length;
    openLightbox();
  }

  function showNext() {
    const visible = getVisibleItems();
    currentIndex = (currentIndex + 1) % visible.length;
    openLightbox();
  }

  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", showPrev);
  lightboxNext.addEventListener("click", showNext);

  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeLightbox();
  });


  // =========================================================
  // CRITICAL FIX: RESET ALL ITEMS BEFORE DEFAULT FILTER
  // =========================================================
  galleryItems.forEach(item => {
    item.style.display = "inline-block";
    item.style.opacity = "1";
    item.style.pointerEvents = "auto";
  });

  masonryReflow();

  // Apply default Portrait filter
  document.querySelector('.filter-btn[data-filter="portrait"]').click();

});

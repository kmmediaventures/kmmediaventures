
Script · JS
document.addEventListener("DOMContentLoaded", () => {
 
  // -------------------------------
  // ELEMENT REFERENCES
  // -------------------------------
  const navMenu     = document.getElementById("navMenu");
  const hamburger   = document.getElementById("hamburger");
  const homeButton  = document.getElementById("homeButton");
  const yearSpan    = document.getElementById("year");
 
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems  = document.querySelectorAll(".gallery-item");
 
  const lightbox        = document.getElementById("lightbox");
  const lightboxImage   = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxClose   = document.getElementById("lightboxClose");
  const lightboxPrev    = document.getElementById("lightboxPrev");
  const lightboxNext    = document.getElementById("lightboxNext");
 
  const fadeUps = document.querySelectorAll(".fade-up");
 
  let currentIndex = 0;
 
 
  // =========================================================
  // FOOTER YEAR
  // =========================================================
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
 
 
  // =========================================================
  // MOBILE NAV
  // =========================================================
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
 
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => navMenu.classList.remove("open"));
  });
 
 
  // =========================================================
  // FLOATING HOME BUTTON
  // =========================================================
  window.addEventListener("scroll", () => {
    homeButton.classList.toggle("visible", window.scrollY > 400);
  });
 
  homeButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
 
 
  // =========================================================
  // ACTIVE NAV LINK ON SCROLL
  // =========================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
 
  function updateActiveNav() {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
 
    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }
 
  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav(); // run once on load
 
 
  // =========================================================
  // FADE-UP ANIMATIONS
  // =========================================================
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
 
 
  // =========================================================
  // MASONRY REFLOW
  // =========================================================
  function masonryReflow() {
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;
    grid.classList.add("reflow");
    requestAnimationFrame(() => grid.classList.remove("reflow"));
  }
 
 
  // =========================================================
  // GET VISIBLE ITEMS
  // =========================================================
  function getVisibleItems() {
    return Array.from(galleryItems).filter(
      item => item.style.display !== "none"
    );
  }
 
 
  // =========================================================
  // FILTERING
  // =========================================================
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");
 
      // Update active button
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
 
      // Show/hide items
      galleryItems.forEach(item => {
        const category = item.getAttribute("data-category");
        const show = filter === "all" || category === filter;
 
        item.style.display        = show ? "inline-block" : "none";
        item.style.opacity        = show ? "1" : "0";
        item.style.pointerEvents  = show ? "auto" : "none";
      });
 
      masonryReflow();
    });
  });
 
 
  // =========================================================
  // LIGHTBOX — Visible Items Only
  // =========================================================
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
    if (!visible.length) return;
 
    const item  = visible[currentIndex];
    const img   = item.querySelector("img");
    const label = item.querySelector(".photo-label");
 
    lightboxImage.src           = img.src;
    lightboxImage.alt           = img.alt;
    lightboxCaption.textContent = label ? label.textContent : "";
 
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
 
  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
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
 
  // Close on backdrop click
  lightbox.addEventListener("click", e => {
    if (e.target === lightbox) closeLightbox();
  });
 
  // Keyboard navigation
  document.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  showPrev();
    if (e.key === "ArrowRight") showNext();
  });
 
 
  // =========================================================
  // DEFAULT FILTER ON LOAD (All) — silent, no nav side-effects
  // =========================================================
  galleryItems.forEach(item => {
    item.style.display       = "inline-block";
    item.style.opacity       = "1";
    item.style.pointerEvents = "auto";
  });
 
  const defaultBtn = document.querySelector('.filter-btn[data-filter="all"]');
  if (defaultBtn) defaultBtn.classList.add("active");
 
  setTimeout(masonryReflow, 50);
 
 
  // =========================================================
  // CONTACT FORM — AJAX submission with inline confirmation
  // =========================================================
  const contactForm = document.querySelector(".contact-form");
 
  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
 
      const submitBtn = contactForm.querySelector("[type='submit']");
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;
 
      try {
        const res = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });
 
        if (res.ok) {
          contactForm.innerHTML = `
            <p style="color: var(--accent); font-weight: 600; font-size: 1.05rem; padding: 20px 0;">
              Thanks! I'll be in touch soon.
            </p>`;
        } else {
          submitBtn.textContent = "Send message";
          submitBtn.disabled = false;
          alert("Something went wrong. Please try again or email directly.");
        }
      } catch {
        submitBtn.textContent = "Send message";
        submitBtn.disabled = false;
        alert("Network error. Please check your connection and try again.");
      }
    });
  }
 
});
 

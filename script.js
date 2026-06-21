document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // ELEMENT REFERENCES
  // =========================================================
  const hamburger  = document.getElementById("hamburger");
  const navMenu    = document.getElementById("navMenu");
  const homeButton = document.getElementById("homeButton");
  const yearSpan   = document.getElementById("year");

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
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // =========================================================
  // MOBILE NAV HAMBURGER
  // =========================================================
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
      });
    });
  }

  // =========================================================
  // FLOATING HOME BUTTON
  // =========================================================
  if (homeButton) {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        homeButton.classList.add("visible");
      } else {
        homeButton.classList.remove("visible");
      }
    });

    homeButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================
  // ACTIVE NAV LINK ON SCROLL
  // =========================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  function updateActiveNav() {
    let current = "";
    sections.forEach(section => {
      if (window.pageYOffset >= section.offsetTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

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
    }, { threshold: 0.15 });

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
    grid.style.display = "none";
    requestAnimationFrame(() => { grid.style.display = ""; });
  }

  // =========================================================
  // GET VISIBLE ITEMS
  // =========================================================
  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => item.style.display !== "none");
  }

  // =========================================================
  // FILTERING
  // =========================================================
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach(item => {
        const category = item.getAttribute("data-category");
        const show = filter === "all" || category === filter;
        item.style.display       = show ? "inline-block" : "none";
        item.style.opacity       = show ? "1" : "0";
        item.style.pointerEvents = show ? "auto" : "none";
      });

      masonryReflow();
    });
  });

  // =========================================================
  // LIGHTBOX
  // =========================================================
  galleryItems.forEach(item => {
    const img = item.querySelector("img");
    if (!img) return;

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

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener("click", showPrev);
  if (lightboxNext)  lightboxNext.addEventListener("click", showNext);

  if (lightbox) {
    lightbox.addEventListener("click", e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", e => {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  showPrev();
    if (e.key === "ArrowRight") showNext();
  });

  // =========================================================
  // DEFAULT FILTER ON LOAD
  // =========================================================
  galleryItems.forEach(item => {
    item.style.display       = "inline-block";
    item.style.opacity       = "1";
    item.style.pointerEvents = "auto";
  });

  const defaultBtn = document.querySelector('.filter-btn[data-filter="portrait"]');
  if (defaultBtn) defaultBtn.classList.add("active");

  setTimeout(masonryReflow, 50);

  // =========================================================
  // CONTACT FORM
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
          contactForm.innerHTML =
            '<p style="color:var(--accent);font-weight:600;font-size:1.05rem;padding:20px 0;">Thanks! I\'ll be in touch soon.</p>';
        } else {
          submitBtn.textContent = "Send message";
          submitBtn.disabled = false;
          alert("Something went wrong. Please try again.");
        }
      } catch(err) {
        submitBtn.textContent = "Send message";
        submitBtn.disabled = false;
        alert("Network error. Please check your connection.");
      }
    });
  }

  // =========================================================
  // LOGIN MODAL (FINAL, CLEAN VERSION)
  // =========================================================
  const loginBtn      = document.getElementById("clientLoginBtn");
  const loginModal    = document.getElementById("loginModal");
  const loginClose    = document.getElementById("loginClose");
  const loginSubmit   = document.getElementById("loginSubmit");
  const loginError    = document.getElementById("loginError");
  const loginPassword = document.getElementById("loginPassword");
  const loginSpinner  = document.getElementById("loginSpinner");

  if (loginBtn && loginModal) {

    // Open modal
    loginBtn.addEventListener("click", e => {
      e.preventDefault();
      loginModal.style.display = "flex";
      loginPassword.value = "";
      loginError.style.display = "none";
      loginSpinner.style.display = "none";
      loginSubmit.disabled = false;
      loginSubmit.style.opacity = "1";
    });

    // Close modal (X)
    loginClose.addEventListener("click", () => {
      loginModal.style.display = "none";
    });

    // Close when clicking outside modal
    loginModal.addEventListener("click", e => {
      if (e.target === loginModal) {
        loginModal.style.display = "none";
      }
    });

    // Submit password
    loginSubmit.addEventListener("click", () => {
      const correctPassword = "acero";

      loginError.style.display = "none";
      loginSpinner.style.display = "block";
      loginSubmit.disabled = true;
      loginSubmit.style.opacity = "0.5";

      setTimeout(() => {
        if (loginPassword.value === correctPassword) {
          window.open(
            "https://www.dropbox.com/scl/fo/hw2t5u9iilspcdjw29h3u/ALD3ndc2ZShLDdXHNEYmDrk?rlkey=rbcl3hewwicav5f4211x0ovjw&st=9dmsj8bd&dl=0",
            "_blank"
          );
        } else {
          loginSpinner.style.display = "none";
          loginSubmit.disabled = false;
          loginSubmit.style.opacity = "1";
          loginError.style.display = "block";
        }
      }, 800);
    });

  }

});

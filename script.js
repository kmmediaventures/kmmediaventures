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
  const defaultFilter = "portrait";
 
  galleryItems.forEach(item => {
    const category = item.getAttribute("data-category");
    const show = defaultFilter === "all" || category === defaultFilter;
    item.style.display       = show ? "inline-block" : "none";
    item.style.opacity       = show ? "1" : "0";
    item.style.pointerEvents = show ? "auto" : "none";
  });
 
  const defaultBtn = document.querySelector(`.filter-btn[data-filter="${defaultFilter}"]`);
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
  // LOGIN MODAL — MULTI-CLIENT, ENCRYPTED
  // =========================================================
  //
  // Each entry below was generated by generate-client-link.html
  // (a local-only tool — never publish that file). Nobody reading
  // this source can see a password or a gallery link: the entered
  // password IS the decryption key. Wrong password = decryption
  // fails, not just a "doesn't match" comparison.
  //
  // To add a new client: run generate-client-link.html locally,
  // paste the line it gives you into this array, then push.
  // To remove a client: delete their line.
  // =========================================================
  const CLIENT_ENTRIES = [
    { salt: "L/A+NVhvt9ZKxWVtUFOU4g==", iv: "r+28IufA7DcIAC4p", data: "iu+Jv8KXkbX24PGFtNLRn0Uz5R48CdC0/D1Y4KOPm+vX8wRbXY6k5ryr2CANX4Ygj0qx5dPhqcMwU4wf/wBHrfUWU2gEYkzfsYhCRSQdnuB7L7gX7CinBA2rgkP1f6t0ApQXdNKv2w==" },
    { salt: "GL2oO6t6HukiKkGu+W2ZhA==", iv: "N7R87gN1RHnXD5/b", data: "yDV9BSiMVwDqjnm7Ax84zcniBOQgWwtVua1WaKC6AwcDGQAuTJH+x2afoN1qDbdB1yjQDhFHV3Xc" }
  ];
 
  function base64ToBuf(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  }
 
  async function deriveKey(password, saltBytes) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
      { name: "PBKDF2", salt: saltBytes, iterations: 150000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );
  }
 
  async function tryDecrypt(password, entry) {
    try {
      const salt = new Uint8Array(base64ToBuf(entry.salt));
      const iv   = new Uint8Array(base64ToBuf(entry.iv));
      const key  = await deriveKey(password, salt);
      const plainBuf = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        base64ToBuf(entry.data)
      );
      return new TextDecoder().decode(plainBuf);
    } catch (err) {
      // Wrong password (or corrupted entry) — AES-GCM auth check failed.
      return null;
    }
  }
 
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
      loginPassword.focus();
    });
 
    // Shared close logic — hides the modal and returns focus to the trigger
    function closeLoginModal() {
      loginModal.style.display = "none";
      loginBtn.focus();
    }
 
    // Close modal (X)
    loginClose.addEventListener("click", closeLoginModal);
 
    // Close when clicking outside modal
    loginModal.addEventListener("click", e => {
      if (e.target === loginModal) {
        closeLoginModal();
      }
    });
 
    // Close on Escape
    loginModal.addEventListener("keydown", e => {
      if (e.key === "Escape") closeLoginModal();
    });
 
    // Trap Tab/Shift+Tab so focus stays inside the modal while it's open
    loginModal.addEventListener("keydown", e => {
      if (e.key !== "Tab") return;
 
      const focusable = loginModal.querySelectorAll(
        'input:not([disabled]), button:not([disabled])'
      );
      if (!focusable.length) return;
 
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
 
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
 
    // Submit password
    loginSubmit.addEventListener("click", async () => {
      const entered = loginPassword.value;
 
      loginError.style.display = "none";
      loginSpinner.style.display = "block";
      loginSubmit.disabled = true;
      loginSubmit.style.opacity = "0.5";
 
      let destination = null;
      for (const entry of CLIENT_ENTRIES) {
        destination = await tryDecrypt(entered, entry);
        if (destination) break;
      }
 
      loginSpinner.style.display = "none";
      loginSubmit.disabled = false;
      loginSubmit.style.opacity = "1";
 
      if (destination) {
        window.open(destination, "_blank", "noopener");
      } else {
        loginError.style.display = "block";
      }
    });
 
    // Allow Enter key to submit
    loginPassword.addEventListener("keydown", e => {
      if (e.key === "Enter") loginSubmit.click();
    });
  }
 
});
 
 
 








document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     ELEMENT REFERENCES
     ========================================================= */
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


  /* =========================================================
     FOOTER YEAR
     ========================================================= */
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();


  /* =========================================================
     MOBILE NAV
     ========================================================= */
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


  /* =========================================================
     FLOATING HOME BUTTON
     ========================================================= */
  if (homeButton) {
    window.addEventListener("scroll", () => {
      homeButton.classList.toggle("visible", window.pageYOffset > 300);
    });

    homeButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* =========================================================
     ACTIVE NAV LINK ON SCROLL
     ========================================================= */
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
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();


  /* =========================================================
     FADE-UP ANIMATIONS
     ========================================================= */
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


  /* =========================================================
     MASONRY REFLOW
     ========================================================= */
  function masonryReflow() {
    const grid = document.querySelector(".gallery-grid");
    if (!grid) return;
    grid.style.display = "none";
    requestAnimationFrame(() => { grid.style.display = ""; });
  }


  /* =========================================================
     GET VISIBLE ITEMS
     ========================================================= */
  function getVisibleItems() {
    return Array.from(galleryItems).filter(item => item.style.display !== "none");
  }


  /* =========================================================
     FILTERING (NO "ALL" FILTER)
     ========================================================= */
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      galleryItems.forEach(item => {
        const category = item.getAttribute("data-category");
        const show = category === filter;
        item.style.display       = show ? "block" : "none";
        item.style.opacity       = show ? "1" : "0";
        item.style.pointerEvents = show ? "auto" : "none";
      });

      masonryReflow();
    });
  });


  /* =========================================================
     LIGHTBOX
     ========================================================= */
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
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  showPrev();
    if (e.key === "ArrowRight") showNext();
  });


  /* =========================================================
     DEFAULT FILTER ON LOAD (PORTRAIT)
     ========================================================= */
  const defaultBtn = document.querySelector('.filter-btn[data-filter="portrait"]');
  if (defaultBtn) defaultBtn.classList.add("active");

  galleryItems.forEach(item => {
    const category = item.getAttribute("data-category");
    const show = category === "portrait";
    item.style.display = show ? "block" : "none";
  });

  setTimeout(masonryReflow, 50);


  /* =========================================================
     CONTACT FORM
     ========================================================= */
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


  /* =========================================================
     LOGIN MODAL (UNCHANGED)
     ========================================================= */
  const CLIENT_ENTRIES = [
      { salt: "jNuSkaNp6Yfxt8NfDPszXQ==", iv: "fQBN68Izx44qf+Ll", data: "7cfjt/OhTxzwruWsB+CKDctGKSbMD7rXeasoAyd6SbABsSui3SNYJdDK+kG5NHE8uofCJs8paMic4g==" }, 
      
    

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

    loginBtn.addEventListener("click", e => {
      e.preventDefault();
      loginModal.style.display = "flex";
      loginPassword.value = "";
      loginError.style.display = "none";
      loginSpinner.style.display = "none";
      loginSubmit.disabled = false;
      loginSubmit.style.opacity = "1";
    });

    loginClose.addEventListener("click", () => {
      loginModal.style.display = "none";
    });

    loginModal.addEventListener("click", e => {
      if (e.target === loginModal) loginModal.style.display = "none";
    });

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
        window.open(destination, "_blank");
      } else {
        loginError.style.display = "block";
      }
    });

    loginPassword.addEventListener("keydown", e => {
      if (e.key === "Enter") loginSubmit.click();
    });
  }

});

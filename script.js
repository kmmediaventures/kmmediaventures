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
    hamburger.addEventListener("click", function() {
      navMenu.classList.toggle("open");
    });

    navMenu.querySelectorAll(".nav-link").forEach(function(link) {
      link.addEventListener("click", function() {
        navMenu.classList.remove("open");
      });
    });
  }

  // =========================================================
  // FLOATING HOME BUTTON
  // =========================================================
  if (homeButton) {
    window.addEventListener("scroll", function() {
      if (window.pageYOffset > 300) {
        homeButton.classList.add("visible");
      } else {
        homeButton.classList.remove("visible");
      }
    });

    homeButton.addEventListener("click", function() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // =========================================================
  // ACTIVE NAV LINK ON SCROLL (debounced)
  // =========================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  function updateActiveNav() {
    var current = "";
    sections.forEach(function(section) {
      if (window.pageYOffset >= section.offsetTop - 120) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(function(link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNav, 60);
  });
  updateActiveNav();

  // =========================================================
  // FADE-UP ANIMATIONS
  // =========================================================
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeUps.forEach(function(el) { observer.observe(el); });
  } else {
    fadeUps.forEach(function(el) { el.classList.add("visible"); });
  }

  // =========================================================
  // MASONRY REFLOW
  // =========================================================
  function masonryReflow() {
    var grid = document.querySelector(".gallery-grid");
    if (!grid) return;
    grid.style.display = "none";
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        grid.style.display = "";
      });
    });
  }

  // =========================================================
  // GET VISIBLE ITEMS
  // =========================================================
  function getVisibleItems() {
    return Array.from(galleryItems).filter(function(item) {
      return !item.classList.contains("hidden");
    });
  }

  // =========================================================
  // FILTERING (animated)
  // =========================================================
  filterButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var filter = btn.getAttribute("data-filter");

      filterButtons.forEach(function(b) { b.classList.remove("active"); });
      btn.classList.add("active");

      galleryItems.forEach(function(item) {
        var category = item.getAttribute("data-category");
        var show = filter === "all" || category === filter;
        item.classList.toggle("hidden", !show);
      });

      // After toggling hidden class, reflow masonry
      setTimeout(masonryReflow, 260);
    });
  });

  // =========================================================
  // LIGHTBOX
  // =========================================================
  galleryItems.forEach(function(item) {
    var img = item.querySelector("img");
    if (!img) return;
    img.addEventListener("click", function() {
      var visible = getVisibleItems();
      currentIndex = visible.indexOf(item);
      openLightbox();
    });
  });

  function preloadAdjacent(index) {
    const visible = getVisibleItems();
    if (!visible.length) return;
    const next = visible[(index + 1) % visible.length];
    const prev = visible[(index - 1 + visible.length) % visible.length];
    try {
      const nextSrc = next.querySelector("img").src;
      const prevSrc = prev.querySelector("img").src;
      new Image().src = nextSrc;
      new Image().src = prevSrc;
    } catch (e) {
      // ignore
    }
  }

  function openLightbox() {
    var visible = getVisibleItems();
    if (!visible.length) return;
    var item  = visible[currentIndex];
    var img   = item.querySelector("img");
    var label = item.querySelector(".photo-label");
    lightboxImage.src           = img.src;
    lightboxImage.alt           = img.alt;
    lightboxCaption.textContent = label ? label.textContent : img.alt || "";
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    preloadAdjacent(currentIndex);
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }

  function showPrev() {
    var visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (currentIndex - 1 + visible.length) % visible.length;
    openLightbox();
  }

  function showNext() {
    var visible = getVisibleItems();
    if (!visible.length) return;
    currentIndex = (currentIndex + 1) % visible.length;
    openLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener("click", showPrev);
  if (lightboxNext)  lightboxNext.addEventListener("click", showNext);

  if (lightbox) {
    lightbox.addEventListener("click", function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function(e) {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    if (e.key === "Escape")     closeLightbox();
    if (e.key === "ArrowLeft")  showPrev();
    if (e.key === "ArrowRight") showNext();
    if (e.key.toLowerCase && e.key.toLowerCase() === "x") closeLightbox();
  });

  // =========================================================
  // DEFAULT FILTER ON LOAD
  // =========================================================
  galleryItems.forEach(function(item) {
    item.classList.remove("hidden");
  });

  var defaultBtn = document.querySelector('.filter-btn[data-filter="portrait"]');
  if (defaultBtn) {
    // set portrait active after a short delay so "All" isn't stuck active
    setTimeout(function() {
      filterButtons.forEach(function(b) { b.classList.remove("active"); });
      defaultBtn.classList.add("active");
      // apply portrait filter
      filterButtons.forEach(function(b) {
        if (b.getAttribute("data-filter") === "portrait") b.click();
      });
    }, 80);
  } else {
    // ensure masonry reflow
    setTimeout(masonryReflow, 50);
  }

  // =========================================================
  // CONTACT FORM
  // =========================================================
  var contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async function(e) {
      e.preventDefault();
      var submitBtn = contactForm.querySelector("[type='submit']");
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;

      try {
        var res = await fetch(contactForm.action, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });

        if (res.ok) {
          contactForm.innerHTML = '<p style="color:var(--accent);font-weight:600;font-size:1.05rem;padding:20px 0;">Thanks! I\\'ll be in touch soon.</p>';
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
  // CLIENT PASSWORD → GOOGLE DRIVE FOLDER MAPPING
  // Replace the URLs below with your actual Google Drive folder share links.
  // Make sure each folder is set to "Anyone with the link can view".
  // =========================================================
  const clientFolders = {
    "smith2024": "https://drive.google.com/drive/folders/XXXXXXXXXXXX",
    "johnsonfam": "https://drive.google.com/drive/folders/YYYYYYYYYYYY",
    "baseball2024": "https://drive.google.com/drive/folders/ZZZZZZZZZZZZ"
    // Add more: "password": "https://drive.google.com/drive/folders/ID"
  };

  // ELEMENTS FOR PASSWORD MODAL
  const clientLoginBtn = document.getElementById("clientLoginBtn");
  const passwordModal   = document.getElementById("passwordModal");
  const clientPassword  = document.getElementById("clientPassword");
  const submitPassword  = document.getElementById("submitPassword");
  const closePassword   = document.getElementById("closePassword");
  const cancelPassword  = document.getElementById("cancelPassword");
  const toggleShow      = document.getElementById("toggleShow");
  const passwordError   = document.getElementById("passwordError");

  // OPEN MODAL
  if (clientLoginBtn) {
    clientLoginBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (!passwordModal) return;
      passwordError.textContent = "";
      clientPassword.value = "";
      passwordModal.classList.add("open");
      passwordModal.setAttribute("aria-hidden", "false");
      setTimeout(() => clientPassword.focus(), 120);
    });
  }

  // CLOSE HANDLERS
  function closePasswordModal() {
    if (!passwordModal) return;
    passwordModal.classList.remove("open");
    passwordModal.setAttribute("aria-hidden", "true");
    passwordError.textContent = "";
    clientPassword.value = "";
  }
  if (closePassword) closePassword.addEventListener("click", closePasswordModal);
  if (cancelPassword) cancelPassword.addEventListener("click", closePasswordModal);
  if (passwordModal) {
    passwordModal.addEventListener("click", function(e) {
      if (e.target === passwordModal) closePasswordModal();
    });
  }

  // TOGGLE SHOW/HIDE
  if (toggleShow) {
    toggleShow.addEventListener("click", function() {
      if (!clientPassword) return;
      if (clientPassword.type === "password") {
        clientPassword.type = "text";
        toggleShow.textContent = "Hide";
      } else {
        clientPassword.type = "password";
        toggleShow.textContent = "Show";
      }
      clientPassword.focus();
    });
  }

  // SUBMIT (click or Enter)
  async function handlePasswordSubmit() {
    if (!clientPassword) return;
    const pass = (clientPassword.value || "").trim();
    if (!pass) {
      passwordError.textContent = "Please enter a password.";
      clientPassword.focus();
      return;
    }

    // Exact match lookup
    if (clientFolders.hasOwnProperty(pass)) {
      // Optional: small UX delay
      if (submitPassword) {
        submitPassword.textContent = "Opening…";
        submitPassword.disabled = true;
      }
      // Redirect to the folder
      window.location.href = clientFolders[pass];
      return;
    }

    // Not found
    passwordError.textContent = "Incorrect password. Please try again.";
    clientPassword.focus();
  }

  if (submitPassword) submitPassword.addEventListener("click", handlePasswordSubmit);

  // Enter key support for password input
  if (clientPassword) {
    clientPassword.addEventListener("keydown", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        handlePasswordSubmit();
      }
    });
  }

});

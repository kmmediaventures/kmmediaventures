// DOM READY
document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('navMenu');
  const hamburger = document.getElementById('hamburger');
  const homeButton = document.getElementById('homeButton');
  const yearSpan = document.getElementById('year');

  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const fadeUps = document.querySelectorAll('.fade-up');

  let currentIndex = 0;
  const galleryArray = Array.from(galleryItems);

  // Set year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // MOBILE NAV TOGGLE
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close nav when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // FLOATING HOME BUTTON
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      homeButton.classList.add('visible');
    } else {
      homeButton.classList.remove('visible');
    }
  });

  homeButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // FADE-UP ANIMATION
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    fadeUps.forEach(el => observer.observe(el));
  } else {
    // Fallback: just show them
    fadeUps.forEach(el => el.classList.add('visible'));
  }

  // GALLERY FILTERING
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Active state on buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.opacity = '1';
          item.style.pointerEvents = 'auto';
          item.style.display = 'inline-block';
        } else {
          item.style.opacity = '0';
          item.style.pointerEvents = 'none';
          item.style.display = 'none';
        }
      });
    });
  });

  // LIGHTBOX OPEN
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    img.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    const item = galleryArray[currentIndex];
    const img = item.querySelector('img');
    const label = item.querySelector('.photo-label');

    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt || '';
    lightboxCaption.textContent = label ? label.textContent : '';
    lightbox.classList.add('open');
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryArray.length) % galleryArray.length;
    openLightbox();
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryArray.length;
    openLightbox();
  }

  // LIGHTBOX CONTROLS
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrev);
  lightboxNext.addEventListener('click', showNext);

  // Close on backdrop click
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
});

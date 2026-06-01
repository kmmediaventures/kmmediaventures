// ============================================
// MOBILE MENU
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Delay scroll spy update
        setTimeout(updateActiveNav, 400);
    });
});

// ============================================
// SCROLL SPY (ACTIVE NAV LINK)
// ============================================
function updateActiveNav() {
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (scrollY >= top) current = section.id;
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ============================================
// SCROLL ANIMATIONS (FADE-UP)
// ============================================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ============================================
// CONTACT FORM
// ============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();

        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;

        if (!name || !email) {
            alert('Please fill out all fields.');
            return;
        }

        alert('Thank you for reaching out! I will get back to you soon.');
        contactForm.reset();
    });
}

// ============================================
// GALLERY FILTER + LIGHTBOX
// ============================================
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

let filteredItems = [...galleryItems];
let currentIndex = 0;

// Filter logic
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        filteredItems = [...galleryItems].filter(item => {
            if (filter === 'all') {
                item.classList.remove('hidden');
                return true;
            }
            if (item.dataset.category === filter) {
                item.classList.remove('hidden');
                return true;
            }
            item.classList.add('hidden');
            return false;
        });

        attachLightboxListeners();
    });
});

// ============================================
// LIGHTBOX
// ============================================
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

function attachLightboxListeners() {
    filteredItems.forEach((item, index) => {
        item.onclick = () => {
            currentIndex = index;
            openLightbox();
        };
    });
}

attachLightboxListeners();

function openLightbox() {
    const item = filteredItems[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-overlay p');

    lightboxImage.src = img.src;
    lightboxCaption.textContent = caption.textContent;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function nextImage() {
    currentIndex = (currentIndex + 1) % filteredItems.length;
    openLightbox();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    openLightbox();
}

lightboxClose.onclick = closeLightbox;
lightboxNext.onclick = nextImage;
lightboxPrev.onclick = prevImage;

lightbox.onclick = e => {
    if (e.target === lightbox) closeLightbox();
};

// ESC key behavior
document.addEventListener('keydown', e => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        return;
    }
});

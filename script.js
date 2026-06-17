/* =========================================================
   MOBILE NAV (Hamburger Menu)
   ========================================================= */
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
});

document.addEventListener("click", (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove("open");
    }
});


/* =========================================================
   FLOATING HOME BUTTON
   ========================================================= */
const homeButton = document.getElementById("homeButton");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        homeButton.classList.add("visible");
    } else {
        homeButton.classList.remove("visible");
    }
});

homeButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});


/* =========================================================
   FADE-UP ANIMATIONS
   ========================================================= */
const fadeElements = document.querySelectorAll(".fade-up");

const fadeObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.class

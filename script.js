// -----------------------------
// FLOATING MENU TOGGLE
// -----------------------------
const menuToggle = document.getElementById("menuToggle");
const floatingMenu = document.getElementById("floatingMenu");

menuToggle.addEventListener("click", () => {
    floatingMenu.classList.toggle("open");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (!floatingMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        floatingMenu.classList.remove("open");
    }
});


// -----------------------------
// CLIENT LOGIN MODAL
// -----------------------------
const loginBtn = document.getElementById("clientLoginBtn");
const passwordModal = document.getElementById("passwordModal");
const closeModal = document.getElementById("closePasswordModal");

loginBtn.addEventListener("click", () => {
    passwordModal.style.display = "flex";
});

closeModal.addEventListener("click", () => {
    passwordModal.style.display = "none";
});

// Close modal when clicking outside the box
window.addEventListener("click", (e) => {
    if (e.target === passwordModal) {
        passwordModal.style.display = "none";
    }
});


// -----------------------------
// PASSWORD → GOOGLE DRIVE FOLDER
// -----------------------------
const clientFolders = {
    "smith2024": "https://drive.google.com/drive/folders/XXXXXXX",
    "johnsonfam": "https://drive.google.com/drive/folders/YYYYYYY",
    "baseball2024": "https://drive.google.com/drive/folders/ZZ

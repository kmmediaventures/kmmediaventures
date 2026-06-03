// Set footer year
document.getElementById("year").textContent = new Date().getFullYear();

// FILTER LOGIC
const buttons = document.querySelectorAll(".filter-buttons button");
const items = document.querySelectorAll(".gallery-item");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");

        items.forEach(item => {
            const category = item.getAttribute("data-category");

            if (filter === "all" || category === filter) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }
        });
    });
});

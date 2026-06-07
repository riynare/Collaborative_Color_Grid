const colorMenu = document.getElementById("colorMenu");
function hideColorMenu() {
    colorMenu.classList.remove("unhidden");
    colorMenu.classList.add("hidden");
}
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideColorMenu();
        window.selectedCell.style.border = "1px solid gray";
        window.selectedCell.blur();
    }
});
document.addEventListener("click", (event) => {
    if (!colorMenu.contains(event.target)) {
        hideColorMenu();
        window.selectedCell.style.border = "1px solid gray";
    }
});
colorMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    const color = event.target.dataset.color;
    window.selectedCell.style.backgroundColor = color;
    window.selectedCell.style.border = "1px solid gray";
    hideColorMenu();
});                    
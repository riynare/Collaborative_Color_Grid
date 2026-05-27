const colorMenu = document.getElementById("colorMenu");
colorMenu.addEventListener("click", (event) => {
    const color = event.target.dataset.color;
    if (!color) return;
    if (!window.selectedCell) {
        alert("Сначала выбери клетку");
        return;
    }
    window.selectedCell.style.backgroundColor = color;
    colorMenu.classList.add("hidden");
})
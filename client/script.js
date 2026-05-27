window.selectedCell = null;
const grid = document.getElementById("grid");
const size = +prompt("Введите размер окна(NxN)");
grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => {
        window.selectedCell = cell;
        colorMenu.classList.remove("hidden");
    });
    grid.append(cell);
}

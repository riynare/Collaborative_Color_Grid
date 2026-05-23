const grid = document.getElementById("grid");
const size = 20;
for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = "";
    grid.appendChild(cell);
}
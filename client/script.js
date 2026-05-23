const grid = document.getElementById("grid");
const size = +prompt("Введите размер окна(NxN)");
for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.append(cell);
}
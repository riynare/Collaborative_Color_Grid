window.selectedCell = null;
const grid = document.getElementById("grid");
const size = +prompt("Введите размер окна(NxN)");
grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", (e) => {
        if (window.selectedCell) {
            window.selectedCell.style.border = "1px solid gray";
        }
        window.selectedCell = cell;
        window.selectedCell.style.border = "2px solid black";
        colorMenu.classList.remove("hidden");
        colorMenu.classList.add("unhidden");
        colorMenu.style.left = e.pageX + "px";
        colorMenu.style.top = e.pageY + "px";
    });
    grid.append(cell);
}
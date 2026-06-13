window.selectedCell = null;
const grid = document.getElementById("grid");
const size = +prompt("Введите размер окна(NxN)");
const cellArray = [];
grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
function openMenu(cell, x, y) {
    if (window.selectedCell) {
        window.selectedCell.style.border = "1px solid gray";
    }
    window.selectedCell = cell;
    cell.style.border = "2px solid black";

    colorMenu.classList.remove("hidden");
    colorMenu.classList.add("unhidden");

    colorMenu.style.position = "fixed";
    colorMenu.style.left = `${x}px`;
    colorMenu.style.top = `${y}px`;
}
for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cellArray.push(cell);
    cell.tabIndex = 0;
    cell.addEventListener("click", (event) => {
        event.stopPropagation();
        const rect = cell.getBoundingClientRect();
        openMenu(cell, rect.right, rect.top);
    });
    cell.addEventListener("keydown", (event) => {
        let currentIndex = cellArray.indexOf(event.currentTarget);
        let newIndex = currentIndex;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            const rect = cell.getBoundingClientRect();
            openMenu(cell, rect.right, rect.top);
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            cell.blur();
            colorMenu.classList.remove("unhidden");
            colorMenu.classList.add("hidden");
            if (window.selectedCell) {
                window.selectedCell.style.border = "1px solid gray";
            }
            return;
        }

        if (event.key === "Tab") {
            if (colorMenu.classList.contains("unhidden")) {
                event.preventDefault();
                const firstColor = colorMenu.querySelector("li");
                if (firstColor) {
                    firstColor.focus();
                }
            }
            return;
        }

        switch (event.key) {
            case "ArrowUp":
                newIndex = currentIndex - size;
                break;

            case "ArrowDown":
                newIndex = currentIndex + size;
                break;

            case "ArrowRight":
                if (currentIndex % size !== size - 1) {
                    newIndex = currentIndex + 1;
                }
                break;

            case "ArrowLeft":
                if (currentIndex % size !== 0) {
                    newIndex = currentIndex - 1;
                }
                break;

            default:
                return;
        }

        event.preventDefault();

        if (newIndex >= 0 && newIndex < cellArray.length) {
            const newCell = cellArray[newIndex];
            newCell.focus();
            colorMenu.classList.remove("unhidden");
            colorMenu.classList.add("hidden");
            if (window.selectedCell) {
                window.selectedCell.style.border = "1px solid gray";
            }
        }
    });
    grid.append(cell);
};
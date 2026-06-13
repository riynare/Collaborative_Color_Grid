window.AppState = {
    selectedCell: null,
    lastPaintedCell: null,
    currentColor: "red"
};

const grid = document.getElementById("grid");
const cellArray = [];

// Validate grid size input
let size = 10;
while (true) {
    const input = prompt("Введите размер окна(NxN) (от 1 до 50):", "10");
    if (input === null) {
        break; // Default to 10 if cancelled
    }
    const val = parseInt(input, 10);
    if (!isNaN(val) && val > 0 && val <= 50) {
        size = val;
        break;
    }
    alert("Пожалуйста, введите корректное число от 1 до 50");
}

grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

// Use DocumentFragment for performance optimization
const fragment = document.createDocumentFragment();
for (let i = 0; i < size ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.tabIndex = 0;
    cellArray.push(cell);
    fragment.appendChild(cell);
}
grid.appendChild(fragment);

// Click delegation
grid.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    if (window.ColorPicker && window.ColorPicker.isOpen()) return;
    event.stopPropagation();
    window.AppState.selectedCell = cell;
    window.AppState.lastPaintedCell = cell;
    cell.style.backgroundColor = window.AppState.currentColor;
});

// Contextmenu delegation
grid.addEventListener("contextmenu", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    event.preventDefault();
    event.stopPropagation();
    if (window.ColorPicker && window.ColorPicker.isOpen()) return;
    if (window.ColorPicker) {
        window.ColorPicker.open(cell);
    }
});

// Keydown delegation
grid.addEventListener("keydown", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    const currentIndex = cellArray.indexOf(cell);
    let newIndex = currentIndex;

    if (event.key === "Enter" || event.key === " ") {
        if (window.ColorPicker && window.ColorPicker.isOpen()) return;
        event.preventDefault();
        window.AppState.selectedCell = cell;
        window.AppState.lastPaintedCell = cell;
        cell.style.backgroundColor = window.AppState.currentColor;
        return;
    }

    if (event.key.toLowerCase() === "c" || event.key === "ContextMenu") {
        if (window.ColorPicker && window.ColorPicker.isOpen()) return;
        event.preventDefault();
        if (window.ColorPicker) {
            window.ColorPicker.open(cell);
        }
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        cell.blur();
        if (window.ColorPicker) {
            window.ColorPicker.close();
        }
        return;
    }

    if (event.key === "Tab") {
        if (window.ColorPicker && window.ColorPicker.isOpen()) {
            event.preventDefault();
            const menu = document.getElementById("colorMenu");
            const firstColor = menu ? menu.querySelector("li") : null;
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
        if (window.ColorPicker) {
            window.ColorPicker.close();
        }
    }
});
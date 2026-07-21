window.AppState = {
    selectedCell: null,
    lastPaintedCell: null,
    currentColor: "red",
    size: null
};

const grid = document.getElementById("grid");
const cellArray = [];

grid.addEventListener("click", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    if (window.ColorPicker && window.ColorPicker.isOpen()) return;

    event.stopPropagation();

    window.AppState.selectedCell = cell;
    window.AppState.lastPaintedCell = cell;

    const index = cellArray.indexOf(cell);
    
    socket.emit("paint-cell", {
        index,
        color: window.AppState.currentColor
    });
});

grid.addEventListener("contextmenu", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    event.preventDefault();
    event.stopPropagation();

    if (window.ColorPicker && window.ColorPicker.isOpen()) return;

    window.ColorPicker.open(cell);
});

grid.addEventListener("keydown", (event) => {
    const cell = event.target.closest(".cell");
    if (!cell) return;

    const currentIndex = cellArray.indexOf(cell);
    let newIndex = currentIndex;

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();

        const index = cellArray.indexOf(cell);

        socket.emit("paint-cell", {
            index,
            color: window.AppState.currentColor
        });

        return;
    }

    if (event.key.toLowerCase() === "c" || event.key === "ContextMenu") {
        event.preventDefault();
        window.ColorPicker.open(cell);
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        cell.blur();
        window.ColorPicker.close();
        return;
    }

    if (event.key === "Tab") {
        if (window.ColorPicker.isOpen()) {
            event.preventDefault();

            const firstColor = document.querySelector("#colorMenu li");

            if (firstColor) {
                firstColor.focus();
            }
        }

        return;
    }

    switch (event.key) {
        case "ArrowUp":
            newIndex = currentIndex - window.AppState.size;
            break;

        case "ArrowDown":
            newIndex = currentIndex + window.AppState.size;
            break;

        case "ArrowRight":
            if (currentIndex % window.AppState.size !== window.AppState.size - 1) {
                newIndex = currentIndex + 1;
            }
            break;

        case "ArrowLeft":
            if (currentIndex % window.AppState.size !== 0) {
                newIndex = currentIndex - 1;
            }
            break;

        default:
            return;
    }

    event.preventDefault();

    if (newIndex >= 0 && newIndex < cellArray.length) {
        cellArray[newIndex].focus();
        window.ColorPicker.close();
    }
});

const logsList = document.getElementById("logsList");

function addLog(user, action, timestamp) {

    const logItem = document.createElement("div");
    logItem.className = "log-item";

    const time = timestamp
        ? new Date(timestamp).toLocaleTimeString()
        : new Date().toLocaleTimeString();

    logItem.innerHTML = `
        <span class="log-time">${time}</span>
        <span class="log-user">${user}</span>
        <span>${action}</span>
    `;

    logsList.appendChild(logItem);

    logsList.scrollTop = logsList.scrollHeight;
}
function createGrid(size) {
    window.AppState.size = size;

    grid.innerHTML = "";
    cellArray.length = 0;

    grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");

        cell.classList.add("cell");
        cell.tabIndex = 0;

        cellArray.push(cell);
        fragment.appendChild(cell);
    }

    grid.appendChild(fragment);
}
window.createGrid = createGrid;
window.cellArray = cellArray;
window.addLog = addLog;
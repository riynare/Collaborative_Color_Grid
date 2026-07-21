const colorMenu = document.getElementById("colorMenu");

window.ColorPicker = {
    open(cell) {
        if (window.AppState.selectedCell) {
            window.AppState.selectedCell.style.border = "";
        }
        window.AppState.selectedCell = cell;
        cell.style.border = "2px solid black";

        const rect = cell.getBoundingClientRect();
        colorMenu.classList.remove("hidden");
        colorMenu.classList.add("unhidden");

        colorMenu.style.position = "fixed";
        colorMenu.style.left = `${rect.right}px`;
        colorMenu.style.top = `${rect.top}px`;
    },

    close() {
        colorMenu.classList.remove("unhidden");
        colorMenu.classList.add("hidden");
        if (window.AppState.selectedCell) {
            window.AppState.selectedCell.style.border = "";
        }
    },

    isOpen() {
        return colorMenu.classList.contains("unhidden");
    }
};

// Document click to close menu
document.addEventListener("click", (event) => {
    if (!colorMenu.contains(event.target)) {
        window.ColorPicker.close();
    }
});

// Color menu choice click
colorMenu.addEventListener("click", (event) => {
    event.stopPropagation();
    const target = event.target.closest("[data-color]");
    if (!target) return;
    const color = target.dataset.color;
    window.AppState.currentColor = color;
    if (window.AppState.selectedCell) {

        window.AppState.lastPaintedCell = window.AppState.selectedCell;

        const index = window.cellArray.indexOf(window.AppState.selectedCell);

        window.socket.emit("paint-cell", {
            index,
            color
        });
    }
    window.ColorPicker.close();
});

// Color menu navigation / options selection
colorMenu.addEventListener("keydown", (event) => {
    const listItems = Array.from(colorMenu.querySelectorAll("li"));
    const currentIndex = listItems.indexOf(document.activeElement);

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        const color = document.activeElement ? document.activeElement.dataset.color : null;
        if (color && window.AppState.selectedCell) {
            window.AppState.currentColor = color;
            window.AppState.lastPaintedCell = window.AppState.selectedCell;

            const index = window.cellArray.indexOf(window.AppState.selectedCell);

            window.socket.emit("paint-cell", {
                index,
                color
            });
            window.ColorPicker.close();
            window.AppState.selectedCell.focus();
        }
    } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        window.ColorPicker.close();
        if (window.AppState.selectedCell) {
            window.AppState.selectedCell.focus();
        }
    } else if (event.key === "Tab") {
        if (event.shiftKey) {
            if (currentIndex === 0) {
                event.preventDefault();
                if (window.AppState.selectedCell) {
                    window.AppState.selectedCell.focus();
                }
            }
        } else {
            if (currentIndex === listItems.length - 1) {
                event.preventDefault();
                listItems[0].focus();
            }
        }
    } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % listItems.length;
        listItems[nextIndex].focus();
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        event.preventDefault();
        const prevIndex = (currentIndex - 1 + listItems.length) % listItems.length;
        listItems[prevIndex].focus();
    }
});

// Global key handler for 'C' when no cell is focused
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() !== "c" && event.key !== "ContextMenu") return;
    
    const focused = document.activeElement;
    if (focused && focused.classList.contains("cell")) return;
    if (colorMenu.contains(focused)) return;
    
    if (window.AppState.lastPaintedCell) {
        event.preventDefault();
        window.ColorPicker.open(window.AppState.lastPaintedCell);
    }
});
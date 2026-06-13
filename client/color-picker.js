const colorMenu = document.getElementById("colorMenu");
function hideColorMenu() {
    colorMenu.classList.remove("unhidden");
    colorMenu.classList.add("hidden");
}
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

colorMenu.addEventListener("keydown", (event) => {
    const listItems = Array.from(colorMenu.querySelectorAll("li"));
    const currentIndex = listItems.indexOf(document.activeElement);

    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        const color = document.activeElement ? document.activeElement.dataset.color : null;
        if (color && window.selectedCell) {
            window.selectedCell.style.backgroundColor = color;
            window.selectedCell.style.border = "1px solid gray";
            hideColorMenu();
            window.selectedCell.focus();
        }
    } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        hideColorMenu();
        if (window.selectedCell) {
            window.selectedCell.style.border = "1px solid gray";
            window.selectedCell.focus();
        }
    } else if (event.key === "Tab") {
        if (event.shiftKey) {
            if (currentIndex === 0) {
                event.preventDefault();
                if (window.selectedCell) {
                    window.selectedCell.focus();
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
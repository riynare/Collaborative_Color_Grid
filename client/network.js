console.log("network.js загружен");

const socketClient = window.socket;

console.log("socketClient в network:", socketClient);

socketClient.on("cell-painted", ({ index, color, user }) => {
    const cell = document.querySelectorAll(".cell")[index];

    if (!cell) {
        return;
    }

    cell.style.backgroundColor = color;

    addLog(user, `покрасил клетку ${index}`);
});

socketClient.on("request-size", () => {
    let size;

    while (true) {
        const input = prompt("Введите размер поля (от 1 до 50):", "10");

        if (input === null) {
            continue;
        }

        size = Number(input);

        if (Number.isInteger(size) && size >= 1 && size <= 50) {
            break;
        }

        alert("Введите число от 1 до 50.");
    }

    socketClient.emit("set-size", {
        size
    });
});

socketClient.on("sync-state", ({ size, field, logs }) => {

    window.createGrid(size);

    field.forEach((color, index) => {
        window.cellArray[index].style.backgroundColor = color;
    });

    logs.forEach(log => {
        addLog(log.user, log.message, log.time);
    });

});

socket.on("new-log", ({ user, message, time }) => {
    addLog(user, message, time);
});
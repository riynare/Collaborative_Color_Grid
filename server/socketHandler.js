console.log("socketHandler загружен");
const crypto = require("crypto");
const state = require("./state");
function setupSocket(io) {
    io.on("connection", (socket) => {
        console.log("Новое подключение", socket.id);

        socket.on("join", ({ userId, name }) => {

            let user;

            if (userId && state.users.has(userId)) {

                user = state.users.get(userId);

                console.log(
                    "Вернулся:",
                    user.name
                );

            } else {

                if (typeof name !== "string") {
                    return;
                }

                name = name.trim();

                if (
                    name.length === 0 ||
                    name.length > 20
                ) {
                    return;
                }

                userId = crypto.randomUUID();

                user = {
                    id: userId,
                    name
                };

                state.users.set(
                    userId,
                    user
                );

                const log = {

                    type: "join",
                    user: user.name,
                    message: "подключился",
                    time: Date.now()

                };

                state.logs.push(log);

                socket.broadcast.emit("new-log", {

                    user: log.user,
                    message: log.message,
                    time: log.time

                });

            }

            state.sockets.set(
                socket.id,
                userId
            );
            const timer = state.disconnectTimers.get(userId);

            if (timer) {
                clearTimeout(timer);
                state.disconnectTimers.delete(userId);
            }

            socket.emit("user-id", {
                userId
            });

        if (state.size === null) {

            console.log("Отправляем request-size");

            socket.emit("request-size");

        } else {

            console.log("Отправляем sync-state");

            socket.emit("sync-state", {
                size: state.size,
                field: state.field,
                logs: state.logs
            });

        }

    });

        socket.on("set-size", ({ size }) => {

            if (state.size !== null) {
                return;
            }

            if (!Number.isInteger(size)) {
                return;
            }

            if (size < 1 || size > 50) {
                return;
            }

            state.size = size;

            state.field = Array(size * size).fill("white");

            io.emit("sync-state", {
                size: state.size,
                field: state.field,
                logs: state.logs
            });

        });
        socket.on("paint-cell", ({ index, color }) => {

            if (state.size === null) {
                return;
            }

            if (!Number.isInteger(index)) {
                return;
            }

            if (index < 0 || index >= state.field.length) {
                return;
            }


            const allowedColors = [
                "red",
                "green",
                "blue",
                "yellow",
                "orange",
                "black",
                "purple",
                "pink",
                "aqua"
            ];


            if (!allowedColors.includes(color)) {
                return;
            }


            const userId = state.sockets.get(socket.id);

            const user = state.users.get(userId);


            if (!user) {
                return;
            }


            state.field[index] = color;


            const paintLog = {
                type: "paint",
                user: user.name,
                message: `покрасил клетку ${index}`,
                time: Date.now()
            };
            
            state.logs.push(paintLog);

            io.emit("cell-painted", {
                index,
                color,
                user: user.name
            });
        });

        socket.on("disconnect", () => {

            const userId = state.sockets.get(socket.id);

            if (!userId) {
                return;
            }

            const user = state.users.get(userId);

            if (!user) {
                return;
            }

            state.sockets.delete(socket.id);

            const timer = setTimeout(() => {

                for (const id of state.sockets.values()) {

                    if (id === userId) {
                        return;
                    }

                }

                const log = {

                    type: "disconnect",
                    user: user.name,
                    message: "отключился",
                    time: Date.now()

                };

                state.logs.push(log);

                io.emit("new-log", {

                    user: log.user,
                    message: log.message,
                    time: log.time

                });

            }, 5000);

            state.disconnectTimers.set(
                userId,
                timer
            );

        });
    });
}
module.exports = setupSocket;


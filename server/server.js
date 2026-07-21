const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const setupSocket = require("./socketHandler");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(
    express.static(
        path.join(__dirname, "../client")
    )
);

setupSocket(io);

server.listen(3000, () => {
    console.log("Сервер запущен на http://localhost:3000");
});
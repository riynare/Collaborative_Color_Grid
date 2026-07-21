const socket = io();

window.socket = socket;

let userId = sessionStorage.getItem("userId");

let userName = null;

console.log("userId из sessionStorage:", userId);

if (!userId) {

    userName = prompt("Введите имя");

    console.log("Введено имя:", userName);
}

socket.emit("join", {
    userId,
    name: userName
});

socket.on("user-id", ({ userId }) => {

    sessionStorage.setItem(
        "userId",
        userId
    );

});
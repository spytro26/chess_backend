"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const GameManager_1 = require("./GameManager");
const ws = new ws_1.WebSocketServer({ port: 8080 });
const gameManager = new GameManager_1.GameManager();
ws.on("connection", (socket) => {
    gameManager.addUser(socket);
    socket.on("disconnect", () => gameManager.removeUser(socket));
});
console.log("compile ho gya yrr");

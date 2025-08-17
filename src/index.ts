import { WebSocketServer } from "ws";
import { GameManager } from "./GameManager";
const ws = new WebSocketServer({port : 8080});
const gameManager = new GameManager();

ws.on("connection", (socket)=>{
    gameManager.addUser(socket);
    socket.on("disconnect", ()=>gameManager.removeUser(socket));
});

console.log("compile ho gya yrr");
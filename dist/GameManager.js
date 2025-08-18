"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameManager = void 0;
const messages_1 = require("./messages");
const Game_1 = require("./Game");
class GameManager {
    constructor() {
        this.games = [];
        this.pendinguser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addhandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((socke) => socke !== socket);
    }
    addhandler(socket) {
        socket.on("message", (even) => {
            const lung = even.toString();
            const message = JSON.parse(lung);
            if (message.type === messages_1.INIt_GAME) {
                if (this.pendinguser && this.pendinguser != socket) {
                    const game = new Game_1.Game(this.pendinguser, socket);
                    this.games.push(game);
                    this.pendinguser = null;
                    console.log("the user is   " + socket + "paired with" + this.pendinguser);
                    console.log("the array is " + this.users);
                }
                else {
                    this.pendinguser = socket;
                }
            }
            if (message.type === messages_1.MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("move is ", message.payload);
                    game.makeMove(socket, message.payload.move);
                }
            }
            if (message.type == 'promote') {
                console.log("type promote detected in backend");
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("find the game");
                    console.log(message.payload.move);
                    game.doPromote(socket, message.payload.move, message.piece);
                }
            }
        });
    }
}
exports.GameManager = GameManager;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.totalmoves = 0;
        this.player1 = player1;
        this.player2 = player2;
        // console.log("inside the game.ts", this.player1, "and", this.player2);
        // console.log("inside the game.ts" + this.player1 + 'and' + this.player2);
        this.board = new chess_js_1.Chess;
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: messages_1.INIt_GAME,
            payload: {
                color: "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type: messages_1.INIt_GAME,
            payload: {
                color: "black"
            }
        }));
    }
    makeMove(socket, move) {
        console.log(move + "was move");
        const currentTurn = this.board.turn(); // "w" for white, "b" for black
        // Enforce turn-based moves:
        if ((currentTurn === "w" && socket !== this.player1) ||
            (currentTurn === "b" && socket !== this.player2)) {
            console.log("Not your turn!");
            return;
        }
        try {
            console.log("move request", move);
            this.board.move(move);
            this.totalmoves++;
        }
        catch (e) {
            console.log("erro occuerd while moving");
            return;
            this.totalmoves--;
        }
        if (this.board.isGameOver()) {
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            this.player1.send(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white"
                }
            }));
            return;
        }
        if (this.totalmoves % 2 === 0) {
            console.log("move send to user 1");
            this.player1.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
        else {
            console.log("move send to user 2");
            this.player2.send(JSON.stringify({
                type: messages_1.MOVE,
                payload: move
            }));
        }
    }
}
exports.Game = Game;

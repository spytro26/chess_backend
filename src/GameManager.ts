import { WebSocket } from "ws"
import { INIt_GAME, MOVE } from "./messages"
import { Game } from "./Game";



export class GameManager{
    private games : Game[];
    private pendinguser : WebSocket | null;
    private users : WebSocket[];
    constructor(){
        this.games = [];
        this.pendinguser = null;
        this.users = [];

    }
    addUser (socket : WebSocket){
        this.users.push(socket);    
        this.addhandler(socket);

    }
    removeUser (socket : WebSocket){
        this.users = this.users.filter((socke)=>socke !== socket);

    }

    addhandler (socket : WebSocket){
        socket.on("message" , (even)=>{
            const lung = even.toString();
            const message = JSON.parse(lung);
            if(message.type === INIt_GAME){


                if(this.pendinguser && this.pendinguser != socket){
                    const game  = new Game(this.pendinguser , socket);
                    this.games.push(game);
                    this.pendinguser= null;
                    console.log("the user is   " + socket + "paired with" + this.pendinguser);
                    console.log("the array is " + this.users);

                }
                else{
                    this.pendinguser=socket;
                }


            }
            if(message.type ===MOVE){
                const game = this.games.find(game => game.player1 ===socket  || game.player2 ===socket);
                if (game){
                    console.log("move is " , message.payload);
                    game.makeMove(socket , message.payload.move);
                }


            }
            if(message.type=='promote'){
                console.log("type promote detected in backend");
                 const game = this.games.find(game => game.player1 ===socket  || game.player2 ===socket);
                if (game){
                    console.log("find the game");
                    console.log(message.payload.move);

                    game.doPromote(socket,message.payload.move, message.piece);
                }

            }

        })

    }
}
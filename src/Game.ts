import { Chess } from "chess.js";
import { WebSocket } from "ws";
import { GAME_OVER, INIt_GAME, MOVE } from "./messages";
export class Game {
    public player2 : WebSocket 
    public player1 : WebSocket 
    public board : Chess
    private startTime   : Date ;
    private totalmoves  = 0; 

    constructor(player1 : WebSocket , player2 : WebSocket){
        this.player1 = player1;
        this.player2 = player2;
       // console.log("inside the game.ts", this.player1, "and", this.player2);

       // console.log("inside the game.ts" + this.player1 + 'and' + this.player2);
       this.board = new Chess;
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type : INIt_GAME,
            payload : {
                color : "white"
            }
        }));
        this.player2.send(JSON.stringify({
            type : INIt_GAME,
            payload : {
                color : "black"
            }
        }));
         



    }
    makeMove (socket  : WebSocket , move : {
        from   : string , 
        to : string
    }) {
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

            this.board.move(move)
            this.totalmoves++;
            
        }catch(e){
            console.log("erro occuerd while moving")
            return ; 
            this.totalmoves--;
        }
        
       

        if(this.totalmoves%2 ===0 ){
            console.log("move send to user 1")
            this.player1.send(JSON.stringify({
                type : MOVE,
                payload : move
            }))
        }
        else {
            console.log("move send to user 2");
            this.player2.send(JSON.stringify({
                type : MOVE , 
                payload : move

            }))
        }


         if(this.board.isGameOver()){
                this.player1.send(JSON.stringify({
                    type : GAME_OVER,
                    payload : {
                        winner : this.board.turn()==="w"  ? "b"  : "w"
                    }
                }));


                this.player2.send(JSON.stringify({
                    type : GAME_OVER,
                    payload : {
                        winner : this.board.turn()==="w"  ? "b"  : "w"
                    }
                }));

                return ; 

        }

            
        


    }

doPromote (socket : WebSocket,promote : {from : any , to : any , square : any }, pawn  : any ){
 const currentTurn = this.board.turn(); // "w" for white, "b" for black

  // Enforce turn-based moves:
  if ((currentTurn === "w" && socket !== this.player1) ||
      (currentTurn === "b" && socket !== this.player2)) {
    console.log("Not your turn!");
    return;
  }
    console.log(promote.from);
    console.log(promote.to);
    console.log(pawn);
    try {
        this.totalmoves++;
      this.board.move({
  from: promote.from,
  to: promote.to,
  promotion: pawn, // "q" | "r" | "n" | "b"
});
    }catch(e){
        console.log("error aa gya yrr durign promotion");
        this.totalmoves--;
        return ; 

    }


console.log("type promote running babe");


    
        if(this.totalmoves%2 ===0 ){
            console.log("move send to user 1")
            this.player1.send(JSON.stringify({
                type : "promote",
                payload : promote,
                pawn
            }))
        }
        else {
            console.log("move send to user 2");
            this.player2.send(JSON.stringify({
                type : "promote" , 
                payload : promote,
                pawn,

            }))
        }


 
         if(this.board.isGameOver()){
                this.player1.send(JSON.stringify({
                    type : GAME_OVER,
                    payload : {
                        winner : this.board.turn()==="w"  ? "b"  : "w"
                    }
                }));


                this.player2.send(JSON.stringify({
                    type : GAME_OVER,
                    payload : {
                        winner : this.board.turn()==="w"  ? "b"  : "w"
                    }
                }));

                return ; 

        }


}
}
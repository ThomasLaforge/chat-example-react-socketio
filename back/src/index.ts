import "dotenv/config";
import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});

let players = [];
let debutPartie: number | null = null;
let randomNumber = Math.floor(Math.random() * 100) + 1;

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  players.push(socket.id);
  console.log(players.length)
  
  if(players.length === 3){
    console.log('start game')
    io.emit('startGame');
    debutPartie = Date.now();
  }

  socket.on('guessNumber', (num: number) => {
    if(num < randomNumber){
      socket.emit('hint', 'Try higher');
    }
    else if(num > randomNumber){
      socket.emit('hint', 'Try lower');
    }
    else {
      const deltaTime = Date.now() - (debutPartie as number);
      io.emit('endGame', 'la partie est terminée. Le socket id gagnant est : ' + socket.id + ' ! il a gagné en ' + deltaTime + ' ms');
    }
  });

});

httpServer.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
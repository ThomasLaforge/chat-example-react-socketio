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

let players: string[] = [];
let grid : (null | 'X' | 'O')[][] = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);
  players.push(socket.id);
  
  if(players.length === 2){
    socket.emit('startGame', true);
    socket.broadcast.emit('startGame', false);
  }

  socket.on('play', (i: number, j: number) => {
    const isFirstPlayer = players[0] === socket.id;

    grid[i][j] = isFirstPlayer ? 'X' : 'O';
    
    socket.emit('played', [...grid], false);
    socket.broadcast.emit('played', [...grid], true);
    
    if(checkWin()){
      socket.emit('win');
      socket.broadcast.emit('lost');
    }
  });

});

function checkWin(){
  for(let i = 0; i < 3; i++){
    if(grid[i][0] && grid[i][0] === grid[i][1] && grid[i][0] === grid[i][2]){
      return true;
    }
    if(grid[0][i] && grid[0][i] === grid[1][i] && grid[0][i] === grid[2][i]){
      return true;
    }
  }
  if(grid[0][0] && grid[0][0] === grid[1][1] && grid[0][0] === grid[2][2]){
    return true;
  }
  if(grid[0][2] && grid[0][2] === grid[1][1] && grid[0][2] === grid[2][0]){
    return true;
  }
  return false;
}

httpServer.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
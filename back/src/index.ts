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

let lastSocketId: string = '';

io.on('connection', (socket) => {
  console.log('a user connected');
  lastSocketId = socket.id;

  socket.on('chat message', (msg) => {
    console.log('every body message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('send-others-a-message', (msg) => {
    console.log('others - message: ' + msg);
    socket.broadcast.emit('chat message', msg);
  })

  socket.on('send-to-last-socket', (msg) => {
    if(lastSocketId !== ''){
      console.log('last socket - message: ' + msg);
      io.to(lastSocketId).emit('chat message', msg);
    }
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

httpServer.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`)
});
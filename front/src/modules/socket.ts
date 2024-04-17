import io from 'socket.io-client';
const URL = 'http://localhost:1337';

export const socket = io(URL);
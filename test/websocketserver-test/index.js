import { createServer } from 'http';
import { Server } from 'socket.io';

import { dispatchChatEvent } from './socketserver_io_chat.js';

const WEB_URL = "http://127.0.0.1:5500";
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: WEB_URL,
        methods: ['GET', 'POST']
    }
});

const chatServer = io.of('/chat');

httpServer.listen(3000, () => {
    console.log("connected port 3000");
})

io.on("connection", socket => {
    console.log("connected client by Socket.io");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (data) => {
        io.emit('message', data);
    })
});

chatServer.on('connection', (socket) => {
    dispatchChatEvent(chatServer, socket);
});
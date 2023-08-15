import { createServer } from 'http';
import { Server } from 'socket.io';

import { dispatchChatEvent } from './socketserver_io_chat.js';
import { dispatchScoreEvent } from './socketserver_io_score.js';
import { dispatchMusicEvent } from "./socketserver_io_music.js";
import { dispatchSyncEvent } from "./socketserver_io_sync.js";

// 서버 설정 및 생성
const WEB_URL = "http://127.0.0.1:5500";    // CORS Origins URL
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: WEB_URL,
        methods: ['GET', 'POST']
    }
});

// 서버 분기: 해당 Path로 연결을 시도하는 경우, 해당 분기 서버로 할당
const chatServer = io.of('/chat');      // 해당 '/chat' Path로 연결
const scoreServer = io.of('/score');    // 해당 '/score' Path로 연결
const musicServer = io.of('/music');    // 해당 '/score' Path로 연결
const syncServer = io.of('/sync');      // 해당 '/score' Path로 연결

// Http Server 포트 3000번 사용
httpServer.listen(3000, () => {
    console.log("Listening on port 3000");
})

// Socket.io Server(Main Server) connection 발생 시,
io.on('connection', socket => {
    console.log("Client connected to the Socket.io Server");

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Chat Server에 connection 발생 시,
chatServer.on('connection', (socket) => {
    dispatchChatEvent(chatServer, socket);
});

// Score Server에 connection 발생 시,
scoreServer.on('connection', (socket) => {
    dispatchScoreEvent(scoreServer, socket);
});

// Music Server에 connection 발생 시,
musicServer.on('connection', (socket) => {
    dispatchMusicEvent(musicServer, socket);
});

// Sync Server에 connection 발생 시,
syncServer.on('connection', (socket) => {
    dispatchSyncEvent(syncServer, socket);
});
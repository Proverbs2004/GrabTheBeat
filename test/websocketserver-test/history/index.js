import { createServer } from 'http';
import { parse } from 'url';
// import { dispatchSocketServer } from './socketserver.js';
import { dispatchChatServer } from './socketserver-chat.js';
import { dispatchScoreServer } from './socketserver-score.js';

// http 서버 생성
const chatServer = createServer();

chatServer.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    // '/' 제거하여 code 추출
    const code = pathname.slice(1);

    // code와 일치하는 WebSocketServer
    const wss = dispatchChatServer(code);
    if (wss !== null && wss !== undefined) {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            // connection 이벤트 수행
            wss.emit('connection', ws, request);
        })
    } else {
        socket.destroy();
    }
});

chatServer.

// 클라이언트 요청 준비
chatServer.listen(8000, () => {
    console.log(`Server Listening on port 8000 - Chatting Server`)
})


// http 서버 생성
const scoreServer = createServer();

scoreServer.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    // '/' 제거하여 code 추출
    const code = pathname.slice(1);

    // code와 일치하는 WebSocketServer
    const wss = dispatchScoreServer(code);
    if (wss !== null && wss !== undefined) {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            // connection 이벤트 수행
            wss.emit('connection', ws, request);
        })
    } else {
        socket.destroy();
    }
    
});

// 클라이언트 요청 준비
scoreServer.listen(8001, () => {
    console.log(`Server Listening on port 8001 - Score Server`)
})
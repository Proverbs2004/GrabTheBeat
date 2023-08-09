import { createServer } from 'http';
import { parse } from 'url';
import { dispatchSocketServer } from './socketserver-util.js';

// http 서버 생성
const server = createServer();

server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    // '/' 제거하여 code 추출
    const code = pathname.slice(1);

    // code와 일치하는 WebSocketServer
    const wss = dispatchSocketServer(code);
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
server.listen(8000, () => {
    console.log(`Server Listening on port 8000`)
})
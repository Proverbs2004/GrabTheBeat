import WebSocket from 'ws';
import { WebSocketServer } from 'ws';

let webSocketServerList = [];

// WebSocketServer 객체 생성.
export function createSocketServer(code) {
    const wss = new WebSocketServer({ noServer: true });

    // 'connection' 이벤트 발생 시, 수행 할 콜백 함수 매핑
    wss.on('connection', function connection(ws) {
        ws.on('error', console.error);
    
        // 유저 접속
        if (ws.readyState === ws.OPEN) {
            const size = wss.clients.size;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`새로운 유저 접속 [현재: ${size}명]`);
                }
            })
        }
    
        // 메시지 전송
        ws.on('message', (data, isBinary) => {
            console.log(`Received from client: ${data}`)
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(data, { binary: isBinary });
                }
            })
        });
    
        // 접속 해제
        ws.on('close', () => {
            const size = wss.clients.size;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(`유저 연결 해제 [현재: ${size}명]`);
                }
            })
        })
    })

    // WebSocketServer 리스트에 WebSocketServer 추가
    webSocketServerList.push({
        serverId: code,
        webSocketServer: wss
    });
    
    return wss;
}

// WebSocketServer 객체 제거.
export function removeSocketServer(code) {
    webSocketServerList = webSocketServerList.filter(wss => wss.serverId !== code);
}

// 특정 WebSocketServer 객체 반환.
export function dispatchChatServer(code) {
    // 탐색에 성공한 경우, 기존 WebSocketServer 객체 반환.
    // 탐색에 실패한 경우, 새로운 WebSocketServer 객체 반환.

    let wss = null;
    // webSocketServerList가 비어있으면?
    if (Array.isArray(webSocketServerList) && webSocketServerList.length === 0) {
        wss = createSocketServer(code);

        return wss;
    }

    const wssList = webSocketServerList.filter(wss => wss.serverId === code);
    // 조회 결과가 없다면?
    if (Array.isArray(wssList) && wssList.length === 0) {
        wss = createSocketServer(code);

    // 조회 결과가 있다면?
    } else {
        wss = wssList[0].webSocketServer;
    }

    return wss;
}
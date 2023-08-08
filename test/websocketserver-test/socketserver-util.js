import WebSocketServer from 'ws';

let socketServerList = [];

// WebSocketServer 객체 생성.
export function createSocketServer(sessionId) {
    console.log("세션 생성 시작");
    socketServerList.push({
        sessionId: sessionId,
        socketServer: new WebSocketServer({ noServer: true })
    });
    console.log("세션 생성 완료");
}

// WebSocketServr 객체 제거.
export function removeSocketServer(sessionId) {
    socketServerList = socketServerList.filter(serverInfo => serverInfo.sessionId !== sessionId);
}

// WebSocketServer 객체 리스트를 반환.
export function getSocketServerList() {
    return socketServerList;
}

// 특정 WebSocketServer 객체 반환.
export function dispatchSocketServer(sessionId) {
    // 탐색에 성공한 경우, WebSocketServer 객체 반환.
    // 탐색에 실패한 경우, undefined 반환?
    let socketServer = socketServerList.filter(serverInfo => serverInfo.sessionId === sessionId)[0].socketServer;

    // 해당 sessionId와 일치하는 WebSocketServer가 존재하지 않는 경우, 자동적으로 WebSocketServer를 생성.
    if (socketServer === null || socketServer === undefined) {
        console.log("세션 생성 전");
        socketServer = createSocketServer(sessionId);
        console.log("세션 생성 후");
    }

    return socketServer;
}
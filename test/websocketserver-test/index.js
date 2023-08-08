const express = require("express")
const { WebSocketServer } = require("ws")
const WebSocket = require("ws")
const app = express()

app.use(express.static("front"))

app.listen(8000, () => {
    console.log(`Server Listening on port 8000`)
})

const wss = new WebSocketServer({ port: 8001 })

wss.on('connection', ws => {
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
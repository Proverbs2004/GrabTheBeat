// const WebSocket = require('ws')
// const { WebSocketServer } = require('ws');
// const { createServer } = require('http');
// const { parse } = require('url');
// const { dispatchSocketServer } = require('./socketserver-util');

import WebSocket from 'ws';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { parse } from 'url';
import { dispatchSocketServer } from './socketserver-util.js';

const server = createServer();
let wss = new WebSocketServer({ noServer: true });
// const wss1 = new WebSocketServer({ noServer: true });
// const wss2 = new WebSocketServer({ noServer: true });

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

// wss1.on('connection', function connection(ws) {
//     ws.on('error', console.error);

//     // 유저 접속
//     if (ws.readyState === ws.OPEN) {
//         const size = wss1.clients.size;
//         wss1.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(`새로운 유저 접속 [현재: ${size}명]`);
//             }
//         })
//     }

//     // 메시지 전송
//     ws.on('message', (data, isBinary) => {
//         console.log(`Received from client: ${data}`)
//         wss1.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(data, { binary: isBinary });
//             }
//         })
//     });

//     // 접속 해제
//     ws.on('close', () => {
//         const size = wss1.clients.size;
//         wss1.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(`유저 연결 해제 [현재: ${size}명]`);
//             }
//         })
//     })
// })

// wss2.on('connection', function connection(ws) {
//     ws.on('error', console.error);

//     // 유저 접속
//     if (ws.readyState === ws.OPEN) {
//         const size = wss2.clients.size;
//         wss2.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(`새로운 유저 접속 [현재: ${size}명]`);
//             }
//         })
//     }

//     // 메시지 전송
//     ws.on('message', (data, isBinary) => {
//         console.log(`Received from client: ${data}`)
//         wss2.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(data, { binary: isBinary });
//             }
//         })
//     });

//     // 접속 해제
//     ws.on('close', () => {
//         const size = wss2.clients.size;
//         wss2.clients.forEach((client) => {
//             if (client.readyState === WebSocket.OPEN) {
//                 client.send(`유저 연결 해제 [현재: ${size}명]`);
//             }
//         })
//     })
// });


server.on('upgrade', function upgrade(request, socket, head) {
    const { pathname } = parse(request.url);
    // '/' 제거
    const code = pathname.slice(1);

    wss = dispatchSocketServer(code);
    if (wss !== null && wss !== undefined) {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        })
    } else {
        socket.destroy();
    }

    // if (pathname === '/foo') {
    //     wss1.handleUpgrade(request, socket, head, function done(ws) {
    //         wss1.emit('connection', ws, request);
    //     });
    // } else if (pathname === '/bar') {
    //     wss2.handleUpgrade(request, socket, head, function done(ws) {
    //         wss2.emit('connection', ws, request);
    //     });
    // } else {
    //     socket.destroy();
    // }
});

server.listen(8000, () => {
    console.log(`Server Listening on port 8000`)
})
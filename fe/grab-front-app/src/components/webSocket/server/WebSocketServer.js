const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();


const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(server);
    console.log('Received:', message);
    const parsedMessage = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(8003, () => {
  console.log('WebSocket server listening on port 8003');
});


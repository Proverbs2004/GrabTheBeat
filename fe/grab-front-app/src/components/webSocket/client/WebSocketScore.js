import { useState } from 'react';
import { io } from 'socket.io-client';

function WebSocketScore(scoreSocket, userName, score) {
    const [clients, setClients] = useState([]);

    // const scoreSocket = io("http://localhost:8000/score", {
    //     query: {
    //         roomId: roomId,
    //     },
    // });

    scoreSocket.on("join", (data) => {
        setClients(data);
    });

    scoreSocket.on("score", (data) => {
        setClients(data);
    });

    scoreSocket.emit("join", {
        userName: userName,
    });

    setInterval(() => {
        scoreSocket.emit("score", {
            score: score,
        });
    }, 1000);

    return (
        <div>
            <li></li>
        </div>
    );

}
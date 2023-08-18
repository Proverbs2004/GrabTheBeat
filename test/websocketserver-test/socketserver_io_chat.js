let roomInfo = {};

export function dispatchChatEvent(server, socket) {
    /**
     * headers: /* the headers of the initial request
     * query: /* the query params of the initial request
     * auth: /* the authentication payload
     * time: /* the date of creation (as string)
     * issued: /* the date of creation (unix timestamp)
     * url: /* the request URL string
     * address: /* the ip of the client
     * xdomain: /* whether the connection is cross-domain
     * secure: /* whether the connection is secure
     */

    const clientId = socket.id;             // 클라이언트의 고유한 id
    const query = socket.handshake.query;   // URI의 쿼리 파라미터 값
    const roomId = query.roomId;            // 쿼리 파라미터의 roomId
    console.log(`Client(${clientId}) connected to Chat Server(${roomId})`);

    if (!roomInfo[roomId]) {
        roomInfo[roomId] = {
            clients: [],
        };
    }

    // 방이 꽉 차 있는 경우, 방에 참가하지 못하도록 함
    if (roomInfo[roomId].clients.length >= 4) {
        return;
    }

    // 연결
    socket.join(roomId);

    roomInfo[roomId].clients.push({
        clientId: clientId,
    });

    // message라는 이벤트가 발생하면
    // message라는 이벤트를 방 내에 있는 모든 클라이언트에게 전달.
    /**
     * on (input)
     * data: {
     *     userName: 플레이어의 이름
     *     message: 메시지 내용
     * }
     * 
     * emit (output)
     * data: {
     *     userName: 플레이어의 이름
     *     message: 메시지 내용
     * }
     */
    socket.on('message', (data) => {
        server.to(roomId).emit('message', data);
    });

    // 연결 해제
    socket.on('disconnect', () => {
        // 방 정보 데이터에서 client 정보 제거
        roomInfo[roomId].clients =
            roomInfo[roomId].clients
                .filter((client) => client.clientId !== clientId);
        // 모든 클라이언트가 나가면, 방 정보 데이터 삭제
        if (roomInfo[roomId].clients.length === 0)
            delete roomInfo[roomId];

        console.log(`Client(${clientId}) disconnected to Chat Server(${roomId})`);
        socket.leave(roomId);
    });
}
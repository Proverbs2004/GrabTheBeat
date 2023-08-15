let roomInfo = {};

export function dispatchMusicEvent(server, socket) {
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
    console.log(`Client(${clientId}) connected to Music Server(${roomId})`);

    // 방이 없는 경우, 방을 생성하여 목록에 추가
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

    // 클라이언트 목록에 추가
    const newClient = {
        clientId: clientId,
    };
    roomInfo[roomId].clients.push(newClient);

    // 변경된 음악 정보를 그대로 다른 플레이어에게 전달
    /**
     * on (input)
     * data: {
     *     musicIndex: 음악 리스트에서 해당 음악의 인덱스
     * }
     * 
     * emit (input)
     * data: {
     *     musicIndex: 음악 리스트에서 해당 음악의 인덱스
     * }
     */
    socket.on('music', (data) => {
        server.to(roomId).emit('music', data);
    })

    // 연결 해제
    socket.on('disconnect', () => {
        // 방 정보 데이터에서 client 정보 제거
        roomInfo[roomId].clients =
            roomInfo[roomId].clients
                .filter((client) => client.clientId !== clientId);
        // 모든 클라이언트가 나가면, 방 정보 데이터 삭제
        if (roomInfo[roomId].clients.length === 0)
            delete roomInfo[roomId];
        
        console.log(`Client(${clientId}) disconnected to Music Server(${roomId})`);
        socket.leave(roomId);
    })
}
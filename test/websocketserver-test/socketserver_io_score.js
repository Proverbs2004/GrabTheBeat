let roomInfoMap = {};

export function dispatchScoreEvent(server, socket) {
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
    console.log(`Client(${clientId}) connected to Score Server(${roomId})`);

    // 방이 없는 경우, 방을 생성하여 목록에 추가
    if (!roomInfoMap[roomId]) {
        roomInfoMap[roomId] = {
            clients: [],
        };
    }

    // 방이 꽉 차 있는 경우, 방에 참가하지 못하도록 함
    if (roomInfoMap[roomId].clients.length > 4) {
        return;
    }

    // 연결
    socket.join(roomId);

    // 클라이언트 목록에 추가
    const newClient = {
        clientId: clientId,
        userName: undefined,
        score: 0,
    };
    roomInfoMap[roomId].clients.push(newClient);

    // 플레이어가 접속을 하면 플레이어의 이름을 서버에 저장
    // 저장한 이름의 플레이어의 정보 데이터를 각 클라이언트에게 전달
    /**
     * on (input)
     * data: {
     *     userName: 플레이어의 이름
     * }
     * 
     * emit (output)
     * data : [
     *     {
     *         clientId: 클라이언트의 고유한 id
     *         userName: 플레이어의 이름
     *         score: 현재 플레이어의 점수
     *     },
     *     ...
     * ]
     */
    socket.on('join', (data) => {
        const index = roomInfoMap[roomId].clients.findIndex((client) => client.clientId === clientId);
        console.log(index);
        if (index !== -1) {
            roomInfoMap[roomId].clients[index].userName = data.userName;
            server.to(roomId).emit('join', roomInfoMap[roomId].clients);
        }
    })

    // 플레이어로부터 받은 스코어 점수 저장
    // 갱신된 플레이어의 점수를 각 클라이언트에게 전달
    /**
     * on (input)
     * data: {
     *     score: 갱신할 플레이어의 점수
     * }
     * 
     * emit (output)
     * data : [
     *     {
     *         clientId: 클라이언트의 고유한 id
     *         userName: 플레이어의 이름
     *         score: 현재 플레이어의 점수
     *     },
     *     ...
     * ]
     */
    socket.on('score', (data) => {
        const index = roomInfoMap[roomId].clients.findIndex((client) => client.clientId === clientId);

        // 찾지 못하면 -1을 반환하므로,
        // 찾았다면, 모든 클라이언트의 점수를 각 클라이언트에게 전달
        if (index !== -1) {
            roomInfoMap[roomId].clients[index].score = data.score;
            server.to(roomId).emit('score', roomInfoMap[roomId].clients);
        }
    });

    // 연결 해제
    socket.on('disconnect', () => {
        // 방 정보 데이터에서 client 정보 제거
        roomInfoMap[roomId].clients =
            roomInfoMap[roomId].clients
                .filter((client) => client.clientId !== clientId);
        // 모든 클라이언트가 나가면, 방 정보 데이터 삭제
        if (roomInfoMap[roomId].clients.length === 0)
            delete roomInfoMap[roomId];
        
        console.log(`Client(${clientId}) disconnected to Score Server(${roomId})`);
        socket.leave(roomId);
    })
}
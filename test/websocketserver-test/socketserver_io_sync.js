let roomInfo = {};

export function dispatchSyncEvent(server, socket) {
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
    console.log(`Client(${clientId}) connected to Sync Server(${roomId})`);

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
        userName: "",
        readyStart: false,
        readyEnd: false,
    };
    roomInfo[roomId].clients.push(newClient);

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
        const index = roomInfo[roomId].clients.findIndex((client) => client.clientId === clientId);

        // clientId와 userName 연결
        if (index !== -1) {
            roomInfo[roomId].clients[index].userName = data.userName;
            server.to(roomId).emit('join', roomInfo[roomId].clients);
        }
    })

    // 해당 플레어이어의 상태를 시작 가능(ready) 상태 임을 확인
    // 모든 플레이어가 시작 가능(ready) 상태 임을 확인하면 게임을 시작(start)하라는 명령을 전달
    /**
     * on (input)
     * data: empty
     * 
     * emit (output)
     * data: {
     *     start: true
     * }
     */
    socket.on('start', () => {
        const index = roomInfo[roomId].clients.findIndex((client) => client.clientId === clientId);

        if (index !== -1) {
            roomInfo[roomId].clients[index].readyStart = true;
            let isOk = true;
            roomInfo[roomId].clients.forEach(client => {
                if (!client.readyStart) {
                    isOk = false;
                }
            });

            if (isOk) {
                server.to(roomId).emit('start', {
                    start: true,
                });
            }
        }
    })

    // 해당 플레어이어의 상태를 종료 가능(ready) 상태 임을 확인
    // 모든 플레이어가 종료 가능(ready) 상태 임을 확인하면 게임을 종료(end)하라는 명령을 전달
    /**
     * on (input)
     * data: empty
     * 
     * emit (output)
     * data: {
     *     end: true
     * }
     */
    socket.on('end', () => {
        const index = roomInfo[roomId].clients.findIndex((client) => client.clientId === clientId);

        if (index !== -1) {
            roomInfo[roomId].clients[index].readyEnd = true;
            let isOk = true;
            roomInfo[roomId].clients.forEach(client => {
                if (!client.readyEnd) {
                    isOk = false;
                }
            });

            if (isOk) {
                server.to(roomId).emit('end', {
                    end: true,
                });
            }
        }
    })

    // 해당 플레어이어의 상태를 모두 false로 초기화
    /**
     * on (input)
     * data: empty
     */
    socket.on('init', () => {
        const index = roomInfo[roomId].clients.findIndex((client) => client.clientId === clientId);

        if (index !== -1) {
            roomInfo[roomId].clients[index].readyStart = false;
            roomInfo[roomId].clients[index].readyEnd = false;
        }
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
        
        console.log(`Client(${clientId}) disconnected to Sync Server(${roomId})`);
        socket.leave(roomId);
    })
}
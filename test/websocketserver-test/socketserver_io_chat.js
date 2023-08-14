export function dispatchChatEvent(chatServer, socket) {
    console.log("connected client by Socket.io");

    const query = socket.request._query;
    const roomId = query.roomId;
    console.log(roomId);

    socket.join(roomId);

    socket.to(roomId).emit('join', "누군가 입장");

    socket.on('message', (data) => {
        chatServer.to(roomId).emit('message', data);
    })

    socket.on('disconnect', () => {
        socket.leave(roomId);
    })
}
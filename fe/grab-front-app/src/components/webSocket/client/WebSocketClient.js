import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './client.css';
import { io } from "socket.io-client";

const Client = (props) => {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  // const ws = useRef(null);
  const socket = useRef(null);
  const messageInputRef = useRef(null);

  // const location = useLocation();
  // const userName = new URLSearchParams(location.search).get('userName');
  console.log('props: ',props);
const userName = props.userName;
  const roomId = props.sessionId;
  console.log('roomId : ', roomId)

  useEffect(() => {
    // ws.current = new WebSocket('ws://localhost:8003','echo-protocol');
    // console.log(ws.current);

    socket.current = io("ws://localhost:8000/chat?roomId=" + roomId, {
      reconnectionDelayMax: 10000,
    });
    console.log('socket.current  : ', socket.current);



//   // 메세지 수신
//   const receiveMessage = (event) => {
//   const receivedMessage = JSON.parse(event.data);

//   if (receivedMessage.fromServer) {
//     // 서버에서 받은 메시지인 경우
//     setChatHistory((prevChatHistory) => [...prevChatHistory, receivedMessage.content]);
//     console.log("받았엉");
//   } else {
//     // 클라이언트에서 보낸 메시지인 경우
//     setChatHistory((prevChatHistory) => [...prevChatHistory, `${receivedMessage.userName}: ${receivedMessage.message}`]);
//   }
//   scrollChatToBottom();
// };

// ws.current.onmessage = receiveMessage;
          // 메시지 받았을 때
    socket.current.on('message', data => {
      const receivedMessage = JSON.parse(data);
      console.log('receiveMessage at socket.on', receivedMessage);
      setChatHistory((prevChatHistory) => [...prevChatHistory, `${receivedMessage.userName} : ${receivedMessage.message}`]);
    })

return () => {
  // ws.current.close();
};
}, []);

// 메세지 전송
const sendMessage = () => {
  if (message.trim() !== '') {
    const fullMessage = JSON.stringify({ userName, message });
    console.log(fullMessage);
    // 웹 소켓의 상태가 "OPEN"일 때만 메시지를 보냄
    // if (ws.current.readyState === WebSocket.OPEN) {
    //   ws.current.send(fullMessage);
    socket.current.emit('message', fullMessage);
      setMessage('');
      console.log(fullMessage);
      // 메시지를 채팅 로그에 추가하고 스크롤을 가장 아래로 내림
      // setChatHistory((prevChatHistory) => [...prevChatHistory, `${userName}: ${message}`]);
      scrollChatToBottom();
    // } else {
    //   console.log("왜 안돼?");
    // }
  }
};


  // 스크롤을 가장 아래로 내리는 함수
  const scrollChatToBottom = () => {
    const chatLog = document.getElementById('chat-log');
    chatLog.scrollTop = chatLog.scrollHeight;
  };

  // 엔터키 눌러서 채팅 치는 함수
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <div className="containersingleroom">
        <div className="chatbox">
          <div className='listandlog'style={{display:'flex'}}>
        {/* <div className='list'>list</div> */}
          <div id="chat-log" className="chatlogbox" >

            {chatHistory.map((message, index) => (
              <div key={index} className="chatmessage">
              {message}
            </div>
            ))}
          </div>
          </div>
          <div>
          <input
            type="text"
            className="messagebox"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleKeyPress}
            ref={messageInputRef}
          />
          {/* <button onClick={sendMessage}>Send</button> */}
          </div>

      </div>
      </div>  
    </div>
 
  );
};

export default Client;

 import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './client.css';
import { io } from "socket.io-client";

const Client = (props) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  // const ws = useRef(null);
  const socket = useRef(null);
  const messageInputRef = useRef(null);

  console.log('props: ',props);
  const userName = props.userName;
  const roomId = props.sessionId;
  console.log('roomId : ', roomId)

  useEffect(() => {

    socket.current = io(process.env.REACT_APP_SOCKET_URL + "/chat?roomId=" + roomId, {
      reconnectionDelayMax: 10000,
    });
    console.log('socket.current  : ', socket.current);



    // 메시지 받았을 때
    socket.current.on('message', data => {
      const receivedMessage = JSON.parse(data);
      console.log('receiveMessage at socket.on', receivedMessage);
      setChatHistory((prevChatHistory) => [...prevChatHistory, `${receivedMessage.userName} : ${receivedMessage.message}`]);
    })

return () => {
};
}, []);

// 메세지 전송
const sendMessage = () => {
  if (message.trim() !== '') {
    const fullMessage = JSON.stringify({ userName, message });
    console.log(fullMessage);
    socket.current.emit('message', fullMessage);
      setMessage('');
      console.log(fullMessage);
      scrollChatToBottom();
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
          </div>

      </div>
      </div>  
    </div>
 
  );
};

export default Client;

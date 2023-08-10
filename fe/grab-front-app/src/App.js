import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import './App.css';

import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Join from './pages/join/Join';
import SingleplayJoin from './pages/singleplayjoin/SingleplayJoin';
import Singleplay from './pages/singleplay/Singleplay';
import SingleplayWaiting from './pages/singleplaywaiting/singleplayWaiting';
import MultiplayWaiting from './pages/multiplaywaiting/MultiplayWaiting';
import Client from './webSocket/client/WebSocketClient';
import LoginWaiting from './pages/login/LoginWaiting';


// 인증 페이지 생성 함수
import Auth from './hoc/auth';

function App() {
  const AuthMultiplayWaiting = Auth(MultiplayWaiting, true);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<Create />} />
          <Route path="/join" element={<Join />} />
          <Route path="/singleplayJoin" element={<SingleplayJoin />} />
          <Route path="/singleplay" element={<Singleplay />} />
          <Route path="/singleplaywaiting" element={<SingleplayWaiting />} />
          <Route path="/multiplaywaiting" element={<AuthMultiplayWaiting />}></Route>
          <Route path="/webSocket" element={<Client />} />
          <Route path="/loginwaiting" element={<LoginWaiting />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}





export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import './App.css';

import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Join from './pages/join/Join';
import SingleplayJoin from './pages/singleplayjoin/SingleplayJoin';
import Singleplay from './pages/singleplay/Singleplay';
import SingleplayWaiting from './pages/singleplaywaiting/singleplayWaiting';
import Client from './webSocket/client/WebSocketClient';



function App() {
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
          <Route path="/webSocket" element={<Client />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}





export default App;
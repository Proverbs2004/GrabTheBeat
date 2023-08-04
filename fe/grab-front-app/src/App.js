import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import './App.css';

import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Join from './pages/join/Join';
import SingleplayJoin from './pages/singleplayjoin/SingleplayJoin';
import Singleplay from './pages/singleplay/Singleplay';



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
        </Routes>
      </BrowserRouter>
    </div>
  );
}





export default App;
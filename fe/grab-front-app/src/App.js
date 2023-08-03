import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import './App.css';

import Home from './Home';
import Create from './Create';
import Join from './Join';
import SingleplayJoin from './SingleplayJoin';
import Singleplay from './Singleplay';



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
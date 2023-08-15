import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';

import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Join from './pages/join/Join';
import SingleplayJoin from './pages/singleplayjoin/SingleplayJoin';
import Singleplay from './pages/singleplay/singleplay';
import SingleplayResult from './pages/singleresult/SingleplayResult';
import MultiplayJoin from './pages/multiplayjoin/MultiplayJoin';
import Multiplay from './pages/multiplay/MultiplayWaiting';
import Multiplayw from './pages/multiplay/Multiplaywait';
import Loading from './pages/loading/Loading';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 초기 로딩 작업
    fetchData()
      .then(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {isLoading ? (
          <Loading />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/join" element={<Join />} />
            <Route path="/singleplayJoin" element={<SingleplayJoin />} />
            <Route path="/singleplay" element={<Singleplay />} />
            <Route path="/singleplayresult" element={<SingleplayResult />} />
            <Route path="/multiplayJoin" element={<MultiplayJoin />} />
            <Route path="/multiplaywaiting" element={<Multiplay />} />
            <Route path="/multiplaywaitingw" element={<Multiplayw />} />
            {/* Fallback route for unknown paths */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

// 가상의 데이터 로딩 함수
function fetchData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

export default App;

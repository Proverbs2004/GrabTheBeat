import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import './App.css';

import Home from './pages/home/Home';
import Create from './pages/create/Create';
import Join from './pages/join/Join';
import SingleplayJoin from './pages/singleplayjoin/SingleplayJoin';
import Singleplay from './pages/singleplay/singleplay';
import SingleplayResult from './pages/singleresult/SingleplayResult';
// import Multiplay from './pages/multiplay/Multiplay';
// import MultiplayWaiting from 'pages/multiplay/MultiplayWaiting';
import Auth from 'hoc/auth';



function App() {
    const AuthCreate = Auth(Create);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/create" element={<Create />} /> */}
          <Route path="/create" element={<AuthCreate />} /> 
          <Route path="/join" element={<Join />} />
          <Route path="/singleplayJoin" element={<SingleplayJoin />} />
          <Route path="/singleplay" element={<Singleplay />} />
          <Route path="/singleplaywresult" element={<SingleplayResult />} />
          {/* <Route path="/multiplaywaiting" element={<MultiplayWaiting />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}





export default App;

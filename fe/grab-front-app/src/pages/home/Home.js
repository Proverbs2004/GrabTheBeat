import { Link, useNavigate } from 'react-router-dom';

import './Home.css';
import Header from 'pages/header/Header';
import { useCallback, useState } from 'react';
import axios from 'axios';
import { removeRefreshToken } from 'storage/Cookie';


function TitleGame() {
  return (
    <div className="titleHome">GRAB THE BEAT</div>
  );
}

function ButtonCreateJoinContainer() {
  return (
    <div className = "button-containerHome">
      <ButtonCreateGame />
      <ButtonJoinGame />
    </div>
  );
}

function ButtonCreateGame() {
  
  return (
    <div>
       <Link to="/create">
        <button className="creategame" style={{ marginRight: '200px' }}>
          CREATE<br />
          GAME
        </button>
      </Link>
    </div>
  );
}

function ButtonJoinGame() {
  return (
    <div>
      <Link to="/join" className="creategame-link">
        <button className="joingame" style={{ marginLeft: '200px' }}>JOIN<br />GAME</button>
      </Link>
    </div>
  );
}

function loginGoogle() {
  //document.location.href = "http://localhost:5000/oauth2/authorization/google"
  document.location.href = "https://i9a607.p.ssafy.io/oauth2/authorization/google"
}

function ButtonGoogle() {
  return (
    <div>
      <button className="google" onClick={loginGoogle}>Continue with Google</button>
    </div>
  )
}

const ACCESS_TOKEN = 'access_token';
const EMAIL = 'email';
const NICKNAME = 'nickname';
const EMAIL_ALIAS = 'email_alias';

function Home() {
  const navigate = useNavigate();

  const token = searchParam('token')

  window.history.replaceState({}, null, window.location.pathname);
 
  if (token) {
      localStorage.setItem("access_token", token)
  }

  function searchParam(key) {
      return new URLSearchParams(window.location.search).get(key);
  }

  function logout() {
    console.log(process.env.REACT_APP_SPRING_URL)
    const response = axios.get(process.env.REACT_APP_SPRING_URL + '/api/logout', {}, {
      headers: { Authorization: token }
    })
    .then(res => {
      console.log('logout success:', res);
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(EMAIL);
      localStorage.removeItem(NICKNAME);
      localStorage.removeItem(EMAIL_ALIAS);
      removeRefreshToken();
      // setToken(undefined, () => {
      //   window.location.reload();
      //   console.log('reload')
      // });
      navigate("/");
      // window.location.reload();
    })
    .catch(err => {
      console.log('logout failed:', err);
    });
  }

  return (

    <div className="containerHome">
      {/* <Header /> */}
      <TitleGame />
      <ButtonCreateJoinContainer />
      {localStorage.getItem('access_token') ? 
          <button className="backbuttonCreate" onClick={logout}>
              LOGOUT
          </button> : <ButtonGoogle /> }
    </div>

  );
}

export default Home;

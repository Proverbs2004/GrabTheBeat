import { Link } from 'react-router-dom';

import './Home.css';
import Header from 'pages/header/Header';


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
  document.location.href = "http://localhost:5000/oauth2/authorization/google"
}

function ButtonGoogle() {
  return (
    <div>
      <button className="google" onClick={loginGoogle}>Continue with Google</button>
    </div>
  )
}

function Home() {

  const token = searchParam('token')

  window.history.replaceState({}, null, window.location.pathname);
 
  if (token) {
      localStorage.setItem("access_token", token)
  }

  function searchParam(key) {
      return new URLSearchParams(window.location.search).get(key);
  }

  return (

    <div className="containerHome">
      <Header />
      <TitleGame />
      <ButtonCreateJoinContainer />
      <ButtonGoogle />
    </div>

  );
}

export default Home;
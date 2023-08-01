import { Link } from 'react-router-dom';

import './Home.css';


function GameTitle() {
  return (
    <div className="title">GRAB THE BEAT</div>
  );
}

function ButtonCreateJoinContainer() {
  return (
    <div className = "button-container">
      <ButtonCreateGame />
      <ButtonJoinGame />
    </div>
  );
}

function ButtonCreateGame() {
  
  return (
    <div>
       <Link to="/create" className="creategame-link">
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
      <button className="joingame" style={{ marginLeft: '200px' }}>JOIN<br></br>GAME</button>
    </div>
  );
}

function ButtonGoogle() {
  return (
    <div>
      <button className="google">Continue with Google</button>
    </div>
  )
}

function Home() {

  return (

    <div className="container">
      <GameTitle />
      <ButtonCreateJoinContainer />
      <ButtonGoogle />
    </div>

  );
}

export default Home;
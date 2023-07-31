import './App.css';

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
       <button className="creategame" style={{ marginRight: '200px' }}>CREATE<br></br>GAME</button>
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
      <button class="google">Continue with Google</button>
    </div>
  )
}

function App() {
  return (

    <div className="container">
      <GameTitle />
      <ButtonCreateJoinContainer />
      <ButtonGoogle />
    </div>

  );
}

export default App;

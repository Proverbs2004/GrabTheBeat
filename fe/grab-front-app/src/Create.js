import './Create.css';

function Create () {
    return (
        <div className="container">
            <CreateTitle />
            <ButtonCreateGame />
            <ButtonJoinGame />
        </div>
    ) 
}


function CreateTitle () {
    return (
        <div className="title">CREATE GAME</div>
    )
}

function ButtonCreateGame() {

    return (
      <div>
        <button className="playsingle">
          CREATE<br />
          GAME
        </button>
      </div>
    );
  }

function ButtonJoinGame () {
    return (
        <div>
            <button className="playmulti">PLAY<br />MULTI</button>
        </div>
    )
}

export default Create;
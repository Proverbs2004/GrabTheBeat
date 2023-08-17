import './MultiplayResult.css'
import { Link, useLocation } from 'react-router-dom';
import {useRef} from 'react';

function MultiplayResult() {
    const location = useLocation();
    const resultData = location.state;

    const goodScore = parseInt(resultData.goodScore, 10);
    const perfectScore = parseInt(resultData.perfectScore, 10);
    const highestCombo = parseInt(resultData.highestCombo, 10);
    const comboScore = parseInt(resultData.comboScore, 10);
    const playerName = resultData.userName;
    console.log(playerName);

    const nameRef = useRef(null);
    nameRef.current = resultData.userName;
    

    const totalScore = goodScore * 100 + perfectScore * 1000 + highestCombo * 1000 + comboScore * 100;


    return (
        <div className='resultcontainermulti'>
            <div className="resulttitlemulti">RESULT</div>
            <div className="scoreboardmulti">
            <div className="scoreinfomulti" style={{ display: "flex", textAlign:'center' }}>
                <div className="rankmulti">player</div>
                <div className="usernamemulti">username</div>
                <div className="scoremulti">score</div>
                <div className="pointmulti">point</div>
            </div>

            {resultData.scores.map((scoreObj, index) => (
                <div key={index} className="gameinfomulti" style={{ display: "flex", textAlign: "center" }}>
                <div className="rankmulti">{index + 1}</div>
                <div className="usernamemulti">{scoreObj.userName}</div>
                <div className="scoremulti">{scoreObj.score}</div>
                <div className="pointmulti"></div>
            </div>
            ))}



                
                <div className="comboinfomulti">
                    <div className="imageareamulti">
                        <img src={ resultData.pic_url} alt="사진" style={{width:300, height:300, borderRadius:'7.5px', marginLeft:'0px'}}/>
                    </div>
                    <div className="comboareamulti">
                    <div className='PGFH'>
                    <div className='s'>PERFECT {resultData.perfectScore}</div> 
                    <div className='s'>GOOD {resultData.goodScore}</div>
                    <div className='s'>FAIL {resultData.failedScore}</div>
                    <div className='s'>MAX COMBO {resultData.highestCombo}</div>
                    </div>
                </div>
                </div>

            <Link to='/'>
                <input type="submit" value="QUIT" id="quit" class="quitbuttonmulti" />
            </Link>    
        </div>

        </div>
    )
}



export default MultiplayResult;
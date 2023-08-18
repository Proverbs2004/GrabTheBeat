import './SingleplayResult.css'
import { Link, useLocation } from 'react-router-dom';

function SingleplayResult() {
    const location = useLocation();
    const resultData = location.state;
    console.log(resultData.userName);

    const goodScore = parseInt(resultData.goodScore, 10);
    const perfectScore = parseInt(resultData.perfectScore, 10);
    const highestCombo = parseInt(resultData.highestCombo, 10);
    const comboScore = parseInt(resultData.comboScore, 10);

    const totalScore = goodScore * 100 + perfectScore * 1000 + highestCombo * 1000 + comboScore * 100;
    
    console.log(resultData.pic_url);



    return (
        <div className='resultcontainersingle'>
            <div className="resulttitlesingle">RESULT</div>
            <div className="scoreboardsingle">
            <div className="scoreinfosingle" style={{ display: "flex", textAlign:'center' }}>
                <div className="ranksingle">rank</div>
                <div className="usernamesingle">username</div>
                <div className="scoresingle">score</div>
                <div className="pointsingle">point</div>
            </div>

            <div className="gameinfosingle" style={{ display: "flex", textAlign:'center' }}>
                <div className="ranksingle">1</div>
                <div className="usernamesingle">{resultData.userName}</div>
                <div className="scoresingle">{totalScore}</div>
                <div className="pointsingle"></div>
  
                    
            </div>
                
                <div className="comboinfosingle">
                    <div className="imageareasingle">
                        <img src={ resultData.pic_url} alt="사진" style={{width:300, height:300, borderRadius:'7.5px', marginLeft:'0px'}}/>
                    </div>
                    <div className="comboareasingle">
                    <div className='PGFH'>
                    <div className='p'>PERFECT {resultData.perfectScore}</div> 
                    <div className='p'>GOOD {resultData.goodScore}</div>
                    <div className='p'>FAIL {resultData.failedScore}</div>
                    <div className='p'>MAX COMBO {resultData.highestCombo}</div>
                    <div className='p'>LAST COMBO {resultData.comboScore}</div>
                    </div>
                </div>
                </div>

            <Link to='/'>
                <input type="submit" value="QUIT" id="quit" class="quitbuttonsingle" />
            </Link>    
        </div>

        </div>
    )
}



export default SingleplayResult;
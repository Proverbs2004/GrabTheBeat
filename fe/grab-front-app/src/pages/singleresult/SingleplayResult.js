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
        <div className='resultcontainer'>
            <div className="resulttitle">RESULT</div>
            <div className="scoreboard">
            <div className="scoreinfo" style={{ display: "flex", justifyContent: "space-between" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="rank">rank</div>
                <div className="username">username</div>
                <div className="score">score</div>
                <div className="point">point</div>
            </div>

            <div className="scoreinfo" style={{ display: "flex", justifyContent: "space-between" }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div className="rank">1</div>
                <div className="username">{resultData.userName}</div>
                <div className="score">{totalScore}</div>
                <div className="point"></div>
  
                    
            </div>
                
                <div className="comboinfo">
                    <div className="imagearea">
                        <img src={ resultData.pic_url} alt="사진" style={{width:250, height:250}}/>
                    </div>
                    <div className="comboarea">
                    <br />
                    <br />
                    <div>Perfect Score: {resultData.perfectScore}</div><br />  
                    <div>goodScore: {resultData.goodScore}</div><br />
                    <div>failedScore: {resultData.failedScore}</div><br />
                    <div>highestCombo: {resultData.highestCombo}</div><br />
                    <div>comboScore: {resultData.comboScore}</div><br /></div>
                </div>

            <Link to='/'>
                <input type="submit" value="QUIT" id="quit" class="quitbutton" />
            </Link>    
        </div>

        </div>
    )
}



export default SingleplayResult;
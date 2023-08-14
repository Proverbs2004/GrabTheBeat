import './SingleplayResult.css'
import { Link, useLocation } from 'react-router-dom';

function SingleplayResult() {
    const location = useLocation();
    const resultData = location.state;
    console.log(resultData.userName);


    return (
        <div className='resultcontainer'>
            <div className="resulttitle">RESULT</div>
            <div className="scoreboard">
                <div className="scoreinfo">rank username score point</div>
                <div className="scorebox">
                    <div>userName: {resultData.userName}</div><br />  
                    <br />
                    <br />    
                    
                </div>
                
                <div className="comboinfo">
                    <div className="imagearea">imagebox</div>
                    <div className="comboarea">
                    <br />
                    <br />
                    <div>Perfect Score: {resultData.perfectScore}</div><br />  
                    <div>goodScore: {resultData.goodScore}</div><br />
                    <div>failedScore: {resultData.failedScore}</div><br />
                    <div>highestCombo: {resultData.highestCombo}</div><br />
                    <div>comboScore: {resultData.comboScore}</div><br /></div>
                </div>
            <div className="rankarea">rankarea</div>

            <Link to='/'>
                <input type="submit" value="QUIT" id="quit" class="quitbutton" />
            </Link>    
        </div>

        </div>
    )
}



export default SingleplayResult;
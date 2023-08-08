import './SingleplayResult.css'
import { Link } from 'react-router-dom';

function SingleplayResult() {
    return (
        <div className='resultcontainer'>
            <div className="resulttitle">RESULT</div>
            <div className="scoreboard">
                <div className="scoreinfo">rank username score point</div>
                <div className="scorebox">THIS IS FOR SCOREBOX</div>
                <div className="comboinfo">
                    <div className="imagearea">imagebox</div>
                    <div className="comboarea">comboarea</div>
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
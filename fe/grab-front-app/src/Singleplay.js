import './Singleplay.css';
import { Link } from 'react-router-dom';

function Singleplay() {
    return(
        <div>
            <ButtonHome />    
            <div className="containerSingleplay">
                <TitleSingleplay />
            </div>
        </div>
    )
}

function TitleSingleplay() {
    return (
        <div className="titleSingleplay">SINGLE PLAY</div>
    )
}

function ButtonHome() {
    return (
        <Link to="/" >
        <button className="backbutton" >
            <svg className="icon" width="100" height="100" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M30.83 14.83l-2.83-2.83-12 12 12 12 2.83-2.83-9.17-9.17" fill="#transparent" stroke="#ff99ff" strokeWidth="0.5"/>
                <path d="M0 0h48v48h-48z" fill="none"/>
            </svg>
            HOME
        </button>
        </Link>
    )
}

export default Singleplay;
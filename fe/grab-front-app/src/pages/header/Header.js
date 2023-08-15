import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // 스타일링을 위한 CSS 파일을 import

function Header() {
  return (
    <div>
        <Link to="/" >
        <button className="backbuttonCreate" >
            LOG OUT
            <svg className="icon" width="100" height="100" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.83 14.83l2.83-2.83 12 12 -12 12 -2.83-2.83 9.17-9.17" fill="#transparent" stroke="#ff99ff" strokeWidth="0.5"/>
                <path d="M0 0h48v48h-48z" fill="none"/>
            </svg>
            
        </button>
        </Link>
    </div>
  );
}

export default Header;

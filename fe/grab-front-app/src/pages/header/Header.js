import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // 스타일링을 위한 CSS 파일을 import
import axios from 'axios';

// const SERVER_URL = 'https://i9a607.p.ssafy.io/'
const ACCESS_TOKEN = 'access_token';

function Header() {
  const navigate = useNavigate();
  // const token = localStorage.getItem(ACCESS_TOKEN);
  const [token, setToken] = useState(localStorage.getItem(ACCESS_TOKEN));

  useEffect(() => {
    console.log("jiseung")
  }, [token])
  
  // async function logout() {
  function logout() {
    console.log(process.env.REACT_APP_SPRING_URL)
    const response = axios.get(process.env.REACT_APP_SPRING_URL + '/api/logout', {}, {
      headers: { Authorization: token }
    })
    .then(res => {
      console.log('logout success:', res);
      localStorage.removeItem(ACCESS_TOKEN);
      // setToken(undefined, () => {
      //   window.location.reload();
      //   console.log('reload')
      // });
      setToken(undefined);
      navigate("/")
      // window.location.reload();
    })
    .catch(err => {
      console.log('logout failed:', err);
    });
  }

  return (
    <div>
        {token ?
        // <Link to="/" >
          <button className="backbuttonCreate" onClick={logout}>
              LOGOUT
              <svg className="icon" width="100" height="100" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.83 14.83l2.83-2.83 12 12 -12 12 -2.83-2.83 9.17-9.17" fill="#transparent" stroke="#ff99ff" strokeWidth="0.5"/>
                  <path d="M0 0h48v48h-48z" fill="none"/>
              </svg>
          </button>
        // </Link>
        : null }
    </div>
  );
}

export default Header;

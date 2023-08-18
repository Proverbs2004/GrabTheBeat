import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css'; // 스타일링을 위한 CSS 파일을 import
import axios from 'axios';

import { removeRefreshToken } from 'storage/Cookie';

// const SERVER_URL = 'https://i9a607.p.ssafy.io/'
const ACCESS_TOKEN = 'access_token';
const EMAIL = 'email';
const NICKNAME = 'nickname';
const EMAIL_ALIAS = 'email_alias';

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
      localStorage.removeItem(EMAIL);
      localStorage.removeItem(NICKNAME);
      localStorage.removeItem(EMAIL_ALIAS);
      removeRefreshToken();
      // setToken(undefined, () => {
      //   window.location.reload();
      //   console.log('reload')
      // });
      setToken(undefined);
      navigate("/");
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
          </button>
        // </Link>
        : null }
    </div>
  );
}

export default Header;

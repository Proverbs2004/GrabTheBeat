import './SingleplayJoin.css';
import { Link } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import SingleplayWaiting from '../singleplaywaiting/singleplayWaiting';
const APPLICATION_SERVER_URL = 'https://i9a607.p.ssafy.io:8443/';

function SingleplayJoin() {
    return(
        <div>
            <ButtonHome />    
            <div className="containerSingleplay">
                <TitleSingleplayJoin />
                <JoinForm />
            </div>
        </div>
    )
}

function TitleSingleplayJoin() {
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

function JoinForm() {
    const [values, setValues] = useState({
        code: "",
        userName: "",
    });

    const [errors, setErrors] = useState({
        code: "",
        userName: "",
    });

    const [touched, setTouched] = useState({
        code: false,
        userName: false,
    });

    const handleChange = e => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };


    const handleFocus = e => {
        setTouched({
            ...touched,
            [e.target.name]: true,
        });

        // 입력 필드에 값이 없을 때만 빈 문자열로 설정하여 placeholder를 숨긴다.
        if (!values[e.target.name]) {
            setValues({
                ...values,
                [e.target.name]: "",
            });
        }
    };


    const handleSubmit = e => {
        e.preventDefault();

        setTouched({
            code: true,
            userName: true,
        });

        const errors = validate();
        setErrors(errors);
        if (Object.values(errors).some((v) => v)) {
            return;
        }

        alert(JSON.stringify(values, null, 2));
    };

    const validate = useCallback(() => {
        const errors = {
            code: "",
            userName: "",
        };

        if (!values.code) {
            errors.code = "코드를 입력하세요";
        }
        if (!values.userName) {
            errors.userName = "이름을 입력하세요";
        }
        return errors;
    }, [values]);

    useEffect(() => {
        validate();
    }, [validate]);

    // axios 
    let roomCode;
    async function singleJoinGame() {
        roomCode = await axios.post('https://i9a607.p.ssafy.io/api/rooms');
        console.log('roomCode : ', roomCode);
        // const session = await axios.post('http://localhost:4443/openvidu/api/sessions', {}, { headers: {Authorization: 'Basic T1BFTlZJRFVBUFA6TVlfU0VDUkVU', 'Content-Type': 'application/json'}});
        // const session = await axios.post(APPLICATION_SERVER_URL + 'openvidu/api/sessions', {}, { headers: {Authorization: 'Basic T1BFTlZJRFVBUFA6YTYwNw==', 'Content-Type': 'application/json'}});
        // console.log('session : ', session);

    }



    return (
        <form onSubmit={handleSubmit}>
           
            <input
                type="text"
                name="userName"
                value={values.userName}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleFocus}
                className={`login-form-field ${touched.userName && !values.userName ? "empty" : ""}`}
                placeholder="ENTER YOUR NAME"
            />
            {touched.userName && errors.userName && <span><br />{errors.userName}</span>}
            <br />
            <Link to={`/singleplaywaiting?userName=${values.userName}`}>
                <button type="submit" className="joinbutton" onClick={singleJoinGame}>JOIN</button>
            </Link>
        </form>,

        <div>
            <SingleplayWaiting  roomCode = {roomCode} />
        </div>
    )
}

export default SingleplayJoin;
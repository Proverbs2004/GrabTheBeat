import { Link, json} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { React, useState, useEffect, useRef, Component } from 'react';
import { drawConnectors} from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import {
    FaceLandmarker,
    HandLandmarker,
    FilesetResolver,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import Slider from "react-slick";
import './MultiplayWaiting.css';
import '../../util/node.css';
import '../../util/effect.css';


import MusicCard from '../../components/MusicCard'

import Websocket from '../../components/webSocket/client/WebSocketClient'
import { Carousel } from 'react-responsive-carousel';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import musicListData from '../../data/musicListData.json';

import {createCircle, createPerfect, createGood, createBad} from "../../util/node.js";
import {createEffect} from "../../util/effect.js";

import drum from '../../data/drum.mp3';

import redBone from '../../data/DonaldGlover_RedBone.mp3';
import redBoneData from '../../data/DonaldGlover_RedBone.json';
import UserVideoComponent from '../../components/openVidu/UserVideoComponent';

import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

const APPLICATION_SERVER_URL = 'https://i9a607.p.ssafy.io:8443/';

function TitleSingleplay() {
    return (
        <div className="titleSingleplay">SINGLE PLAY</div>
    )
}

function MultiplayWaiting(){
    const [mySessionId, setMySessionId] = useState('qwer'); // 추후 이곳에 방 만들기 일때는 랜덤코드를 방 참가 일 때는 입력된 코드를 넣기
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100)); // 방 만들기와 방 참가를 구분하는 변수로 사용하기
    const [session, setSession] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);
      
    useEffect(()=>{
        window.addEventListener('beforeunload', onBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };

    },[])


    const onBeforeUnload = () => {
        leaveSession();
    };

    const handleChangeSessionId = (e) => {
        setMySessionId(e.target.value);
    };

    const handleChangeUserName = (e) => {
        setMyUserName(e.target.value);
    };

    const deleteSubscriber = (streamManager) => {
        setSubscribers(prevSubscribers => prevSubscribers.filter(sub => sub !== streamManager));
    };

    const generateRandomAlphaNumeric = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        console.log('generate ', result)
        return result;
    }

    const joinSession = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const ov = new OpenVidu();
        console.log("조인세션 되는 중");
        try {
            const mySession = ov.initSession();
    
            mySession.on('streamCreated', (event) => {
                const subscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
            });
    
            mySession.on('streamDestroyed', (event) => {
                deleteSubscriber(event.stream.streamManager);
            });
            
            // const sessionId = await createSession(mySessionId);
            const sessionId = await createSession(generateRandomAlphaNumeric(6));
            console.log('join session id', sessionId);
            const token = await createToken(sessionId);
            setMySessionId(sessionId);
            mySession.connect(token.token, { clientData: myUserName });
    
            const publisher = await ov.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
    
            mySession.publish(publisher);
    
            // 여기서 세션 연결 후 상태 업데이트 및 UI 렌더링을 진행
            setSession(mySession);
            // setMainStreamManager(publisher);
            setPublisher(publisher);
        } catch (error) {
            console.log('There was an error:', error);
        }
    };
    
    const enterSession = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const ov = new OpenVidu();
        console.log("조인세션 되는 중");
        try {
            const mySession = ov.initSession();
    
            mySession.on('streamCreated', (event) => {
                const subscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
            });
    
            mySession.on('streamDestroyed', (event) => {
                deleteSubscriber(event.stream.streamManager);
            });
    
            const sessionId = document.getElementById('sessionCode').value;
            console.log('enter session id', sessionId);
            const token = await createToken(sessionId);
    
            mySession.connect(token.token, { clientData: myUserName });
    
            const publisher = await ov.initPublisherAsync(undefined, {
                audioSource: undefined,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
    
            mySession.publish(publisher);
    
            // 여기서 세션 연결 후 상태 업데이트 및 UI 렌더링을 진행
            setSession(mySession);
            // setMainStreamManager(publisher);
            setPublisher(publisher);
        } catch (error) {
            console.log('There was an error:', error);
        }
    };


    const leaveSession = () => {
        console.log('리브 세션 집입');
        if (session) {
            session.disconnect();
        }

        setSession(undefined);
        setSubscribers([]);
        setMySessionId('SessionA');
        setMyUserName('Participant' + Math.floor(Math.random() * 100));
        setPublisher(undefined);
    };

    

    const createSession = async (sessionId) => {
        try {
            const response = await axios.post(
                APPLICATION_SERVER_URL + 'openvidu/api/sessions',
                { customSessionId: sessionId },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic T1BFTlZJRFVBUFA6YTYwNw==',
                    }
                }
            );
            return response.data.sessionId;
        } catch (error) {
            if (error.response && error.response.status === 409) {
                return sessionId;
            }
            throw error;
        }
    };

    const createToken = async (sessionId) => {
        const response = await axios.post(
            APPLICATION_SERVER_URL + 'openvidu/api/sessions/' + sessionId + '/connection',
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic T1BFTlZJRFVBUFA6YTYwNw==',
                }
            }
        );
        return response.data;
    };



    return(
        <div className="containerSingleplayWaiting">
            <div>
                {mySessionId}
                <br />
                {myUserName}
            </div>
            {/* <ButtonHome/> */}
            <button onClick={joinSession}>openvidu</button>
            <input id='sessionCode'></input>
            <button onClick={enterSession}>enter</button>
            <TitleSingleplay />
            <div className='camandmessagebox' style={{display:'flex'}}>
                <div className='mainSection'>
                    <div className='multicontainer'>
                    <div className="gameContainerWaiting">
                        <UserVideoComponent streamManager={publisher} />
                    </div>
                    <div className='bigbox'>
                    <div style={{display:'flex'}}>
                        <div className='cambox1'>cambox1
                            {subscribers[0] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[0]} />
                            : null }
                        </div>
                        <div className='cambox2'>cambox2
                            {subscribers[1] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[1]} />
                            : null }
                        </div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div className='cambox3'>cambox3
                        <div className='cambox2'>cambox2
                            {subscribers[2] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[2]} />
                            : null }
                        </div>
                        </div>
                        <div className='cambox4'>cambox4
                        <div className='cambox2'>cambox2
                            {subscribers[3] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[3]} />
                            : null }
                        </div>
                        </div>
                    </div>
                    </div>



                    </div>
                    <Websocket />
                </div>
            </div>
        </div>

    )
    
}

export default MultiplayWaiting;
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
import UserVideoComponent from '../../components/openVidu2/UserVideoComponent';

import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

const APPLICATION_SERVER_URL = 'https://i9a607.p.ssafy.io:8443/';

function TitleMultiplay() {
    return (
        <div className="TitleMultiplay">MULTIPLAY</div>
    )
}

function MultiplayWaiting(){
    const [mySessionId, setMySessionId] = useState('qwer'); // 추후 이곳에 방 만들기 일때는 랜덤코드를 방 참가 일 때는 입력된 코드를 넣기
    const [myUserName, setMyUserName] = useState('Participant' + Math.floor(Math.random() * 100)); // 방 만들기와 방 참가를 구분하는 변수로 사용하기
    const [session, setSession] = useState(undefined);
    const [publisher, setPublisher] = useState(undefined);
    const [subscribers, setSubscribers] = useState([]);

    const location = useLocation();
    const from = location.state.from;
    const code = location.state.code;
    const name = location.state.name;

    const musicList = musicListData.musicList;
    const [selectedMusic, setSelectedMusic] = useState(musicListData.musicList[0]);
    const selectedMusicRef = useRef(musicListData.musicList[0]);
    const audio = useRef(new Audio(redBone));
    const isGamePlaying = useRef(false);
    const gameStartTime = useRef(0);
    const arrayIdx = useRef(0);
    const [isGamePlayingState, setIsGamePlayingState] = useState(false);
    const startTimeArray = useRef([]);
    const positionArray = useRef([]);
    
    useEffect(()=>{
        console.log('from useeffect ', from)
        window.addEventListener('beforeunload', onBeforeUnload);

        console.log('useEffect')
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };

    },[])

    useEffect(() => {
        console.log('from useeffect from ', from)
        const handleFunctionCall = () => {
            if (from === 'create') {
              // 'a' 페이지에서 왔을 경우 실행할 함수
              console.log('from에 따라 joinsession')
              joinSession();
            } else if (from === 'join') {
              // 'b' 페이지에서 왔을 경우 실행할 함수
              console.log('from에 따라 entersession')
              enterSession();
            }
          };
      
          handleFunctionCall();
    }, [from]);

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

    const joinSession = async () => {
        // event.preventDefault(); // Prevent the default form submission behavior
    
        const ov = new OpenVidu();
        console.log("조인세션 되는 중");
        try {
            const mySession = ov.initSession();
    
            mySession.on('streamCreated', (event) => {
                const subscriber = mySession.subscribe(event.stream, undefined);
                
                setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
                
                console.log('subscribers ', subscribers);
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
                audioSource: false,
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
    
    const enterSession = async () => {
        // event.preventDefault(); // Prevent the default form submission behavior
    
        const ov = new OpenVidu();
        console.log("엔터세션 되는 중");
        try {
            const mySession = ov.initSession();
    
            mySession.on('streamCreated', (event) => {
                const subscriber = mySession.subscribe(event.stream, undefined);
                setSubscribers(prevSubscribers => [...prevSubscribers, subscriber]);
                
            });
            console.log('subscribers ', subscribers);
            mySession.on('streamDestroyed', (event) => {
                deleteSubscriber(event.stream.streamManager);
            });
    
            // const sessionId = document.getElementById('sessionCode').value;
            const sessionId = code;
            console.log('code ', code)
            console.log('enter session id', sessionId);
            const token = await createToken(sessionId);
    
            
            mySession.connect(token.token, { clientData: name });
    
            const publisher = await ov.initPublisherAsync(undefined, {
                audioSource: false,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: true,
                resolution: '640x480',
                frameRate: 30,
                insertMode: 'APPEND',
                mirror: false,
            });
    
            mySession.publish(publisher);
    
            setMyUserName(name);
            setMySessionId(sessionId);
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

    const handleMusicSelect = (music) => {

        setSelectedMusic(music);
        selectedMusicRef.current=music;

    };

    function playGame() {
        if (audio.current && !isGamePlaying.current) {

            updateTimePosArraysAndAudio();

            gameStartTime.current = performance.now();
            arrayIdx.current=0;


            setIsGamePlayingState(true);
            isGamePlaying.current=true;

        };
    }

    async function updateTimePosArraysAndAudio() {
        // const jsonData = await import(selectedMusic.json_url);
        // const objectsData = jsonData.hitObjects;
        // console.log(objectsData);
        // fillTimePositionArray(objectsData);
        // audio.current = new Audio(selectedMusic.music_url);

        let fuck = null;
        if(selectedMusicRef.current.id===0){
            fuck = await import("../../data/JanJi_HeroesTonight.json");        
        } else if(selectedMusicRef.current.id===1) {
            fuck = await import("../../data/DonaldGlover_RedBone.json");  
        } else if(selectedMusicRef.current.id===2) {
            fuck = await import("../../data/Test2.json");  
        } else if(selectedMusicRef.current.id===3) {
            fuck = await import("../../data/Test3.json");  
        } else if(selectedMusicRef.current.id===4) {
            fuck = await import("../../data/Test4.json");  
        }
        fillTimePositionArray(fuck.hitObjects);

        audio.current = new Audio(selectedMusicRef.current.music_url);

    }

    function fillTimePositionArray(objectData){
        console.log('filling arrays');
        startTimeArray.current=[];
        positionArray.current=[];
        for (const obj of objectData) {
            // 시작 시간과 위치만 배열에 담기
            startTimeArray.current.push(obj.startTime);
            positionArray.current.push(obj.position); 
        }
    }


    return(
        <div className="containerMultiplay">
            <TitleMultiplay />
            <div className='roominfo'>
                {mySessionId}
                <br />
                {myUserName}
            </div>
            <div className='camandmessagebox' style={{display:'flex'}}>
                <div className='mainSection'>
                    <div className='multicontainer'>
                    {/* <div className="gameContainerWaiting">
                        {<UserVideoComponent streamManager={publisher} /> }
                    </div> */}
                        <div className='cambox'>
                            <UserVideoComponent streamManager={publisher} />
                            {/* {subscribers[0] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[0]} />
                            : null } */}
                        </div>
                    </div>
                    <Websocket />
                </div>
                <div className='subContainer'>
                        <MusicCard musicList={musicList} selectedMusic={selectedMusic} handleMusicSelect={handleMusicSelect}  />
                        <button type="submit" className="startbutton" onClick={playGame}>START</button>
                    </div>  
            </div>
        </div>

    )
    
}

export default MultiplayWaiting;
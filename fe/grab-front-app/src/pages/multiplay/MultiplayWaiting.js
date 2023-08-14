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
import jsonData from '../../data/DonaldGlover_RedBone.json';
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

    const targets = useRef([]);

    let drawingUtils = null;
    let handLandmarker = null;
    let faceLandmarker = null;
    let handResults = null;
    let faceResults = null;

    const canvasElementRef = useRef(null);
    const videoRef = useRef(null);

    const prevInside = [false, false];
    const inside = [false, false];

    let canvasCtx = null;
    const root = useRef(document.getElementById('root'));

    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;


    
    function predictWebcam(){

        let now = performance.now();
        handResults = handLandmarker.detectForVideo(videoRef.current, now);
        faceResults = faceLandmarker.detectForVideo(videoRef.current, now);

        // 손그리기
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElementRef.current.width, canvasElementRef.current.height);
        if (handResults.landmarks) {
            for (const landmarks of handResults.landmarks) {
                drawConnectors(
                    canvasCtx,
                    landmarks,
                    HAND_CONNECTIONS,
                    { color: "rgb(255, 0, 255)", lineWidth: 10}
                );
            }
        }
        if (faceResults.faceLandmarks) {
            for (const landmarks of faceResults.faceLandmarks) {
                drawingUtils.drawConnectors(
                    landmarks,
                    FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
                    { color: "rgb(255, 0, 255)" }
                );
                drawingUtils.drawConnectors(
                    landmarks,
                    FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
                    { color: "rgb(255, 0, 255)" }
                );
                drawingUtils.drawConnectors(
                    landmarks,
                    FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
                    { color: "rgb(255, 0, 255)" }
                );
                drawingUtils.drawConnectors(
                    landmarks,
                    FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
                    { color: "rgb(255, 0, 255)" }
                );
                drawingUtils.drawConnectors(
                    landmarks,
                    FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
                    { color: "rgb(255, 0, 255)" }
                );
                drawingUtils.drawConnectors(
                    landmarks,
                    FaceLandmarker.FACE_LANDMARKS_LIPS,
                    { color: "rgb(255, 0, 255)" }
                );
            }
        }
        canvasCtx.restore();
        let c = performance.now();
        // 캐칭 알고리즘 및 판정, 노드관리
        if(handResults.landmarks.length>0){
            // 양손 대상으로 진행
            for(let i=0; i<handResults.landmarks.length; i++){
                //////////////////////////////////////////////////////////////////////////////////////////
                //////////////////////////////////////////////////////////////////////////////////////////
                // 좌표의 진행방향은 좌하향임 (캠마다 좌우반전 설정이 달라져서 바뀔수도)
                // handResults.landmarks[손 객체의 인덱스][손가락 인덱스]
                // 조악한 예시 알고리즘;;
                // 중지 꼭대기 좌표
                // 중지 뿌리 좌표
                let mid = handResults.landmarks[i][9];
                // 손바닥 좌표
                let palm = [handResults.landmarks[i][2], handResults.landmarks[i][5], handResults.landmarks[i][17], handResults.landmarks[i][0]];
                // 엄지를 제외한 손가락 끝의 좌표
                let tips = [handResults.landmarks[i][8], handResults.landmarks[i][12], handResults.landmarks[i][16], handResults.landmarks[i][20]];

                // 손가락 끝이 손바닥 사각형 안에 들어갔는지 저장
                inside[i] = isInside(palm, tips);

                
            }
            
            ///////////////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////
        }
        
        window.requestAnimationFrame(predictWebcam);
    }
    
    
    // 알고리즘 도우미 함수
    function isInside(palm, tips) {
        // 손바닥 사각형의 좌표와 손가락 끝 좌표를 입력받아 주먹을 쥐었는지 판별하는 함수
        // 레이 캐스팅(Ray Casting) 알고리즘
        let count = 0; // 손바닥에 들어온 손가락의 개수
    
        tips.forEach(element => { // 손가락 끝들을 반복
            let x = element.x; // 손가락 끝의 좌표
            let y = element.y;
            let inside = false;
    
            for(let i = 0; i < 4; i++) {
                let x1 = palm[i].x; // 손바닥 사각형의 꼭짓점 좌표
                let y1 = palm[i].y;
                let x2 = palm[(i+1)%4].x; // 다음 손바닥 사각형의 꼭짓점 좌표
                let y2 = palm[(i+1)%4].y;
    
                if(y === y1 && y === y2 && x >= Math.min(x1, x2)  && x <= Math.max(x1, x2)) {
                    // 손바닥 사각형의 선분 위에 있다 => 들어왔다
                    count++;
                    break;
                }
    
                if(y > Math.min(y1, y2) && y <= Math.max(y1, y2) && x <= Math.max(x1, x2) && y1 !== y2) {
                    // 손가락 끝이 손바닥 사각형의 선분과 교차하는 경우
                    let x_intersect = (y - y1) * (x2 - x1) / (y2 - y1) + x1;
                    if(x <= x_intersect) {
                        inside = !inside;
                    }
                }
            }
    
            if(inside) {
                // 손가락 끝이 홀수 번 교차하면 다각형 안에 점이 들어왔다
                count++;
            }
        });
        
        // 손바닥에 손가락이 2개 이상 들어왔는지 반환
        return count >= 2;
    }
    // function stopGame(){
    //     setIsGamePlayingState(false);
    //     isGamePlaying.current=false;
    //     audio.current.pause();
    //     nowTime.current=-2;
    //     audio.current.currentTime=0;
        
    //     targets.current.forEach((t)=>t.elem.remove());
    //     targets.current = [];
        
    // }
    // function playGame() {
    //     if (audio.current && !isGamePlaying.current) {

    //         gameStartTime.current = performance.now();
    //         arrayIdx.current=0;

    //         setIsGamePlayingState(true);
    //         isGamePlaying.current=true;

    //     };
    // }

    function MusicBox({playGame}){
        return(
            <div className="songTitle">
                <div className="songTitle">song title: AAA</div>
                <button id="gameStart" onClick={playGame}>게임시작</button>
            </div>
        )
    
    }


    useEffect(()=>{
        const video = videoRef.current;
        const canvasElement = canvasElementRef.current;
        canvasCtx = canvasElement.getContext("2d");
        drawingUtils = new DrawingUtils(canvasCtx);

        async function initializeData () {
            try{
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
                );

                handLandmarker = await HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                        delegate: "GPU"
                    },
                    runningMode: 'VIDEO',
                    numHands: 2
                });
                faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                      delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: 'VIDEO',
                    numFaces: 1
                });

                if(hasGetUserMedia){
                   
                    const constraints = {video: true};
                    
                    // Activate the webcam stream.
                    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                        video.srcObject = stream;
                        video.addEventListener("loadeddata", predictWebcam);
                                
                            
                        // 웹캠 켜지면 캔버스 위치 고정
                        video.addEventListener('canplay', ()=>{
                            canvasElement.style.width = video.videoWidth;                                canvasElement.style.height = video.videoHeight;
                            canvasElement.width = video.videoWidth;
                            canvasElement.height = video.videoHeight;
                            
                        });
                        
                    });
                }
                return handLandmarker;
                
                
            } catch(error) {
                console.error("Error loading hand landmarkers", error);
            }
            
        };
        initializeData();

        console.log('from useeffect ', from)
        window.addEventListener('beforeunload', onBeforeUnload);

        console.log('useEffect')
        return () => {
            window.removeEventListener('beforeunload', onBeforeUnload);
        };

    },[])

    useEffect(() => {

        const video = videoRef.current;
        const canvasElement = canvasElementRef.current;
        canvasCtx = canvasElement.getContext("2d");
        drawingUtils = new DrawingUtils(canvasCtx);

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
            const FRAME_RATE = 10;
            // const myHtmlTarget = document.getElementById("video-container");

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

            mySession.connect(token.token, { clientData: myUserName })
                .then(async () => {
                    const mediaStream = await ov.getUserMedia({
                        audioSource: false,
                        videoSource: undefined,
                        resolution: '320x180',
                        frameRate: FRAME_RATE
                    });
            
                    let videoTrack = mediaStream.getVideoTracks()[0];
                    // let video = document.createElement('video');
                    let video = document.getElementById('videoZone');
                    // video.srcObject = new MediaStream([videoTrack]);
                    
                    let canvas = canvasElementRef.current;
                    // let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    ctx.filter = 'grayscale(100%)';
                    video.addEventListener('play', () => {
                        let loop = () => {
                            if (!video.paused && !video.ended) {
                                ctx.drawImage(video, 0, 0, 300, 170);
                                setTimeout(loop, 1000 / FRAME_RATE); // Drawing at 10 fps
                            }
                        };
                        loop();
                    });
                    video.play();
            
                    let grayVideoTrack = canvas.captureStream(FRAME_RATE).getVideoTracks()[0];
                    let publisher = ov.initPublisher(
                        undefined,
                        {
                            audioSource: false,
                            videoSource: grayVideoTrack
                        }
                    );

                    mySession.publish(publisher);
                    setSession(mySession);
                    // setMainStreamManager(publisher);
                    setPublisher(publisher);
                })
                .catch((error) => {
                    console.log('There was an error connecting to the session:', error.code, error.message);
                });

            // mySession.connect(token.token, { clientData: myUserName })
            //     .then(async () => {
            //         let publisher = await ov.initPublisherAsync(undefined, {
            //             audioSource: false, 
            //             videoSource: undefined,
            //             publishAudio: true, 
            //             publishVideo: true, 
            //             resolution: '640x480',
            //             frameRate: 30,
            //             insertMode: 'APPEND', 
            //             mirror: false,
            //         });

            //         mySession.publish(publisher);
            //         setSession(mySession);
            //         // setMainStreamManager(publisher);
            //         setPublisher(publisher);
            //     })
            //     .catch((error) => {
            //         console.log('There was an error connecting to the session:', error.code, error.message);
            //     });




            // mySession.connect(token.token, { clientData: myUserName });
    
            // const publisher = await ov.initPublisherAsync(undefined, {
            //     audioSource: false,
            //     videoSource: undefined,
            //     publishAudio: true,
            //     publishVideo: true,
            //     resolution: '640x480',
            //     frameRate: 30,
            //     insertMode: 'APPEND',
            //     mirror: false,
            // });
    
            // console.log('mySession')
            // console.log(mySession)

            // mySession.publish(publisher);
    
            // // 여기서 세션 연결 후 상태 업데이트 및 UI 렌더링을 진행
            // setSession(mySession);
            // // setMainStreamManager(publisher);
            // setPublisher(publisher);
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
            const FRAME_RATE = 10;
            // const myHtmlTarget = document.getElementById("video-container");
            
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
    

            mySession.connect(token.token, { clientData: myUserName })
                .then(async () => {
                    const mediaStream = await ov.getUserMedia({
                        audioSource: false,
                        videoSource: undefined,
                        resolution: '320x180',
                        frameRate: FRAME_RATE
                    });
            
                    let videoTrack = mediaStream.getVideoTracks()[0];
                    let video = document.getElementById('videoZone');
                    // video.srcObject = new MediaStream([videoTrack]);
                    
                    let canvas = canvasElementRef.current;
                    // let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    ctx.filter = 'grayscale(100%)';
                    video.addEventListener('play', () => {
                        let loop = () => {
                            if (!video.paused && !video.ended) {
                                ctx.drawImage(video, 0, 0, 300, 170);
                                setTimeout(loop, 1000 / FRAME_RATE); // Drawing at 10 fps
                            }
                        };
                        loop();
                    });
                    video.play();
            
                    let grayVideoTrack = canvas.captureStream(FRAME_RATE).getVideoTracks()[0];
                    let publisher = ov.initPublisher(
                        undefined,
                        {
                            audioSource: false,
                            videoSource: grayVideoTrack
                        }
                    );

                    mySession.publish(publisher);
                    setSession(mySession);
                    // setMainStreamManager(publisher);
                    setPublisher(publisher);
                    setMyUserName(name);
                    setMySessionId(sessionId);
                })
                .catch((error) => {
                    console.log('There was an error connecting to the session:', error.code, error.message);
                });


            // mySession.connect(token.token, { clientData: name })
            //     .then(async () => {
            //         let publisher = await ov.initPublisherAsync(undefined, {
            //             audioSource: false, 
            //             videoSource: undefined,
            //             publishAudio: true, 
            //             publishVideo: true, 
            //             resolution: '640x480',
            //             frameRate: 30,
            //             insertMode: 'APPEND', 
            //             mirror: false,
            //         });

            //         mySession.publish(publisher);
            //         setSession(mySession);
            //         // setMainStreamManager(publisher);
            //         setPublisher(publisher);
            //     })
            //     .catch((error) => {
            //         console.log('There was an error connecting to the session:', error.code, error.message);
            //     });
            // mySession.connect(token.token, { clientData: name });
    
            // const publisher = await ov.initPublisherAsync(undefined, {
            //     audioSource: false,
            //     videoSource: undefined,
            //     publishAudio: true,
            //     publishVideo: true,
            //     resolution: '640x480',
            //     frameRate: 30,
            //     insertMode: 'APPEND',
            //     mirror: false,
            // });

            // console.log('mySession')
            // console.log(mySession)
    
            // mySession.publish(publisher);
    
            // setMyUserName(name);
            // setMySessionId(sessionId);
            // // 여기서 세션 연결 후 상태 업데이트 및 UI 렌더링을 진행
            // setSession(mySession);
            // // setMainStreamManager(publisher);
            // setPublisher(publisher);
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
        // fillTimePositionArray(fuck.hitObjects);

        audio.current = new Audio(selectedMusicRef.current.music_url);

    }

    // function fillTimePositionArray(objectData){
    //     console.log('filling arrays');
    //     startTimeArray.current=[];
    //     positionArray.current=[];
    //     for (const obj of objectData) {
    //         // 시작 시간과 위치만 배열에 담기
    //         startTimeArray.current.push(obj.startTime);
    //         positionArray.current.push(obj.position); 
    //     }
    // }


    return(
        <div className="containerSingleplayWaiting">
            <div>
                {mySessionId}
                <br />
                {myUserName}
            </div>
            
            <TitleSingleplay />
            <div className='camandmessagebox' style={{display:'flex'}}>
                <div className='mainSection'>
                    <div className='multicontainer'>
                    {/* <div className="gameContainerWaiting">
                        {<UserVideoComponent streamManager={publisher} /> }
                    </div> */}
                    {/* <div className='subContainer'>
                        <MusicCard musicList={musicList} selectedMusic={selectedMusic} handleMusicSelect={handleMusicSelect}  />
                        <button type="submit" className="startbutton" onClick={playGame}>START</button>
                    </div> */}
                    <div className='bigbox'>
                    <div id="video-container" className="col-md-6" style={{display:'flex'}}>
                        <div className='cambox1'>cambox1
                            <video id="videoZone" ref={videoRef} autoPlay playsInline style={{ display: 'none' }}></video>
                            <canvas id="canvasZone" ref={canvasElementRef} style={{ display: 'none' }}></canvas>
                            <UserVideoComponent streamManager={publisher} />
                            {/* {subscribers[0] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[0]} />
                            : null } */}
                        </div>
                        <div className='cambox2'>cambox2
                            {subscribers[0] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[0]}/>
                            : null }
                        </div>
                    </div>
                    <div style={{display:'flex'}}>
                        <div className='cambox3'>cambox3
                            {subscribers[1] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[1]}/>
                            : null }
                        </div>
                        <div className='cambox4'>cambox4
                            {subscribers[2] !== undefined ?
                            <UserVideoComponent streamManager={subscribers[2]}/>
                            : null }
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

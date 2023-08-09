
import { Link} from 'react-router-dom';
import { React, useState, useEffect, useRef } from 'react';
import { drawConnectors} from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import {
    FaceLandmarker,
    HandLandmarker,
    FilesetResolver,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import './Singleplay.css';
import '../../util/node.css';
import '../../util/effect.css';

import {createCircle, createPerfect, createGood, createBad} from "../../util/node.js";
import {createEffect} from "../../util/effect.js";


// import heroesTonight from '../../data/JanJi_HeroesTonight.mp3';
import redBone from '../../data/DonaldGlover_RedBone.mp3';

import drum from '../../data/drum.mp3';

// import jsonData from '../../data/JanJi_HeroesTonight.json';
import jsonData from '../../data/DonaldGlover_RedBone.json';

import Websocket from '../../webSocket/client/WebSocketClient'



function TitleSingleplay() {
    return (
        <div className="titleSingleplay">SINGLE PLAY</div>
    )
}



function Singleplay(){

    const [goodScore, setGoodScore] = useState(0);
    const [perfectScore, setPerfectScore] = useState(0);
    const [failedScore, setFailedScore] = useState(0);
    const [highestCombo, setHighestCombo] = useState(0);
    const [comboScore, setComboScore] = useState(0);
    
    let nowTime=-2;
    let audio = new Audio(redBone);
    let drumSound = new Audio(drum);
    let isGamePlaying = false;
    let gameStartTime = 0;
    const startTimeArray = [];
    const positionArray = [];

    let arrayIdx=0;
    let targets = [];
    let drawingUtils = null;
    let handLandmarker = null;
    let faceLandmarker = null;
    let handResults = null;
    let faceResults = null;

    const prevInside = [false, false];
    const inside = [false, false];

    const videoRef = useRef(null);
    const canvasElementRef = useRef(null);
    const playBtnRef = useRef(null);
    let canvasCtx = null;
    const root = document.getElementById('root');

    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
    
    // 데이터를 배열에 담기
    const hitObjects = jsonData.hitObjects;
    for (const obj of hitObjects) {
        // 시작 시간과 위치만 배열에 담기
        startTimeArray.push(obj.startTime);
        positionArray.push(obj.position); 
    }

    function makeNode(){
        
        // startTimeArray 배열을 순회하며 현재 시간과 비교하여 해당 시간에 맞는 타겟들을 추가합니다.
        // nowTime*1000 - 100 <= startTimeArray[ArrayIdx] <= nowTime*1000 + 100이 조건을 만족하면 노트를 화면에 생성
        // 위의 조건을 만족한다는 뜻은 현재 진행시간과 원래 찍혀있는 노드를 비교하여 일치하면 됨
        // 구간(-100 ~ 100)의 단위 100은  0.1초를 의미 -> 0.2초의 구간 안에 잡히면 data.json에 있는 노트 시간으로 노트 생성 -> 노트 생성 오차가 생기지 않음
        // console.log(startTimeArray[ArrayIdx]);
        if (nowTime*1000 >=  startTimeArray[arrayIdx] - 1000) {
            const newTarget = {
                name: 'circle', // 모양은 원
                elem: null,
                elemBack: null,
                elemFill: null,
                createdTime: startTimeArray[arrayIdx]-1000, // 생성 시간은 data.json
                curSize: 0,
                done: false, // 도형 상태
                x: positionArray[arrayIdx][0] / 500, // Data.json의 posion정보를 받아와서 0~1 사이의 값으로 반환, 이건 x축
                y: positionArray[arrayIdx][1] / 500 // 위와 같음, 이건 y
            };
            const elems = createCircle(newTarget.x, newTarget.y, videoRef.current, root);
            newTarget.elem = elems[0];
            newTarget.elemBack = elems[1];
            newTarget.elemFill = elems[2];
            targets.push(newTarget); 
            // 모든 작업이 끝나면 다음 노트 확인을 위한 인덱스 변수의 증가    
            arrayIdx++;
        }
    }
    
    function predictWebcam(){
        let now = performance.now();
        handResults = handLandmarker.detectForVideo(videoRef.current, now);
        faceResults = faceLandmarker.detectForVideo(videoRef.current, now);
        
        // 게임이 실행중일 때 진행
        if(isGamePlaying){

            makeNode();
            manageTargets();
            
            if(nowTime<0){
                // nowtime을 -2초부터 0초까지 실행시켜야함
                nowTime = -2 + (performance.now() - gameStartTime)/1000;
            } else {
                nowTime = audio.currentTime;
                
            }

            // 음악이 끝나면 대기상태로 전환
            if(audio.ended){
                nowTime=-2;
                isGamePlaying=false;
                audio.currentTime=0;
            }
        }

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

                // 손을 쥐거나 펴서 이전과의 손 상태가 바뀌었는지 여부 판별로 그랩 적용
                if(prevInside[i] === false && inside[i] === true){

                    // 캐치 이펙트 생성
                    createEffect(mid.x, mid.y, videoRef.current, root);
                    // 드럼 소리 재생
                    playDrum();

                    // 목표물 배열 순회하며 캐치 판정하기
                    targets.forEach(function(obj){

                        // 상태가 yet인 타겟 대상만 검사 
                        if(obj.done === false){

                            // 캐치했을 때 알고리즘 조건문
                            if((obj.x<mid.x+0.1 && obj.x>mid.x-0.1) && (obj.y<mid.y+0.1 && obj.y>mid.y-0.1)){

                                // 적정 크기때 캐치하면 catched, 너무 빠르거나 느리면 failed
                                if(nowTime < obj.createdTime/1000 + 0.500 || nowTime > obj.createdTime/1000 + 1.500){
                                    
                                    setComboScore(0);
                                    setFailedScore((prev)=>prev+1);
                                    createBad(obj.elem);
                                    obj.elemFill.style.animation =  'failedCircleFill 0.5s forwards';
                                    obj.done = true;
                                    obj.elemBack.remove();
                                    setTimeout(()=>{obj.elem.remove()},500);

                                } else if(nowTime > obj.createdTime/1000 + 0.900 && nowTime < obj.createdTime/1000 + 1.100){

                                    setPerfectScore((prev)=>prev+1);
                                    setComboScore((prev)=>prev+1);
                                    createPerfect(obj.elem);
                                    obj.elemFill.style.animation =  'perfectCircleFill 0.5s forwards';
                                    obj.done = true;
                                    obj.elemBack.remove();
                                    setTimeout(()=>{obj.elem.remove()},500);

                                } 
                                else {

                                    setGoodScore((prev)=>prev+1);
                                    setComboScore((prev)=>prev+1);
                                    createGood(obj.elem);
                                    obj.elemFill.style.animation =  'goodCircleFill 0.5s forwards';
                                    obj.done = true;
                                    obj.elemBack.remove();
                                    setTimeout(()=>{obj.elem.remove()},500);
                                }
                            }

                        }

                    })
                }

                // 기존 주먹 여부 변경
                prevInside[i] = inside[i];
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

    function playGame() {
        if (audio && !isGamePlaying) {

            gameStartTime = performance.now();
            isGamePlaying=true;
            arrayIdx=0;

            setPerfectScore(0);
            setGoodScore(0);
            setFailedScore(0);
            setHighestCombo(0);
            setComboScore(0);

            setTimeout(function(){
                audio.loop = false;
                audio.volume = 0.3;
                audio.play();
            },2000);
        };
    }

    function playDrum() {
        if (drumSound) {
            drumSound.currentTime = 0;
            drumSound.loop = false;
            drumSound.volume = 1;
            drumSound.play();
        }
    }

    function manageTargets(){
        targets.forEach((obj) => {
            // 처리되지 않은 타겟만 조사
            if (obj.done !== true) {
                // 타겟이 일정 크기 이상 커지면 자동 비활성화
                if (obj.done === false && nowTime > obj.createdTime/1000 + 1.500) {
                    setComboScore(0);
                    setFailedScore((prev)=>prev+1);
                    createBad(obj.elem);
                    obj.elemFill.style.animation =  'failedCircleFill 0.5s forwards';
                    obj.elemBack.remove();
                    obj.done = true;
                    setTimeout(()=>{obj.elem.remove()},500);
                }
            }
        });
    }


    useEffect(()=>{
        const video = videoRef.current;
        const canvasElement = canvasElementRef.current;
        canvasCtx = canvasElement.getContext("2d");
        drawingUtils = new DrawingUtils(canvasCtx);
        const playBtn = playBtnRef.current;
        playBtn.addEventListener('click',playGame);

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
                                
                        console.log("using media!");
                            
                        // 웹캠 켜지면 캔버스 위치 고정
                        video.addEventListener('canplay', ()=>{
                            canvasElement.style.width = video.videoWidth;                                canvasElement.style.height = video.videoHeight;
                            canvasElement.width = video.videoWidth;
                            canvasElement.height = video.videoHeight;
                            
                            console.log('screen adjusting!');
                        });
                        
                    });
                }
                return handLandmarker;
                
                
            } catch(error) {
                console.error("Error loading hand landmarkers", error);
            }
            
        };
        initializeData();

    },[])
        
    useEffect(()=>{
        if(comboScore>highestCombo){
            setHighestCombo(comboScore);
        }
        
    },[comboScore]);   
    

    return(
        <div>
            {/* <ButtonHome/> */}
            <div className="containerSingleplay">
                <TitleSingleplay />
              
                <button id="gameStart" ref={playBtnRef}>게임시작</button>
                <div>
                    <div>perfect: {perfectScore}</div>
                    <div>good: {goodScore}</div>
                    <div>failed: {failedScore}</div>
                    <div>highest combo: {highestCombo}</div>
                    <div>current combo: {comboScore}</div>
                </div>
                <div>
                <div className="gameContainer">
                    <video id="videoZone" ref={videoRef} autoPlay playsInline></video>
                    <canvas id="canvasZone" ref={canvasElementRef}></canvas>
                </div>
                <Websocket />
                </div>
            </div>

        </div>
    )
}

export default Singleplay;
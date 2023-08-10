import { Link} from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { React, useState, useEffect, useRef } from 'react';
import { drawConnectors} from '@mediapipe/drawing_utils';
import { HAND_CONNECTIONS } from '@mediapipe/hands';
import {
    FaceLandmarker,
    HandLandmarker,
    FilesetResolver,
    DrawingUtils,
} from "@mediapipe/tasks-vision";
import './MultiplayWaiting.css';
import '../../util/node.css';
import '../../util/effect.css';



// import Websocket from '../../components/webSocket/client/WebSocketClient'


function TitleSingleplay() {
    return (
        <div className="titleSingleplay">Multi PLAY</div>
    )
}

function SingleplayWaiting(){

    let drawingUtils = null;
    let handLandmarker = null;
    let faceLandmarker = null;
    let handResults = null;
    let faceResults = null;


    const videoRef = useRef(null);
    const canvasElementRef = useRef(null);
    let canvasCtx = null;
    const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
    
    const [selectedMusic, setSelectedMusic] = useState(null);
    const data = {
        "musicList": [
            {
              "id": 1,
              "title": "HeroesTonight",
              "artist": "Janji",
              "music_url": "../../data/JanJi_HeroesTonight.mp3",
              "json_url": "../../data/JanJi_HeroesTonight.json"
            },
            {
              "id": 2,
              "title": "Test1",
              "artist": "JanJi",
              "music_url": "../../data/Test1.mp3",
              "json_url": "../../data/Test1.json"
            },
            {
              "id": 3,
              "title": "Test2",
              "artist": "Janji",
              "music_url": "../../data/Test2.mp3",
              "json_url": "../../data/Test2.json"
            }
            // 필요한 만큼 곡 정보를 추가할 수 있습니다.
          ]
      };
      const musicList = data.musicList;
      



    
    function predictWebcam(){
        let now = performance.now();
        handResults = handLandmarker.detectForVideo(videoRef.current, now);
        

        // 손그리기
        faceResults = faceLandmarker.detectForVideo(videoRef.current, now);
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
        
        
        window.requestAnimationFrame(predictWebcam);

    }
    
    function isInside(palm, tips) {
        // 손바닥 사각형의 좌표와 손가락 끝 좌표를 입력받아 주먹을 쥐었는지 판별하는 함수
        // 레이 캐스팅(Ray Casting) 알고리즘
        const n = 4; // 손바닥을 사각형으로 인식
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
    
                if(y == y1 && y == y2 && x >= Math.min(x1, x2)  && x <= Math.max(x1, x2)) {
                    // 손바닥 사각형의 선분 위에 있다 => 들어왔다
                    count++;
                    break;
                }
    
                if(y > Math.min(y1, y2) && y <= Math.max(y1, y2) && x <= Math.max(x1, x2) && y1 != y2) {
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





    useEffect(()=>{
        const video = videoRef.current;
        const canvasElement = canvasElementRef.current;
        canvasCtx = canvasElement.getContext("2d");
        drawingUtils = new DrawingUtils(canvasCtx);

        async function createHandLandmarker () {
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
                            canvasElement.style.width = video.videoWidth;                                
                            canvasElement.style.height = video.videoHeight;
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
        createHandLandmarker();

       

    },[])

    const handleMusicSelect = (music) => {
        setSelectedMusic(music);
        console.log(music);
        console.log("선택됨");
      };
  
    

    

    return(
        <div>
            {/* <ButtonHome/> */}
            <div className="containerSingleplay">
                <TitleSingleplay />
                <div>
                <div className="gameContainer">
                    <video id="videoZone" ref={videoRef} autoPlay playsInline></video>
                    <canvas id="canvasZone" ref={canvasElementRef}></canvas>
                </div>
                {/* <Websocket /> */}
                </div>
            

                <div>
        <h2>음악 선택</h2>
        <ul>
          {musicList.map((music) => (
            <li key={music.id} onClick={() => handleMusicSelect(music)}>
              {music.title} - {music.artist}
            </li>
          ))}
        </ul>
        {selectedMusic && (
          <div>
            <h3>선택된 곡:</h3>
            <p>제목: {selectedMusic.title}</p>
            <p>아티스트: {selectedMusic.artist}</p>
            <audio controls src={selectedMusic.music_url}>
              {/* <source src={selectedMusic.music_url} type="audio/mp3" /> */}
              {/* <source src={selectedMusic.json_url} type="json" /> */}
            </audio>
          </div>
        )}
      </div>
    </div>
    </div>

    )
}

export default SingleplayWaiting;
import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

import { createEffect } from "./effect.js";
import {createCircle} from "./node.js";


const startTimeArray = [];
const positionArray = [];

const demosSection = document.getElementById("demos");
const scoreBoard = document.getElementById("score");
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

let handLandmarker = undefined;
let enableWebcamButton;
let webcamRunning = false;
let lastVideoTime = -1;
let results = undefined;

let score = 0;
// 목표물 관련 변수
const objSize = 60;
const targets = []; 

let prevInside = [false, false];
let inside = [false, false];

fetch('./JanJi_HeroesTonight.json')
  .then(response => response.json())
  .then(jsonData => {
    // 데이터를 배열에 담기
    const hitObjects = jsonData.hitObjects;

    for (const obj of hitObjects) {
      const startTime = obj.startTime;
      const position = obj.position;
      // 시작 시간과 위치만 배열에 담기 
      startTimeArray.push(startTime);
      positionArray.push(position);
    }
    // 배열 출력
    console.log("startTimeArray:", startTimeArray);
    console.log("positionArray:", positionArray);

}) .catch(error => console.error("Error fetching JSON:", error));



// 버튼을 눌렀을 때 음악 재생 및 노트 생성
// 음악 재생
// 시간 파악을 위한 변수
let ArrayIdx=0;
let audio = new Audio('./JanJi_HeroesTonight.mp3');
let nowTime=0;
const originTime = Date.now();
document.querySelector(".btn1").addEventListener("click", function () {
    audio.loop = false; // 반복재생하지 않음
    audio.volume = 0.5; // 음량 설정
    audio.play(); // sound1.mp3 재생
    ArrayIdx=0;
    // update();
});

document.querySelector(".btn2").addEventListener("click", function () {
    audio.pause(); // sound1.mp3 재생
});

document.querySelector(".btn3").addEventListener("click", function () {
    audio.play(); // sound1.mp3 재생
});




// 웹캠 실행 가능한지 검사 (getUserMedia() 있는지 확인)
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
console.log(navigator.mediaDevices.getUserMedia);
// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    enableWebcamButton = document.getElementById("webcamButton");
    enableWebcamButton.addEventListener("click", enableCam);
    
} else {
    console.warn("getUserMedia() is not supported by your browser");
}

// 손 랜드마커 설정
const createHandLandmarker = async () => {
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
    demosSection.classList.remove("invisible");
};
createHandLandmarker();

// function update(){
//     setInterval(() => {
//         makeNode();

//         manageTargets();
//     }, 0);
// }

// 영상이 로드될때마다 실행되는 함수
async function predictWebcam() {
    
    makeNode();

    manageTargets();

    // 현재 비디오 장면으로 랜드마크 설정
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    
    // 손 랜드마크 그리기
    // canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawConnectors(canvasCtx, landmarks, HandLandmarker.HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 5
            });
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: 2 });
        }
    }
    // canvasCtx.restore();

    // Call this function again to keep predicting when the browser is ready.
    if (webcamRunning === true) {
        window.requestAnimationFrame(predictWebcam);
    }

    // 손 감지되면 실행
    if(results.landmarks.length>0){

        // 양손 대상으로 진행
        for(let i=0; i<results.landmarks.length; i++){

            //////////////////////////////////////////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////////////////////////////////
            // 좌표의 진행방향은 좌하향임 (캠마다 좌우반전 설정이 달라져서 바뀔수도)
            // results.landmarks[손 객체의 인덱스][손가락 인덱스]
            // 조악한 예시 알고리즘;;
            // 중지 꼭대기 좌표
            let top = results.landmarks[i][12];
            // 중지 뿌리 좌표
            let mid = results.landmarks[i][9];
            let bottom = results.landmarks[i][0];
            // 손바닥 좌표
            let palm = [results.landmarks[i][2], results.landmarks[i][5], results.landmarks[i][17], results.landmarks[i][0]];
            // 엄지를 제외한 손가락 끝의 좌표
            let tips = [results.landmarks[i][8], results.landmarks[i][12], results.landmarks[i][16], results.landmarks[i][20]];

            // 손가락 끝이 손바닥 사각형 안에 들어갔는지 저장
            inside[i] = isInside(palm, tips);

            // 손을 쥐거나 펴서 이전과의 손 상태가 바뀌었는지 여부 판별로 그랩 적용
            if(prevInside[i] === false && inside[i] === true){

                // 캐치 이펙트 생성
                createEffect((mid.x + bottom.x) / 2, (mid.y + bottom.y) / 2);

                // 목표물 배열 순회하며 캐치 판정하기
                targets.forEach(function(obj,i){

                    // 상태가 yet인 타겟 대상만 검사 
                    if(obj.status === 'yet'){

                        // 캐치했을 때 알고리즘 조건문
                        if((obj.x<mid.x+0.1 && obj.x>mid.x-0.1) && (obj.y<mid.y+0.1 && obj.y>mid.y-0.1)){

                            // 적정 크기때 캐치하면 catched, 너무 빠르거나 느리면 failed
                            if(nowTime > obj.createdTime/1000 + 0.500 && nowTime < obj.createdTime/1000 + 1.500){
                                obj.status = 'catched';
                                scoreBoard.textContent = ++score;
                                obj.elem.style.animation = "manageCircle 1s forwards";
                                obj.elemFill.style.animation =  'catchedCircleFill 1s forwards';
                                obj.status = 'done';
                                deleteElements(obj.elem, obj.elemFill, 3000);
                                
                                
                            } else {
                                obj.status = 'failed';
                                obj.elem.style.animation = "manageCircle 1s forwards";
                                obj.elemFill.style.animation =  'failedCircleFill 1s forwards';
                                obj.status = 'done';
                                deleteElements(obj.elem, obj.elemFill, 3000);
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
}

// 웹캠 활성화
function enableCam(event) {
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }

    if (webcamRunning === true) {
        webcamRunning = false;
        enableWebcamButton.innerText = "ENABLE PREDICTIONS";
    } else {
        webcamRunning = true;
        enableWebcamButton.innerText = "DISABLE PREDICTIONS";
    }

    // getUsermedia parameters.
    const constraints = {video: {frameRate:{max:60}}};

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
        // video.requestVideoFrameCallback(predictWebcam);
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

function makeNode(){
    nowTime = audio.currentTime;
    // console.log(performance.now());
    // console.log(nowTime, (Date.now()-originTime)/1000);
    
    // startTimeArray 배열을 순회하며 현재 시간과 비교하여 해당 시간에 맞는 타겟들을 추가합니다.
    // nowTime*1000 - 100 <= startTimeArray[ArrayIdx] <= nowTime*1000 + 100이 조건을 만족하면 노트를 화면에 생성
    // 위의 조건을 만족한다는 뜻은 현재 진행시간과 원래 찍혀있는 노드를 비교하여 일치하면 됨
    // 구간(-100 ~ 100)의 단위 100은  0.1초를 의미 -> 0.2초의 구간 안에 잡히면 data.json에 있는 노트 시간으로 노트 생성 -> 노트 생성 오차가 생기지 않음
    // console.log(startTimeArray[ArrayIdx]);
    if (nowTime*1000 >=  startTimeArray[ArrayIdx] - 1000) {
        // 노트 생성을 위해 targets.push를 사용    
        targets.push({
            name: 'circle', // 모양은 원
            elem: null,
            elemFill: null,
            createdTime: startTimeArray[ArrayIdx]-1200, // 생성 시간은 data.json
            curSize: 0,
            status: 'yet', // 도형 상태
            x: positionArray[ArrayIdx][0] / 500, // Data.json의 posion정보를 받아와서 0~1 사이의 값으로 반환, 이건 x축
            y: positionArray[ArrayIdx][1] / 500 // 위와 같음, 이건 y
        });
        const lastTarget = targets[targets.length-1];
        const elems = createCircle(lastTarget.x, lastTarget.y);
        lastTarget.elem = elems[0];
        lastTarget.elemFill = elems[1];
        console.log('circle created!');
        // 상황파악을 위한 콘솔
        // console.log(ArrayIdx);
        // console.log(startTimeArray[ArrayIdx]);
        // console.log(nowTime*1000);
        // 모든 작업이 끝나면 다음 노트 확인을 위한 인덱스 변수의 증가    
        ArrayIdx++;
    }
}

function manageTargets(){
    targets.forEach((obj) => {
        // 상태가 done이 아닌 타겟들만 그리기
        if (obj.status !== 'done') {

            // 타겟이 일정 크기 이상 커지면 자동 비활성화
            if (obj.status === 'yet' && nowTime > obj.createdTime/1000 + 1.500) {
                obj.status = 'failed';
                // obj.elem.remove();
                obj.elem.style.animation = "manageCircle 1s forwards";
                obj.elemFill.style.animation =  'failedCircleFill 1s forwards';
                // setTimeout(() => { obj.status = 'done' }, 500);
                obj.status = 'done';
                deleteElements(obj.elem, obj.elemFill, 3000);
            }
        }
    });
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

// 엘리먼트 삭제하는 유틸
function deleteElements (elA, elB, seconds){
    setTimeout(()=>{
        elA.remove();
        elB.remove();
    },seconds);
}
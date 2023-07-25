import {
    HandLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

// 섹션
const demosSection = document.getElementById("demos");

// 변수들
let handLandmarker = undefined;
let runningMode = "VIDEO";
let enableWebcamButton;
let webcamRunning = false;
let lastVideoTime = -1;

// 랜드마크 결과물
let results = undefined;

// 목표물 관련 변수
const objSize = 60;
const targets = []; 

// 점수
let score = 0;
const scoreBoard = document.getElementById("score");


// 비디오, 손 캔버스, 타겟 캔버스
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// 목표물이 담길 캔버스 및 이미지
const objCanvasElement = document.getElementById("object_canvas");
const objCanvasCtx = objCanvasElement.getContext("2d");

// 딸기 (레거시)
const imgElem = new Image();
imgElem.src = 'img/berry.png';

// 타겟 테두리
const emptyCircleElem = new Image();
emptyCircleElem.src = 'img/emptycircle.png';
emptyCircleElem.addEventListener('load', () => {
    objCanvasCtx.drawImage(emptyCircleElem, 10, 10,100,100); // 그릴 이미지 엘리먼트, x, y, width ,height
});

// 타겟 배경색
const fillCircleElem = new Image();
fillCircleElem.src = 'img/fillcircle.png';
fillCircleElem.addEventListener('load', () => {
    objCanvasCtx.drawImage(fillCircleElem, 10, 10,100,100); // 그릴 이미지 엘리먼트, x, y, width ,height
});

// good, bad 텍스트
const goodElem = new Image();
goodElem.src = 'img/good.png';
const badElem = new Image();
badElem.src = 'img/bad.png';

// 4초마다 타깃 생성에서 배열에 집어넣기
// setInterval(() => {
//     targets.push({name:'circle',createdTime:Date.now(), curSize:0, status:'yet', x:Math.random()/2 +0.25, y:Math.random()/2 +0.25})}
// , 2000);


// json으로 데이터 가져오기
// JSON 파일 경로
const startTimeArray = [];
const positionArray = [];

fetch('./data.json')
  .then(response => response.json())
  .then(jsonData => {
    // 데이터를 배열에 담기
    const hitObjects = jsonData.hitObjects;

    for (const obj of hitObjects) {
      const startTime = obj.startTime;
      const position = obj.position;
      // 시작 시간과 위치만 배열에 담기 
      startTimeArray.push(startTime - 500);
      positionArray.push(position);
    }
    // 배열 출력
    console.log("startTimeArray:", startTimeArray);
    console.log("positionArray:", positionArray);

  })
  .catch(error => console.error("Error fetching JSON:", error));


// 게임 시작 시간 찍기

// 버튼을 눌렀을 때 음악 재생 및 노트 생성
// 음악 재생
// 시간 파악을 위한 변수
let startTime=null;
let positionArrayIdx=0;
let audio = new Audio('./Dusty_Road.mp3');
document.querySelector(".btn1").addEventListener("click", function () {
    audio.loop = false; // 반복재생하지 않음
    audio.volume = 0.5; // 음량 설정
    audio.play(); // sound1.mp3 재생
    startTime = performance.now();
    positionArrayIdx=0;
  });

  document.querySelector(".btn2").addEventListener("click", function () {
    audio.pause(); // sound1.mp3 재생
  });

  document.querySelector(".btn3").addEventListener("click", function () {
    audio.play(); // sound1.mp3 재생
  });

// 타겟들 상태에 따른 처리
setInterval(function() {
    const nowTime = performance.now();

    // startTimeArray 배열을 순회하며 현재 시간과 비교하여 해당 시간에 맞는 타겟들을 추가합니다.
    for (const time of startTimeArray) {
        if (startTime + time <= nowTime + 2 && startTime + time >= nowTime - 2) {
            
            targets.push({
                name: 'circle',
                createdTime: nowTime,
                curSize: 0,
                status: 'yet',
                x: positionArray[positionArrayIdx][0] / 500,
                y: positionArray[positionArrayIdx][1] / 500
            });
            positionArrayIdx++;
            console.log(positionArrayIdx);
            console.log(time);
            console.log(positionArray[positionArrayIdx][0] / 500);
            console.log(positionArray[positionArrayIdx][1] / 500);

        }

    }

    // 타겟들 상태에 따른 처리 로직은 별도의 setInterval 함수 안에 있을 필요 없이 한 곳에서 처리하면 됩니다.
    targets.forEach((obj) => {
        // 상태가 done이 아닌 타겟들만 그리기
        if (obj.status !== 'done') {
            obj.curSize = (nowTime - obj.createdTime) / 50;
            drawObjects();

            // 타겟이 일정 크기 이상 커지면 자동 비활성화
            if (obj.status === 'yet' && obj.curSize > objSize + 5) {
                obj.status = 'failed';
                setTimeout(() => { obj.status = 'done' }, 500);
            }
        }
    });
}, 0);    

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
        runningMode: runningMode,
        numHands: 2
    });
    demosSection.classList.remove("invisible");
};
createHandLandmarker();

// 타겟 그리기 
function drawObjects(){
    objCanvasCtx.clearRect(0, 0, objCanvasElement.width, objCanvasElement.height);
    targets.forEach(function(obj,i) {
        // status가 done이 아닐때 그리기
        // yet은 초기 상태, catched는 성공 상태, failed는 실패 상태, done은 타겟 수명 끝난 상태
        if(obj.status === 'yet'){
            objCanvasCtx.drawImage(emptyCircleElem, (1-obj.x)*video.videoWidth - (objSize/2), (obj.y)*video.videoHeight - (objSize/2), objSize, objSize);
            objCanvasCtx.drawImage(fillCircleElem, (1-obj.x)*video.videoWidth - (obj.curSize/2), (obj.y)*video.videoHeight - (obj.curSize/2), obj.curSize, obj.curSize);
            
        } else if(obj.status === 'catched') {
            objCanvasCtx.drawImage(goodElem, (1-obj.x)*video.videoWidth - (objSize/2), (obj.y)*video.videoHeight - (objSize/2), objSize, objSize);

        } else if(obj.status === 'failed') {
            objCanvasCtx.drawImage(badElem, (1-obj.x)*video.videoWidth - (objSize/2), (obj.y)*video.videoHeight - (objSize/2), objSize, objSize);
        }
    });
    
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
    
            objCanvasElement.style.width = video.videoWidth;
            objCanvasElement.style.height = video.videoHeight;
            objCanvasElement.width = video.videoWidth;
            objCanvasElement.height = video.videoHeight;
            console.log('screen adjusting!');
        });

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

let prevInside = false;
let inside = false;

// 영상이 로드될때마다 실행되는 함수
async function predictWebcam() {
    
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
            // 손바닥 좌표
            let palm = [results.landmarks[i][2], results.landmarks[i][5], results.landmarks[i][17], results.landmarks[i][0]];
            // 엄지를 제외한 손가락 끝의 좌표
            let tips = [results.landmarks[i][8], results.landmarks[i][12], results.landmarks[i][16], results.landmarks[i][20]];

            // 손가락 끝이 손바닥 사각형 안에 들어갔는지 저장
            inside = isInside(palm, tips);

            // 손을 쥐거나 펴서 이전과의 손 상태가 바뀌었는지 여부 판별로 그랩 적용
            if(prevInside != inside){
                
                // 기존 주먹 여부 변경
                prevInside = inside;

                // 목표물 배열 순회하며 캐치 판정하기
                targets.forEach(function(obj,i){

                    // 상태가 yet인 타겟 대상만 검사 
                    if(obj.status === 'yet'){

                        // 캐치했을 때 알고리즘 조건문
                        if((obj.x<mid.x+0.05 && obj.x>mid.x-0.05) && (obj.y<mid.y+0.05 && obj.y>mid.y-0.05)){

                            // 적정 크기때 캐치하면 catched, 너무 빠르거나 느리면 failed
                            if(obj.curSize > objSize-5 && obj.curSize < objSize+5){
                                obj.status = 'catched';
                                scoreBoard.textContent = ++score;
                                console.log('scored!!');
                                setTimeout(()=>{obj.status = 'done'},500);
                            } else {
                                obj.status = 'failed';
                                setTimeout(()=>{obj.status = 'done'},500);
                            }
                        }

                    }

                })
            }
        }
        
        ///////////////////////////////////////////////////////////////////////////////////////////
        ///////////////////////////////////////////////////////////////////////////////////////////
    }
}
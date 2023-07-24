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
setInterval(() => {
    targets.push({name:'circle',createdTime:Date.now(), curSize:0, status:'yet', x:Math.random()/2 +0.25, y:Math.random()/2 +0.25})}
, 2000);

// 타겟들 상태에 따른 처리
setInterval(function(){
    targets.forEach((obj)=>{
        
        // 상태가 done이 아닌 타겟들만 그리기
        if(obj.status!=='done'){
            obj.curSize = (Date.now() - obj.createdTime)/50;
            drawObjects();

            // 타겟이 일정 크기 이상 커지면 자동 비활성화
            if(obj.status === 'yet' && obj.curSize > objSize + 5){
                obj.status = 'failed';
                setTimeout(()=>{obj.status = 'done'},500);
            }

        }
    })  
},0);

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
            if(top.y>mid.y){

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
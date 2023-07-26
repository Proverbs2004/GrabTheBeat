// 비디오, 손 캔버스, 타겟 캔버스
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// 목표물이 담길 캔버스 및 이미지
const objCanvasElement = document.getElementById("object_canvas");
const objCanvasCtx = objCanvasElement.getContext("2d");

// 타겟 캔버스에 이벤트 리스너를 추가.
// window.addEventListener('click', event => renderEffect(event))
// objCanvasElement.addEventListener('click', event => renderEffect(event));
objCanvasElement.addEventListener('grab', event => renderEffect(event));

// 이펙트를 렌더링하는 이벤트 함수
function renderEffect(event) {
  console.log("grab!");

  // effect용 div를 생성.
  let effect = document.createElement('div');
  // 해당 div를 body에 추가.
  document.body.appendChild(effect);
  // objCanvasElement.appendChild(effect);
  // effect div에 effect 클래스 추가.
  effect.classList.add('effect');
  // effect div의 위치 조정.
  console.log("event.pageX:", event.pageX);
  console.log("event.pageY:", event.pageY);
  effect.style.left = event.pageX - 1 + 'px';
  effect.style.top = event.pageY - 1 + 'px';
  // effect div에 애니메이션 클래스 추가.
  effect.classList.add('effect_animating');
  // 2초 뒤에 effect 제거 함수 호출.
  setTimeout(()=>removeEffect(effect), 2000);
}

// 이펙트를 제거하는 함수
function removeEffect(effect) {
  // effect div에 effect 제거 클래스 추가.
  effect.clasList.add('effect_removing');
  // 1초 뒤에 effect div 제거.
  setTimeout(()=>document.body.removeChild(effect), 1000);
}

function createEffect(x, y) {
  console.log("createEffect");

  // 그랩 이펙트 추가
  const effectBasePosition = objCanvasElement.getBoundingClientRect();

  // 그랩 절대 위치
  // scroll의 Y 좌표 + 비디오 컴포넌트의 상대 위치 + 비디오에서의 손 랜드마크 위치(0.0 ~ 1.0) * 비디오 가로 길이
  let grabX = window.scrollX + effectBasePosition.left + ((1.0 - x) * video.videoWidth);
  let grabY = window.scrollY + effectBasePosition.top + (y * video.videoHeight);

  // 그랩 커스텀 이벤트 생성
  let grab = new MouseEvent('grab', {
      bubbles: true,
      cancelable: true,
      clientX: grabX,
      clientY: grabY
  })
  
  // grab 이벤트 발생
  objCanvasElement.dispatchEvent(grab);
}

export { createEffect };
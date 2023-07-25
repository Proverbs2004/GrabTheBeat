console.log("Success Connection: effect.js")

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
  effect.style.left = event.pageX - 25 + 'px';
  effect.style.top = event.pageY - 25 + 'px';
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


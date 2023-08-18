

export function createEffect(x, y) {
	const video = document.getElementById("webcam");
  
  let effect = document.createElement('div');
  
  document.body.appendChild(effect);
  effect.classList.add('effect');

  setGamePosition(video, effect, x, y, 2, 2);
  effect.style.animation = 'click-effect 0.3s';

  setTimeout(()=>{effect.remove()},2000);

}

function setGamePosition(frame, el, x, y, w, h){
  const rect = frame.getBoundingClientRect();
  const newX = window.scrollX + rect.left + ((1.0 - x) * frame.videoWidth) - w/2;
  const newY = window.scrollY + rect.top + (y * frame.videoHeight) - h/2;
  el.style.left = newX + 'px';
  el.style.top = newY + 'px';

}

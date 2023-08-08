

export function createEffect(x, y, video, root) {
  
  let effect = document.createElement('div');
  
  effect.classList.add('effect');
  root.appendChild(effect);

  setGamePosition(video, effect, x, y, 2, 2);

  setTimeout(()=>{effect.remove()},500);

}

function setGamePosition(frame, el, x, y, w, h){
  const rect = frame.getBoundingClientRect();
  const newX = window.scrollX + rect.left + ((1.0 - x) * frame.videoWidth) - w/2;
  const newY = window.scrollY + rect.top + (y * frame.videoHeight) - h/2;
  el.style.left = newX + 'px';
  el.style.top = newY + 'px';

}



export function createEffect(x, y, canvas, root) {
  
  let effect = document.createElement('div');
  
  effect.classList.add('effect');
  root.appendChild(effect);

  setGamePosition(canvas, effect, x, y, 2, 2);

  setTimeout(()=>{effect.remove()},500);

}

function setGamePosition(frame, el, x, y, w, h){
  const rect = frame.getBoundingClientRect();
  const newX = window.scrollX + rect.left + ((1.0 - x) * frame.width) - w/2;
  const newY = window.scrollY + rect.top + (y * frame.height) - h/2;
  el.style.left = newX + 'px';
  el.style.top = newY + 'px';
}

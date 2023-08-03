

export function createCircle(x, y, video, root){

    let circle = document.createElement('div');
    let circleFill = document.createElement('div');

    circle.classList.add('node-circle');
    circleFill.classList.add('node-circle-fill');

    circle.appendChild(circleFill);
    root.appendChild(circle);
    
    setGamePosition(video, circle, x, y, 60, 60);

    return [circle,circleFill];
}

function setGamePosition(frame, el, x, y, w, h){
    const rect = frame.getBoundingClientRect();
    const newX = window.scrollX + rect.left + ((1.0 - x) * frame.videoWidth) - w/2;
    const newY = window.scrollY + rect.top + (y * frame.videoHeight) - h/2;
    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
  
  }


export function createCircle(x, y, canvas, root){

    let circle = document.createElement('div');
    let circleBack = document.createElement('div');
    let circleFill = document.createElement('div');


    circle.classList.add('node-circle');
    circleBack.classList.add('node-circle-back');
    circleFill.classList.add('node-circle-fill');

    circle.appendChild(circleFill);
    circle.appendChild(circleBack);
    root.appendChild(circle);
    
    setGamePosition(canvas, circle, x, y, 60, 60);

    return [circle, circleBack, circleFill];
}

export function createPerfect(circle){
    const judge = document.createElement('div');
    judge.innerText = 'Perfect!'
    judge.classList.add('judge-perfect');
    circle.appendChild(judge);
    setTimeout(()=>{judge.remove()},300);
}

export function createGood(circle){
    const judge = document.createElement('div');
    judge.innerText = 'Good!'
    judge.classList.add('judge-good');
    circle.appendChild(judge);
    setTimeout(()=>{judge.remove()},300);
    
}

export function createBad(circle){
    const judge = document.createElement('div');
    judge.innerText = 'Bad!'
    judge.classList.add('judge-bad');
    circle.appendChild(judge);
    setTimeout(()=>{judge.remove()},300);
}

function setGamePosition(frame, el, x, y, w, h){
    const rect = frame.getBoundingClientRect();
    const newX = window.scrollX + rect.left + ((1.0 - x) * frame.width) - w/2;
    const newY = window.scrollY + rect.top + (y * frame.height) - h/2;
    el.style.left = newX + 'px';
    el.style.top = newY + 'px';
  
  }
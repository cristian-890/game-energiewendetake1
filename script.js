const cards = [
  {word:'Balkonkraftwerk', ok:true},{word:'E-Auto', ok:true},{word:'Haus', ok:true},
  {word:'PV-Anlage', ok:true},{word:'Wärmepumpe', ok:true},{word:'Speicher', ok:true},
  {word:'Energie sparen', ok:true},{word:'Wallbox', ok:true},{word:'Hausbau', ok:true},
  {word:'Etagenheizung', ok:false},{word:'WG-Zimmer', ok:false},{word:'Mietwohnung', ok:false}
];

function shuffle(array){for(let i=array.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[array[i],array[j]]=[array[j],array[i]];}return array;}

let deck=[], rightCount=0, wrongCount=0;
const deckEl = document.getElementById('deck');
const feedbackEl = document.getElementById('feedback');
const rightCountEl = document.getElementById('rightCount');
const wrongCountEl = document.getElementById('wrongCount');
const leaderboardEl = document.getElementById('leaderboard');

deck = shuffle([...cards]);
renderDeck();

function renderDeck(){
  deckEl.innerHTML = '';
  if(deck.length === 0){showGameEnd(); return;}
  for(let i = deck.length-1; i>=0; i--){
    const c = deck[i];
    const el = document.createElement('div');
    el.className = 'card';
    el.textContent = c.word;
    el.dataset.ok = c.ok;
    el.style.zIndex = i+1;
    el.style.transform = `scale(${1-(deck.length-1-i)*0.02}) translateY(${(deck.length-1-i)*8}px)`;
    if(i === deck.length-1) addCardInteraction(el);
    deckEl.appendChild(el);
  }
}

function addCardInteraction(el){
  let startX=0, currentX=0, dragging=false;
  el.addEventListener('pointerdown', e=>{
    startX=e.clientX; dragging=true; el.style.transition='none';
    const moveHandler = e=>{
      if(!dragging) return;
      currentX = e.clientX - startX;
      el.style.transform = `translateX(${currentX}px) rotate(${currentX/18}deg) rotateY(${currentX/50}deg) rotateX(${currentX/50}deg)`;
    };
    const upHandler = e=>{
      dragging=false;
      el.releasePointerCapture(e.pointerId);
      el.style.transition='transform 220ms ease, opacity 220ms ease';
      const threshold=120;
      if(currentX > threshold) swipeCard('right');
      else if(currentX < -threshold) swipeCard('left');
      else el.style.transform='translateX(0) rotate(0)';
      window.removeEventListener('pointermove', moveHandler);
      window.removeEventListener('pointerup', upHandler);
    };
    window.addEventListener('pointermove', moveHandler);
    window.addEventListener('pointerup', upHandler);
    el.setPointerCapture(e.pointerId);
  });
}

function swipeCard(dir){
  const top = deck[deck.length-1];
  const correct = (dir==='right' && top.ok) || (dir==='left' && !top.ok);
  if(correct){rightCount++; rightCountEl.textContent=rightCount;}
  else{wrongCount++; wrongCountEl.textContent=wrongCount;}
  showFeedback(correct);
  deck.pop();
  updateLeaderboard();
  renderDeck();
}

function showFeedback(correct){
  feedbackEl.textContent = correct ? '😊' : '😢';
  feedbackEl.className = 'feedback ' + (correct ? 'smile show' : 'cry show');
  setTimeout(()=>{feedbackEl.className='feedback'; feedbackEl.textContent='';},1000);
}

function updateLeaderboard(){
  leaderboardEl.innerHTML = `<div class="player">Richtig: ${rightCount} | Falsch: ${wrongCount}</div>`;
}

function showGameEnd(){
  const endEl = document.createElement('div');
  endEl.className='card';
  endEl.style.fontSize='36px';
  endEl.style.textAlign='center';
  endEl.style.color='#00e676';
  endEl.textContent='🎉 ENDE 🎉';
  deckEl.appendChild(endEl);

  setTimeout(()=>{
    leaderboardEl.style.position='fixed';
    leaderboardEl.style.top='50%';
    leaderboardEl.style.left='50%';
    leaderboardEl.style.transform='translate(-50%,-50%) scale(1.2)';
    leaderboardEl.style.fontSize='20px';
  }, 1000);
}

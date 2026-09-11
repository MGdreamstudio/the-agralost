const game = document.querySelector('#game');
const bird = document.querySelector('#bird');
const layer = document.querySelector('#pipeLayer');
const scoreEl = document.querySelector('#score');
const intro = document.querySelector('#intro');
const gameOver = document.querySelector('#gameOver');
const finalScore = document.querySelector('#finalScore');
let active=false, y=0, velocity=0, score=0, pipes=[], raf, lastSpawn=0, muted=false, legendUnlocked=false, audioContext=null, musicTimer=null, musicStep=0;
const birdX = () => game.clientWidth * .23;
function reset(){ cancelAnimationFrame(raf); layer.innerHTML=''; pipes=[]; score=0; scoreEl.textContent='0'; y=game.clientHeight*.43; velocity=0; bird.style.top=y+'px'; bird.style.transform='rotate(0deg)'; }
function setGuardian(){
  const legend=legendUnlocked;
  document.querySelector('#gameBirdImage').src=legend?'legend-remastered-bird.png':'sky-guardian.png';
  document.querySelector('#originalGuardianCard').classList.toggle('active',!legend);
  document.querySelector('#legendGuardianCard').classList.toggle('locked',!legend);
  document.querySelector('#legendGuardianCard').classList.toggle('active',legend);
  document.querySelector('#legendState').textContent=legend?'ACTIVE':'REACH 20';
}
function fly(){ if(!active) return; velocity=-4.8; beep(480,.04); }
function start(){ setGuardian(); reset(); active=true; intro.classList.add('hidden'); gameOver.classList.add('hidden'); addPipe(); lastSpawn=performance.now(); raf=requestAnimationFrame(loop); }
function addPipe(){ const gap=Math.max(205, game.clientHeight*.34), top=80+Math.random()*(game.clientHeight-gap-210), x=game.clientWidth+10; const topPipe=document.createElement('div'), bottomPipe=document.createElement('div'); topPipe.className='pipe top'; bottomPipe.className='pipe bottom'; topPipe.style.cssText=`height:${top}px;left:${x}px`; bottomPipe.style.cssText=`height:${game.clientHeight-76-top-gap}px;left:${x}px`; layer.append(topPipe,bottomPipe); pipes.push({x,top,gap,els:[topPipe,bottomPipe],scored:false}); }
function hitsPipe(pipe){
  // Three forgiving circles match the guardian's tail/wing, body, and head more closely than a box.
  const parts=[{x:27,y:68,r:11},{x:62,y:59,r:18},{x:92,y:35,r:13}];
  return parts.some(part=>{
    const px=birdX()+part.x, py=y+part.y;
    const insidePipeX=px+part.r>pipe.x+8 && px-part.r<pipe.x+70;
    const hitsTop=py-part.r<pipe.top;
    const hitsBottom=py+part.r>pipe.top+pipe.gap;
    return insidePipeX&&(hitsTop||hitsBottom);
  });
}
function loop(now){ if(!active)return; velocity=Math.min(velocity+.10,3.25); y+=velocity; bird.style.top=y+'px'; bird.style.transform=`rotate(${Math.max(-18,Math.min(32,velocity*4))}deg)`; if(now-lastSpawn>2400){addPipe();lastSpawn=now} const speed=1.85+Math.min(score*.025,.55); for(const p of pipes){p.x-=speed;p.els.forEach(el=>el.style.left=p.x+'px');if(!p.scored&&p.x+77<birdX()){p.scored=true;score++;scoreEl.textContent=score;beep(740,.05)} if(hitsPipe(p))end() } pipes=pipes.filter(p=>{if(p.x<-110){p.els.forEach(e=>e.remove());return false}return true}); if(y<0||y+104>game.clientHeight-76)end(); if(active)raf=requestAnimationFrame(loop); }
function end(){if(!active)return;active=false;cancelAnimationFrame(raf);const unlockedNow=score>=20&&!legendUnlocked;if(score>=20)legendUnlocked=true;document.querySelector('#gameOverTitle').textContent=unlockedNow?'Legend Remastered Bird unlocked for your next flight!':'Try a new route.';finalScore.textContent=score;gameOver.classList.remove('hidden');beep(135,.18)}
function getAudio(){if(!audioContext)audioContext=new AudioContext();if(audioContext.state==='suspended')audioContext.resume();return audioContext}
function tone(freq,duration,volume=.025,type='sine'){if(muted)return;try{const c=getAudio(),o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+duration);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+duration)}catch(e){}}
function beep(freq,duration){tone(freq,duration,.035,'triangle')}
function playMusic(){if(muted)return;const notes=[220,277.18,329.63,277.18,246.94,293.66,369.99,293.66];tone(notes[musicStep%notes.length],.65,.006,'sine');if(musicStep%2===0)tone(notes[(musicStep+4)%notes.length]/2,.5,.004,'sine');musicStep++;musicTimer=setTimeout(playMusic,650)}
function startMusic(){if(muted||musicTimer)return;playMusic()}
function stopMusic(){if(musicTimer){clearTimeout(musicTimer);musicTimer=null}}
function showToast(message){const toast=document.querySelector('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('show'),4200)}
function saveLocalWallet(wallet){const key='agralost-wallet-connections';const entries=JSON.parse(localStorage.getItem(key)||'[]');entries.push({wallet,connectedAt:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(entries));return entries.length}
async function connectWallet(){
  const input=document.querySelector('#walletInput'),consent=document.querySelector('#walletConsent'),button=document.querySelector('#walletButton'),status=document.querySelector('#walletStatus'),recordStatus=document.querySelector('#walletRecordStatus');
  const wallet=input.value.trim();
  if(!/^0x[a-fA-F0-9]{40}$/.test(wallet)){showToast('Enter a valid MetaMask public address: 0x followed by 40 characters.');input.focus();return}
  if(!consent.checked){showToast('Please confirm consent before connecting your wallet.');return}
  button.disabled=true;button.textContent='CONNECTING...';
  try{
    if(location.protocol==='file:')throw new Error('local demo');
    const response=await fetch('/api/wallet-connections',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({wallet,consent:true})});
    const result=await response.json();if(!response.ok)throw new Error(result.message||'Could not save the connection.');
    status.textContent='Connected';recordStatus.textContent=`Record #${result.number} saved`;showToast('Wallet connected. Your connection was recorded successfully.');
  }catch(error){
    const number=saveLocalWallet(wallet);status.textContent='Connected';recordStatus.textContent=`Local demo record #${number}`;showToast('Wallet connected. This file is open in demo mode, so the record is saved only in this browser.');
  }
  input.disabled=true;consent.disabled=true;button.textContent='CONNECTED';button.style.borderColor='#43e5b4';button.style.color='#43e5b4';
}
document.querySelector('#startButton').onclick=()=>{getAudio();startMusic();start()};document.querySelector('#retryButton').onclick=()=>{getAudio();startMusic();start()};game.addEventListener('pointerdown',e=>{if(active){e.preventDefault();getAudio();startMusic();fly()}});window.addEventListener('keydown',e=>{if([' ','ArrowUp'].includes(e.key)){e.preventDefault();getAudio();startMusic();active?fly():start()}});document.querySelector('#soundButton').onclick=()=>{muted=!muted;document.querySelector('#soundButton').textContent=muted?'♩':'♬';if(muted)stopMusic();else{getAudio();startMusic()}};document.querySelector('#walletButton').onclick=connectWallet;setGuardian();reset();

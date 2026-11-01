/* Note catcher (rhythm version)
   - tap notes: click once.  numbered notes: hold for that many beats, then they vanish.
   - notes are dropped on the beat; tempo and fall speed climb steadily.
   - clicking right on a beat gives +1.  3 missed notes and it's over. */
(function(){
var cv=document.getElementById('game');if(!cv)return;
var cx=cv.getContext('2d'),W=640,H=360,state='idle',notes=[],parts=[],holds={},score=0,lives=3,best=0,last=0,flash=0,t=0,beatAcc=0,rest=0,pulse=0,pops=[];
var sc=document.getElementById('gscore'),bs=document.getElementById('gbest'),btn=document.getElementById('gstart');
try{best=+localStorage.getItem('sb-best')||0}catch(e){}
var pitch=[523,587,659,784,880],audio,PTS={1:1,2:3,4:6};
/* difficulty: change these numbers to tune the game */
var BPM0=80,BPM_UP=.7,BPM_MAX=150,FALL0=70,FALL_UP=3.2,FALL_MAX=300;
function bpm(){return Math.min(BPM_MAX,BPM0+t*BPM_UP)}
function fall(){return Math.min(FALL_MAX,FALL0+t*FALL_UP)}
function blip(f,d,v){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();var o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.value=f;g.gain.value=v||.05;o.connect(g);g.connect(audio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d);o.stop(audio.currentTime+d)}catch(e){}}
function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function ui(){sc.textContent='score '+score;bs.textContent='best '+best}
function start(){notes=[];parts=[];pops=[];holds={};score=0;lives=3;t=0;beatAcc=0;rest=0;state='play';btn.textContent='restart';ui()}
function add(){var r=Math.random(),b=r<.62?1:(r<.9?2:4);notes.push({x:34+Math.random()*(W-68),y:-30,b:b,prog:0,held:false});return b}
function burst(x,y,c){for(var i=0;i<10;i++)parts.push({x:x,y:y,vx:(Math.random()-.5)*240,vy:(Math.random()-.8)*200,t:.5,c:c})}
function pop(x,y,s){pops.push({x:x,y:y,s:s,t:.8})}
function over(){state='over';holds={};if(score>best){best=score;try{localStorage.setItem('sb-best',best)}catch(e){}}ui();blip(180,.4)}
function done(n,bonus){var p=PTS[n.b]+(bonus?1:0);score+=p;burst(n.x,n.y,css(n.b>1?'--yd':'--o'));pop(n.x,n.y-24,'+'+p+(bonus?' on beat':''));blip(pitch[Math.floor(n.x/W*5)%5]*(n.b>1?2:1),.12);notes.splice(notes.indexOf(n),1);ui()}
function hit(e){
  var r=cv.getBoundingClientRect();if(!r.width)return;
  var x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
  if(state!=='play'){start();return}
  if(holds[e.pointerId])return;
  for(var i=notes.length-1;i>=0;i--){var n=notes[i];
    if(!n.held&&Math.abs(n.x-x)<30&&Math.abs(n.y-y)<30){
      var ph=beatAcc/(60/bpm()),bonus=Math.min(ph,1-ph)<.15;
      if(n.b===1){done(n,bonus)}else{n.held=true;n.prog=0;n.bonus=bonus;holds[e.pointerId]=n}
      return}}
}
function release(e){var n=holds[e.pointerId];if(n){n.held=false;n.prog=0;delete holds[e.pointerId]}}
cv.addEventListener('pointerdown',hit);
addEventListener('pointerup',release);addEventListener('pointercancel',release);
btn.addEventListener('click',start);
function update(dt){
  parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.t-=dt});parts=parts.filter(function(p){return p.t>0});
  pops.forEach(function(p){p.y-=30*dt;p.t-=dt});pops=pops.filter(function(p){return p.t>0});
  flash=Math.max(0,flash-dt);pulse=Math.max(0,pulse-dt*3);if(state!=='play')return;
  t+=dt;var beat=60/bpm();beatAcc+=dt;
  if(beatAcc>=beat){beatAcc-=beat;pulse=1;blip(1200,.03,.015);if(--rest<=0)rest=add()}
  for(var i=notes.length-1;i>=0;i--){var n=notes[i];
    if(n.held){n.prog+=dt;if(n.prog>=n.b*beat){for(var k in holds)if(holds[k]===n)delete holds[k];done(n,n.bonus)}continue}
    n.y+=fall()*dt;
    if(n.y>H-24){notes.splice(i,1);lives--;flash=.25;blip(140,.15);if(lives<=0){over();return}}}
}
function msg(a,b){cx.fillStyle='rgba(0,0,0,.35)';cx.fillRect(0,0,W,H);cx.fillStyle=css('--panel');cx.strokeStyle=css('--ink');cx.lineWidth=3;cx.fillRect(130,110,380,130);cx.strokeRect(130,110,380,130);
  cx.fillStyle=css('--text');cx.textAlign='center';cx.font='700 28px "Pixelify Sans",monospace';cx.fillText(a,W/2,160);cx.font='500 17px "Pixelify Sans",monospace';cx.fillStyle=css('--muted');cx.fillText(b,W/2,200);cx.textAlign='left'}
function draw(){
  cx.fillStyle=css('--alt');cx.fillRect(0,0,W,H);
  cx.globalAlpha=.55+pulse*.45;cx.fillStyle=css('--yd');cx.fillRect(0,H-14,W,14);cx.globalAlpha=1;cx.fillStyle=css('--ink');cx.fillRect(0,H-16,W,3);
  if(pulse>0){cx.fillStyle=css('--o');cx.globalAlpha=pulse*.5;cx.fillRect(0,H-22,W,6);cx.globalAlpha=1}
  if(flash>0){cx.fillStyle='rgba(255,80,40,'+flash*1.2+')';cx.fillRect(0,0,W,H)}
  cx.textAlign='center';cx.textBaseline='middle';
  notes.forEach(function(n){
    cx.fillStyle=n.b===1?css('--panel'):(n.b===2?css('--y'):css('--o'));cx.strokeStyle=css('--ink');cx.lineWidth=3;cx.fillRect(n.x-22,n.y-22,44,44);cx.strokeRect(n.x-22,n.y-22,44,44);
    cx.font='700 28px "Pixelify Sans",monospace';cx.fillStyle=n.b===1?css('--o'):css('--ink');cx.fillText(n.b===1?'♪':String(n.b),n.x,n.y+2);
    if(n.b>1){cx.strokeStyle=css('--ink');cx.lineWidth=5;cx.beginPath();cx.arc(n.x,n.y,31,-1.5708,-1.5708+6.283*(n.prog/(n.b*60/bpm())));cx.stroke()}});
  parts.forEach(function(p){cx.fillStyle=p.c;cx.fillRect(p.x,p.y,6,6)});
  cx.font='700 15px "Pixelify Sans",monospace';pops.forEach(function(p){cx.globalAlpha=Math.min(1,p.t*2);cx.fillStyle=css('--text');cx.fillText(p.s,p.x,p.y);cx.globalAlpha=1});
  cx.textBaseline='alphabetic';cx.textAlign='left';cx.font='700 22px "Pixelify Sans",monospace';cx.fillStyle=css('--o');
  var h='';for(var i=0;i<3;i++)h+=i<lives?'♥ ':'♡ ';cx.fillText(h,14,32);
  cx.textAlign='center';cx.font='500 15px "Pixelify Sans",monospace';cx.fillStyle=css('--muted');cx.fillText('♩ = '+Math.round(bpm()),W/2,30);
  cx.textAlign='right';cx.font='700 22px "Pixelify Sans",monospace';cx.fillStyle=css('--text');cx.fillText(String(score),W-14,32);cx.textAlign='left';
  if(state==='idle')msg('catch the notes','click to start');
  if(state==='over')msg('game over: '+score,best&&score>=best?'new best! click to retry':'click to retry');
}
function loop(ts){var dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}
ui();requestAnimationFrame(loop);
})();

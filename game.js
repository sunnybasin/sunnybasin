/* Note catcher: click the falling notes before they hit the floor. 3 misses and it's over. */
(function(){
var cv=document.getElementById('game');if(!cv)return;
var cx=cv.getContext('2d'),W=640,H=360,state='idle',notes=[],parts=[],score=0,lives=3,best=0,last=0,spawn=0,gap=1100,flash=0;
var sc=document.getElementById('gscore'),bs=document.getElementById('gbest'),btn=document.getElementById('gstart');
try{best=+localStorage.getItem('sb-best')||0}catch(e){}
var glyphs=['♪','♫','♩'],pitch=[523,587,659,784,880],audio;
function blip(f,d){try{audio=audio||new(window.AudioContext||window.webkitAudioContext)();var o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.value=f;g.gain.value=.05;o.connect(g);g.connect(audio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d);o.stop(audio.currentTime+d)}catch(e){}}
function css(n){return getComputedStyle(document.documentElement).getPropertyValue(n).trim()}
function ui(){sc.textContent='score '+score;bs.textContent='best '+best}
function start(){notes=[];parts=[];score=0;lives=3;spawn=0;gap=1100;state='play';btn.textContent='restart';ui()}
function add(){var g=Math.random()<.1;notes.push({x:34+Math.random()*(W-68),y:-30,vy:Math.min(280,80+score*3.5),g:g,ch:g?'★':glyphs[Math.floor(Math.random()*3)]})}
function burst(x,y,c){for(var i=0;i<10;i++)parts.push({x:x,y:y,vx:(Math.random()-.5)*240,vy:(Math.random()-.8)*200,t:.5,c:c})}
function over(){state='over';if(score>best){best=score;try{localStorage.setItem('sb-best',best)}catch(e){}}ui();blip(180,.4)}
function hit(e){
  var r=cv.getBoundingClientRect();if(!r.width)return;
  var x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;
  if(state!=='play'){start();return}
  for(var i=notes.length-1;i>=0;i--){var n=notes[i];
    if(Math.abs(n.x-x)<30&&Math.abs(n.y-y)<30){score+=n.g?3:1;burst(n.x,n.y,n.g?css('--yd'):css('--o'));blip(pitch[Math.floor(n.x/W*5)%5]*(n.g?2:1),.12);notes.splice(i,1);ui();return}}
}
cv.addEventListener('pointerdown',hit);
btn.addEventListener('click',start);
function update(dt){
  parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=500*dt;p.t-=dt});parts=parts.filter(function(p){return p.t>0});
  flash=Math.max(0,flash-dt);if(state!=='play')return;
  spawn-=dt*1000;if(spawn<=0){add();spawn=gap;gap=Math.max(380,gap-14)}
  for(var i=notes.length-1;i>=0;i--){var n=notes[i];n.y+=n.vy*dt;
    if(n.y>H-24){notes.splice(i,1);if(!n.g){lives--;flash=.25;blip(140,.15);if(lives<=0){over();return}}}}
}
function msg(a,b){cx.fillStyle='rgba(0,0,0,.35)';cx.fillRect(0,0,W,H);cx.fillStyle=css('--panel');cx.strokeStyle=css('--ink');cx.lineWidth=3;cx.fillRect(130,110,380,130);cx.strokeRect(130,110,380,130);
  cx.fillStyle=css('--text');cx.textAlign='center';cx.font='700 28px "Pixelify Sans",monospace';cx.fillText(a,W/2,160);cx.font='500 17px "Pixelify Sans",monospace';cx.fillStyle=css('--muted');cx.fillText(b,W/2,200);cx.textAlign='left'}
function draw(){
  cx.fillStyle=css('--alt');cx.fillRect(0,0,W,H);
  cx.fillStyle=css('--yd');cx.fillRect(0,H-14,W,14);cx.fillStyle=css('--ink');cx.fillRect(0,H-16,W,3);
  if(flash>0){cx.fillStyle='rgba(255,80,40,'+flash*1.2+')';cx.fillRect(0,0,W,H)}
  cx.textAlign='center';cx.textBaseline='middle';
  notes.forEach(function(n){cx.fillStyle=n.g?css('--y'):css('--panel');cx.strokeStyle=css('--ink');cx.lineWidth=3;cx.fillRect(n.x-22,n.y-22,44,44);cx.strokeRect(n.x-22,n.y-22,44,44);
    cx.font='700 28px "Pixelify Sans",monospace';cx.fillStyle=n.g?css('--ink'):css('--o');cx.fillText(n.ch,n.x,n.y+2)});
  parts.forEach(function(p){cx.fillStyle=p.c;cx.fillRect(p.x,p.y,6,6)});
  cx.textBaseline='alphabetic';cx.textAlign='left';cx.font='700 22px "Pixelify Sans",monospace';cx.fillStyle=css('--o');
  var h='';for(var i=0;i<3;i++)h+=i<lives?'♥ ':'♡ ';cx.fillText(h,14,32);
  cx.textAlign='right';cx.fillStyle=css('--text');cx.fillText(String(score),W-14,32);cx.textAlign='left';
  if(state==='idle')msg('catch the notes','click to start');
  if(state==='over')msg('game over: '+score,best&&score>=best?'new best! click to retry':'click to retry');
}
function loop(ts){var dt=Math.min(.05,(ts-last)/1000||0);last=ts;update(dt);draw();requestAnimationFrame(loop)}
ui();requestAnimationFrame(loop);
})();

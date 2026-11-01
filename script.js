(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},1800)}
function esc(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML}

/* reveal on scroll (runs first, so a later problem can't hide the page) */
document.documentElement.classList.add('js');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.2});
$$('.rv').forEach(function(e){io.observe(e)});

/* theme */
var root=document.documentElement,tb=$('#theme');
function setTheme(t,keep){root.dataset.theme=t;tb.textContent=t==='dark'?'☀':'☾';if(keep)try{localStorage.setItem('sb-theme2',t)}catch(e){}}
var saved;try{saved=localStorage.getItem('sb-theme2')}catch(e){}
setTheme(saved||'light');
tb.onclick=function(){setTheme(root.dataset.theme==='dark'?'light':'dark',true)};

/* dots that dodge the cursor */
var cv=$('#dots'),cx=cv.getContext('2d'),W,H,mx=-999,my=-999,sp=26;
function rs(){var d=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
rs();addEventListener('resize',rs);
addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY});
function draw(t){
  cx.clearRect(0,0,W,H);var c=getComputedStyle(root).getPropertyValue('--dot').trim();
  for(var y=0;y<H+sp;y+=sp)for(var x=0;x<W+sp;x+=sp){
    var w=Math.sin(x*.018+y*.018+t),dx=x-mx,dy=y-my,d=Math.sqrt(dx*dx+dy*dy),px=x,py=y+w*4,r=Math.max(.25,1.3+w*1.1),a=.1+Math.abs(w)*.1;
    if(d<120){var f=1-d/120;px+=dx/d*f*18;py+=dy/d*f*18;r+=f*2.5;a+=f*.3}
    cx.beginPath();cx.arc(px,py,r,0,6.283);cx.fillStyle='rgba('+c+','+a+')';cx.fill()}
}
if(reduce)draw(0);else(function L(ts){draw(ts*.0015);requestAnimationFrame(L)})(0);

/* typewriter: edit the words here */
var roles=['maker','composer','artificer'],ri=0,ci=0,del=false,tp=$('#type');
if(reduce)tp.textContent='maker, composer, artificer';else(function T(){
  var w=roles[ri];ci+=del?-1:1;tp.textContent=w.slice(0,ci);
  var wait=del?40:90;if(!del&&ci===w.length){del=true;wait=1200}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;wait=300}
  setTimeout(T,wait)})();

/* nav: progress bar, menu, back to top */
function onScroll(){var h=document.documentElement.scrollHeight-innerHeight;$('#prog').style.width=(h?scrollY/h*100:0)+'%';$('#top').classList.toggle('on',scrollY>500)}
addEventListener('scroll',onScroll,{passive:true});onScroll();
$('#top').onclick=function(){scrollTo({top:0})};
$('#burger').onclick=function(){var m=$('#menu');if(innerWidth<=760){m.style.display=m.classList.toggle('open')?'flex':'none'}};
function fixMenu(){var m=$('#menu');m.classList.remove('open');m.style.display=innerWidth<=760?'none':'contents'}
fixMenu();addEventListener('resize',fixMenu);

})();

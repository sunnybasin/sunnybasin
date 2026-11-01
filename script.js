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

/* avatar + easter egg (konami code, or click the confused character 5 times, opens game.html) */
$('#avatar').onclick=function(){$('#avatar img').animate([{transform:'translateY(0)'},{transform:'translateY(-26px)'},{transform:'translateY(0)'}],{duration:350});toast(['hi!','ow','stop poking me','...','hello again'][Math.floor(Math.random()*5)])};
function secret(){toast('you found a secret...');setTimeout(function(){location.href='game.html'},700)}
var kk=[38,38,40,40,37,39,37,39,66,65],kp=0,cc=0,ct;
addEventListener('keydown',function(e){kp=e.keyCode===kk[kp]?kp+1:(e.keyCode===kk[0]?1:0);if(kp===kk.length){kp=0;secret()}});
if($('#conf'))$('#conf').onclick=function(){cc++;clearTimeout(ct);ct=setTimeout(function(){cc=0},1500);if(cc>=5){cc=0;secret()}else toast('i am also confused')};

/* about page: chips (the list lives in chips.js) */
if($('#chips')){
  if(typeof CHIPS==='undefined')$('#chipnote').textContent='chips.js not found next to index.html';
  else CHIPS.forEach(function(c){var b=document.createElement('button');b.className='chip';b.textContent=c.label;b.onclick=function(){$$('#chips .chip').forEach(function(x){x.classList.remove('on')});b.classList.add('on');$('#chipnote').textContent=c.text};$('#chips').appendChild(b)})}

/* about page: songs (the list lives in songs.js) */
function fmt(s){if(!isFinite(s))return'0:00';return Math.floor(s/60)+':'+('0'+Math.floor(s%60)).slice(-2)}
var auds=[];
if($('#songs')){
  if(typeof SONGS==='undefined')$('#songs').textContent='songs.js not found next to index.html';
  else SONGS.forEach(function(s){
    var el=document.createElement('div');el.className='box song';
    el.innerHTML='<button class="disc" aria-label="Play '+esc(s.title)+'"></button><div><b>'+esc(s.title)+'</b><a href="'+esc(s.link)+'" target="_blank" rel="noopener">'+esc(s.artist)+'</a><div class="bar" role="slider" aria-label="Seek" tabindex="0"><i></i></div><span class="tm">0:00 / 0:00</span></div><audio preload="none" src="'+esc(s.file)+'"></audio>';
    var a=el.querySelector('audio'),f=el.querySelector('i'),bar=el.querySelector('.bar'),tm=el.querySelector('.tm');auds.push(a);
    el.querySelector('.disc').onclick=function(){if(a.paused){auds.forEach(function(o){o.pause()});a.play()}else a.pause()};
    a.onplay=function(){el.classList.add('play')};a.onpause=function(){el.classList.remove('play')};
    a.onended=function(){el.classList.remove('play');var n=auds[(auds.indexOf(a)+1)%auds.length];if(n!==a)n.play()};
    a.ontimeupdate=a.onloadedmetadata=function(){f.style.width=(a.duration?a.currentTime/a.duration*100:0)+'%';tm.textContent=fmt(a.currentTime)+' / '+fmt(a.duration)};
    bar.onclick=function(e){var r=bar.getBoundingClientRect();if(a.duration)a.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*a.duration};
    bar.onkeydown=function(e){if(e.key==='ArrowRight')a.currentTime+=5;if(e.key==='ArrowLeft')a.currentTime-=5};
    $('#songs').appendChild(el)})}

/* contact page: copy handle */
if($('#copy'))$('#copy').onclick=function(){var t='sunnybasin';(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){toast('copied "'+t+'" to clipboard')},function(){toast('discord: '+t)})};

/* projects page: protogen */
if($('#proto')){var pi=$('#protoimg'),idle=pi.getAttribute('src'),sfx=$('#sfx'),ptm;
$('#proto').onclick=function(){pi.src='assets/11-9c727604.png';sfx.currentTime=0;sfx.play().catch(function(){});
  document.body.classList.remove('shaking');void document.body.offsetWidth;document.body.classList.add('shaking');
  clearTimeout(ptm);ptm=setTimeout(function(){pi.src=idle;document.body.classList.remove('shaking')},900)}}

/* projects page: gallery (loaded from projects.json; add #edit to the URL to add/remove) */
if($('#grid')){
var KEY='sunnybasin_projects_draft',P=[],filter='all',edit=location.hash==='#edit',shown=[],cur=0;
function load(){return fetch('projects.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null})}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function render(){
  var tabs=$('#tabs');tabs.innerHTML='';
  [['all','all'],['current','working on now'],['past','past']].forEach(function(t){var n=P.filter(function(p){return t[0]==='all'||(p.status==='past'?'past':'current')===t[0]}).length,b=document.createElement('button');
    b.className='chip'+(filter===t[0]?' on':'');b.setAttribute('role','tab');b.setAttribute('aria-selected',filter===t[0]);b.textContent=t[1]+' ('+n+')';b.onclick=function(){filter=t[0];render()};tabs.appendChild(b)});
  shown=[];P.forEach(function(p,i){if(filter==='all'||(p.status==='past'?'past':'current')===filter)shown.push(i)});
  var g=$('#grid');
  if(!P.length){g.innerHTML='<p class="empty">couldn\'t load projects.json. open the live site or run a local server.</p>';return}
  g.innerHTML=shown.length?shown.map(function(i,k){var p=P[i];
    return '<article class="box card"><'+(p.image?'button class="th" data-k="'+k+'" aria-label="Open '+esc(p.title)+'"><img loading="lazy" src="'+p.image+'" alt="">':'div class="th">no image')+'</'+(p.image?'button':'div')+'><div class="cb"><span class="tag '+(p.status==='past'?'past':'')+'">'+(p.status==='past'?'past':'current')+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p>'+(p.link?'<a href="'+esc(p.link)+'" target="_blank" rel="noopener">visit</a>':'')+(edit?'<button class="rm" data-i="'+i+'">remove</button>':'')+'</div></article>'}).join(''):'<p class="empty">nothing here yet. try another tab.</p>'}
function open(k){cur=(k+shown.length)%shown.length;var p=P[shown[cur]];$('#lbi').src=p.image||'';$('#lbi').style.display=p.image?'':'none';$('#lbt').textContent=p.title;$('#lbd').textContent=p.desc||'';var v=$('#lbv');if(p.link){v.href=p.link;v.style.display=''}else v.style.display='none';
  $('#lb').classList.add('on');document.body.style.overflow='hidden';$('#lbx').focus()}
function close(){$('#lb').classList.remove('on');document.body.style.overflow=''}
$('#grid').addEventListener('click',function(e){var t=e.target.closest('.th[data-k]');if(t)open(+t.dataset.k);var r=e.target.closest('.rm');if(r){P.splice(+r.dataset.i,1);save();render()}});
$('#lbx').onclick=close;$('#lb').onclick=function(e){if(e.target.id==='lb')close()};
$('#lbp').onclick=function(){open(cur-1)};$('#lbn').onclick=function(){open(cur+1)};
addEventListener('keydown',function(e){if(!$('#lb').classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')open(cur-1);if(e.key==='ArrowRight')open(cur+1)});
var draft=null;if(edit){$('#edit').classList.add('on');try{draft=JSON.parse(localStorage.getItem(KEY))}catch(e){}}
(draft?Promise.resolve(draft):load()).then(function(l){P=l||[];render()});
$('#dl').onclick=function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(P,null,2)],{type:'application/json'}));a.download='projects.json';a.click()};
function shrink(f,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,700/im.width),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(f)}
$('#edit').onsubmit=function(e){e.preventDefault();var f=$('#pi').files[0];function add(img){P.unshift({title:$('#pt').value.trim(),link:$('#pl').value.trim(),desc:$('#pd').value.trim(),status:$('input[name=st]:checked').value,image:img||''});save();render();e.target.reset();toast('project added')}
  f?shrink(f,add):add('')}}
})();

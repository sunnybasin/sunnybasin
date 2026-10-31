(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},1800)}
function esc(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML}

/* dots that dodge the cursor */
var cv=$('#dots'),cx=cv.getContext('2d'),W,H,mx=-999,my=-999,sp=26;
function rs(){var d=devicePixelRatio||1;W=innerWidth;H=innerHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
rs();addEventListener('resize',rs);
addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY});
function draw(t){
  cx.clearRect(0,0,W,H);
  for(var y=0;y<H+sp;y+=sp)for(var x=0;x<W+sp;x+=sp){
    var w=Math.sin(x*.018+y*.018+t),dx=x-mx,dy=y-my,d=Math.sqrt(dx*dx+dy*dy),px=x,py=y+w*4,r=Math.max(.25,1.3+w*1.1),a=.08+Math.abs(w)*.08;
    if(d<120){var f=1-d/120;px+=dx/d*f*18;py+=dy/d*f*18;r+=f*2.5;a+=f*.3}
    cx.beginPath();cx.arc(px,py,r,0,6.283);cx.fillStyle='rgba(28,23,7,'+a+')';cx.fill()}
}
if(reduce)draw(0);else(function L(ts){draw(ts*.0015);requestAnimationFrame(L)})(0);

/* typewriter: edit the words here */
var roles=['maker','composer','artificer'],ri=0,ci=0,del=false,tp=$('#type');
if(reduce)tp.textContent='maker, composer, artificer';else(function T(){
  var w=roles[ri];ci+=del?-1:1;tp.textContent=w.slice(0,ci);
  var wait=del?40:90;if(!del&&ci===w.length){del=true;wait=1200}else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;wait=300}
  setTimeout(T,wait)})();

/* nav: current section + progress */
var links=$$('nav a.l'),secs=links.map(function(a){return $(a.getAttribute('href'))});
function onScroll(){
  var h=document.documentElement.scrollHeight-innerHeight;$('#prog').style.width=(h?scrollY/h*100:0)+'%';var cur=-1;
  secs.forEach(function(s,i){if(s.getBoundingClientRect().top<innerHeight*.4)cur=i});
  links.forEach(function(a,i){a.classList.toggle('on',i===cur)})}
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* reveal + counters */
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;e.target.classList.add('in');io.unobserve(e.target);
  [].slice.call(e.target.querySelectorAll('[data-to]')).forEach(function(n){var to=+n.dataset.to,s=0,p=n.dataset.plus||'';(function C(){s+=Math.max(1,to/30);if(s>=to){n.textContent=to+p}else{n.textContent=Math.floor(s);requestAnimationFrame(C)}})()})})},{threshold:.2});
$$('.rv').forEach(function(e){io.observe(e)});

/* music: the list lives in songs.js */
var songs=SONGS.map(function(x){return [x.title,x.artist,x.link,x.file]});
function fmt(s){if(!isFinite(s))return'0:00';return Math.floor(s/60)+':'+('0'+Math.floor(s%60)).slice(-2)}
var auds=[];
songs.forEach(function(s){
  var el=document.createElement('div');el.className='song';
  el.innerHTML='<button class="disc" aria-label="Play '+s[0]+'"></button><div><b>'+s[0]+'</b><a href="'+s[2]+'" target="_blank" rel="noopener">'+s[1]+'</a><div class="bar" role="slider" aria-label="Seek" tabindex="0"><i></i></div><span class="tm">0:00 / 0:00</span></div><audio preload="none" src="'+s[3]+'"></audio>';
  var a=el.querySelector('audio'),f=el.querySelector('i'),bar=el.querySelector('.bar'),tm=el.querySelector('.tm');auds.push(a);
  el.querySelector('.disc').onclick=function(){if(a.paused){auds.forEach(function(o){o.pause()});a.play()}else a.pause()};
  a.onplay=function(){el.classList.add('play')};a.onpause=function(){el.classList.remove('play')};
  a.onended=function(){el.classList.remove('play');var n=auds[(auds.indexOf(a)+1)%auds.length];if(n!==a)n.play()};
  a.ontimeupdate=a.onloadedmetadata=function(){f.style.width=(a.duration?a.currentTime/a.duration*100:0)+'%';tm.textContent=fmt(a.currentTime)+' / '+fmt(a.duration)};
  bar.onclick=function(e){var r=bar.getBoundingClientRect();if(a.duration)a.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*a.duration};
  bar.onkeydown=function(e){if(e.key==='ArrowRight')a.currentTime+=5;if(e.key==='ArrowLeft')a.currentTime-=5};
  $('#songs').appendChild(el)});

/* protogen + avatar + copy */
var pi=$('#protoimg'),idle=pi.src,sfx=$('#sfx'),ptm;
$('#proto').onclick=function(){pi.src='assets/11-9c727604.png';sfx.currentTime=0;sfx.play().catch(function(){});
  document.body.classList.remove('shaking');void document.body.offsetWidth;document.body.classList.add('shaking');
  clearTimeout(ptm);ptm=setTimeout(function(){pi.src=idle;document.body.classList.remove('shaking')},900)};
$('#avatar').onclick=function(){$('#avatar img').animate([{transform:'translateY(0)'},{transform:'translateY(-26px)'},{transform:'translateY(0)'}],{duration:350});toast(['hi!','ow','stop poking me','...','hello again'][Math.floor(Math.random()*5)])};
$('#copy').onclick=function(){var t='sunnybasin';(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){toast('copied "'+t+'"')},function(){toast('discord: '+t)})};

/* projects (loaded from projects.json; add #edit to the URL to add/remove) */
var KEY='sunnybasin_projects_draft',P=[],edit=location.hash==='#edit',shown=[],cur=0;
function load(){return fetch('projects.json',{cache:'no-store'}).then(function(r){if(!r.ok)throw 0;return r.json()}).catch(function(){return null})}
function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
function card(i){var p=P[i],k=shown.length;shown.push(i);
  return '<article class="card">'+(p.image?'<button class="th" data-k="'+k+'" aria-label="Open '+esc(p.title)+'"><img loading="lazy" src="'+p.image+'" alt=""></button>':'<div class="th">no image</div>')+'<div class="cb"><h3>'+esc(p.title)+'</h3><p>'+esc(p.desc)+'</p>'+(p.link?'<a href="'+esc(p.link)+'" target="_blank" rel="noopener">visit</a>':'')+(edit?'<button class="rm" data-i="'+i+'">remove</button>':'')+'</div></article>'}
function render(){
  var g=$('#grid');
  if(!P.length){g.innerHTML='<p class="empty">couldn\'t load projects.json. open the live site or run a local server.</p>';return}
  shown=[];var cur_=[],past=[];P.forEach(function(p,i){(p.status==='past'?past:cur_).push(i)});
  g.innerHTML='<h3 class="sub" style="grid-column:1/-1;margin-top:0">working on now</h3>'+(cur_.length?cur_.map(card).join(''):'<p class="empty">nothing current yet.</p>')+(past.length?'<h3 class="sub" style="grid-column:1/-1">past projects</h3>'+past.map(card).join(''):'')}
function open(k){cur=(k+shown.length)%shown.length;var p=P[shown[cur]];$('#lbi').src=p.image||'';$('#lbt').textContent=p.title;$('#lbd').textContent=p.desc||'';var v=$('#lbv');if(p.link){v.href=p.link;v.style.display=''}else v.style.display='none';
  $('#lb').classList.add('on');document.body.style.overflow='hidden';$('#lbx').focus()}
function close(){$('#lb').classList.remove('on');document.body.style.overflow=''}
$('#grid').addEventListener('click',function(e){var t=e.target.closest('.th[data-k]');if(t)open(+t.dataset.k);var r=e.target.closest('.rm');if(r){P.splice(+r.dataset.i,1);save();render()}});
$('#lbx').onclick=close;$('#lb').onclick=function(e){if(e.target.id==='lb')close()};
addEventListener('keydown',function(e){if(!$('#lb').classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')open(cur-1);if(e.key==='ArrowRight')open(cur+1)});
var draft=null;if(edit){$('#edit').classList.add('on');try{draft=JSON.parse(localStorage.getItem(KEY))}catch(e){}}
(draft?Promise.resolve(draft):load()).then(function(l){P=l||[];render()});
$('#dl').onclick=function(){var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(P,null,2)],{type:'application/json'}));a.download='projects.json';a.click()};
function shrink(f,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,700/im.width),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(f)}
$('#edit').onsubmit=function(e){e.preventDefault();var f=$('#pi').files[0];function add(img){P.unshift({title:$('#pt').value.trim(),link:$('#pl').value.trim(),desc:$('#pd').value.trim(),status:$('input[name=st]:checked').value,image:img||''});save();render();e.target.reset();toast('project added')}
  f?shrink(f,add):add('')};
})();

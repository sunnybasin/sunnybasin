/* ===== INTERACTABLES =====
   Everything you can click, hold or type on the site lives in this file.
   The settings are at the top, so you can change sounds and messages here.
*/
var INTERACT = {
  /* the plushie at the top of every page (the one that hops when clicked) */
  avatar: {
    sound: "assets/plushie.mp3",   /* put your sound file in assets/ and match the name here ("" for no sound) */
    messages: ["hi!", "ow", "stop poking me", "...", "hello again"]
  },
  /* the protogen on the projects page */
  protogen: { sound: "assets/09-4fc926e7.mp3", excitedImage: "assets/11-9c727604.png" },
  /* the discord handle on the contact page (what gets copied) */
  copyText: "sunnybasin",
  /* easter egg: click the confused character this many times (or type the konami code) to open the game */
  secret: { page: "game.html", clicks: 5 },
  /* the message form on the contact page. your email is NOT stored here: it lives in your form service's dashboard.
     1) make a free account at formspree.io (or web3forms.com) using your real email
     2) formspree: paste your form link here, like "https://formspree.io/f/abcdwxyz"
        web3forms: use endpoint "https://api.web3forms.com/submit" and put your access key in extra: { access_key: "..." } */
  contactForm: {
    endpoint: "https://formspree.io/f/xoeekgnk",
    extra: { _subject: "New message from my website" },
    subject: "New message from my website"
  }
};

/* ---- you don't need to edit below this line ---- */
(function(){
var $=function(s){return document.querySelector(s)},$$=function(s){return [].slice.call(document.querySelectorAll(s))};
function toast(t){var e=$('#toast');if(!e)return;e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){e.classList.remove('on')},1800)}
function esc(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML}

/* contact page: message form */
if($('#mform'))$('#mform').onsubmit=function(e){
  e.preventDefault();var f=this,st=$('#mstatus'),b=$('#msend'),C=INTERACT.contactForm,msg=$('#mm').value.trim();
  if(!msg){st.textContent='write a message first';return}
  if($('#mw').value){st.textContent='sent! thank you';f.reset();return}
  if(!C.endpoint){st.textContent="the form isn't connected yet (see interactables.js)";return}
  b.disabled=true;st.textContent='sending...';
  var body={name:$('#mn').value.trim(),email:$('#me').value.trim(),message:msg,subject:C.subject};
  for(var k in C.extra)body[k]=C.extra[k];
  fetch(C.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
   .then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok||d.success===false||d.ok===false)throw 0})})
   .then(function(){st.textContent='sent! thank you';f.reset();toast('message sent')},function(){st.textContent='something went wrong, try again later'})
   .then(function(){b.disabled=false})};

/* the plushie: hops, says something, plays its sound */
if($('#avatar'))$('#avatar').onclick=function(){
  $('#avatar img').animate([{transform:'translateY(0)'},{transform:'translateY(-26px)'},{transform:'translateY(0)'}],{duration:350});
  var m=INTERACT.avatar.messages;toast(m[Math.floor(Math.random()*m.length)]);
  if(INTERACT.avatar.sound){try{var a=new Audio(INTERACT.avatar.sound);var p=a.play();if(p&&p.catch)p.catch(function(){})}catch(e){}}};

/* avatar + easter egg (konami code, or click the confused character 5 times, opens game.html) */
function secret(){toast('you found a secret...');setTimeout(function(){location.href=INTERACT.secret.page},700)}
var kk=[38,38,40,40,37,39,37,39,66,65],kp=0,cc=0,ct;
addEventListener('keydown',function(e){kp=e.keyCode===kk[kp]?kp+1:(e.keyCode===kk[0]?1:0);if(kp===kk.length){kp=0;secret()}});
if($('#conf'))$('#conf').onclick=function(){cc++;clearTimeout(ct);ct=setTimeout(function(){cc=0},1500);if(cc>=INTERACT.secret.clicks){cc=0;secret()}else toast('i am also confused')};

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
if($('#copy'))$('#copy').onclick=function(){var t=INTERACT.copyText;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){toast('copied "'+t+'" to clipboard')},function(){toast('discord: '+t)})};

/* projects page: protogen */
if($('#proto')){var pi=$('#protoimg'),idle=pi.getAttribute('src'),sfx=$('#sfx'),ptm;
$('#proto').onclick=function(){pi.src=INTERACT.protogen.excitedImage;sfx.currentTime=0;sfx.play().catch(function(){});
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

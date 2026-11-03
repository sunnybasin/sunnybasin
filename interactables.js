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
  /* the link buttons on the home and contact pages. add, remove or reorder them here.
       label: the text on the button      url: where it goes
       icon:  youtube, bandcamp, github, discord, link (or type any emoji, like "🎵")
       tip / tipText: the small pop-up that shows when you hover (leave both "" for no pop-up) */
  links: [
    { label: "YouTube",  url: "https://www.youtube.com/@sunnybv3", icon: "youtube",  tip: "sunnyv3 on YouTube",  tipText: "making music for fun, classical/orchestral" },
    { label: "Bandcamp", url: "https://sunnyv3.bandcamp.com/",     icon: "bandcamp", tip: "sunnyv3 on Bandcamp", tipText: "Lisbon, Portugal. making music for fun" },
    { label: "GitHub",   url: "https://github.com/sunnybasin",     icon: "github",   tip: "sunnybasin on GitHub", tipText: "the protogen os lite code and more" }
  ],
  /* the message form on the contact page. your email is NOT stored here: it lives in your form service's dashboard.
     1) make a free account at formspree.io (or web3forms.com) using your real email
     2) formspree: paste your form link here, like "https://formspree.io/f/abcdwxyz"
        web3forms: use endpoint "https://api.web3forms.com/submit" and put your access key in extra: { access_key: "..." } */
  contactForm: {
    /* captcha: paste your Google reCAPTCHA v2 ("I'm not a robot" checkbox) SITE key here.
       also paste its SECRET key in your Formspree form settings (CAPTCHA > Custom reCAPTCHA) so Formspree checks it for real.
       leave this blank to use a simple "what is a + b?" check instead. */
    recaptchaSiteKey: "6Lc-7wsuAAAAANWlPZVFCZPdOza3KsbQeFJxZcOX",
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

/* contact page: captcha (google recaptcha if a site key is set, otherwise a simple math check) */
var cap={a:0,b:0,wid:null};
function mathQ(){cap.a=2+Math.floor(Math.random()*8);cap.b=2+Math.floor(Math.random()*8);var q=$('#mcq');if(q){q.value='';$('#mcl').textContent='human check: what is '+cap.a+' + '+cap.b+'?'}}
if($('#mcap')){
  var key=INTERACT.contactForm.recaptchaSiteKey;
  if(key){
    window.sbCaptchaLoaded=function(){cap.wid=grecaptcha.render('mcap',{sitekey:key,theme:document.documentElement.dataset.theme==='dark'?'dark':'light'})};
    var rs=document.createElement('script');rs.src='https://www.google.com/recaptcha/api.js?onload=sbCaptchaLoaded&render=explicit';rs.async=true;document.head.appendChild(rs)}
  else{$('#mcap').innerHTML='<label id="mcl" for="mcq"></label><input id="mcq" type="text" inputmode="numeric" maxlength="3" autocomplete="off">';mathQ()}}

/* contact page: message form */
if($('#mform'))$('#mform').onsubmit=function(e){
  e.preventDefault();var f=this,st=$('#mstatus'),b=$('#msend'),C=INTERACT.contactForm,msg=$('#mm').value.trim();
  if(!msg){st.textContent='write a message first';return}
  if($('#mw').value){st.textContent='sent! thank you';f.reset();return}
  if(!C.endpoint){st.textContent="the form isn't connected yet (see interactables.js)";return}
  var tok='';
  if(C.recaptchaSiteKey){tok=window.grecaptcha&&grecaptcha.getResponse(cap.wid);if(!tok){st.textContent='please tick the captcha first';return}}
  else if(parseInt($('#mcq').value,10)!==cap.a+cap.b){st.textContent="that answer isn't right, try again";mathQ();return}
  b.disabled=true;st.textContent='sending...';
  var body={name:$('#mn').value.trim(),email:$('#me').value.trim(),message:msg,subject:C.subject};
  for(var k in C.extra)body[k]=C.extra[k];
  if(tok)body['g-recaptcha-response']=tok;
  fetch(C.endpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(body)})
   .then(function(r){return r.json().catch(function(){return {}}).then(function(d){if(!r.ok||d.success===false||d.ok===false)throw 0})})
   .then(function(){st.textContent='sent! thank you';f.reset();toast('message sent')},function(){st.textContent='something went wrong, try again later'})
   .then(function(){if(C.recaptchaSiteKey){if(window.grecaptcha)grecaptcha.reset(cap.wid)}else mathQ()})
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

/* about page: songs (the list lives in songs.js), shown as a bullet list with a tiny player */
function fmt(s){if(!isFinite(s))return'0:00';return Math.floor(s/60)+':'+('0'+Math.floor(s%60)).slice(-2)}
var auds=[];
if($('#songs')){
  if(typeof SONGS==='undefined')$('#songs').textContent='songs.js not found next to the page';
  else SONGS.forEach(function(s){
    var el=document.createElement('li');
    el.innerHTML='<div class="sb"><b>'+esc(s.title)+'</b><a href="'+esc(s.link)+'" target="_blank" rel="noopener">'+esc(s.artist)+'</a><div class="prow"><button class="sp" aria-label="Play '+esc(s.title)+'">&#9654;</button><div class="bar" role="slider" aria-label="Seek" tabindex="0"><i></i></div><span class="tm">0:00 / 0:00</span></div></div><audio preload="none" src="'+esc(s.file)+'"></audio>';
    var a=el.querySelector('audio'),f=el.querySelector('i'),bar=el.querySelector('.bar'),tm=el.querySelector('.tm'),sp=el.querySelector('.sp');auds.push(a);
    sp.onclick=function(){if(a.paused){auds.forEach(function(o){o.pause()});a.play()}else a.pause()};
    a.onplay=function(){el.classList.add('play');sp.innerHTML='&#10074;&#10074;'};a.onpause=function(){el.classList.remove('play');sp.innerHTML='&#9654;'};
    a.onended=function(){a.onpause();var n=auds[(auds.indexOf(a)+1)%auds.length];if(n!==a)n.play()};
    a.ontimeupdate=a.onloadedmetadata=function(){f.style.width=(a.duration?a.currentTime/a.duration*100:0)+'%';tm.textContent=fmt(a.currentTime)+' / '+fmt(a.duration)};
    bar.onclick=function(e){var r=bar.getBoundingClientRect();if(a.duration)a.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*a.duration};
    bar.onkeydown=function(e){if(e.key==='ArrowRight')a.currentTime+=5;if(e.key==='ArrowLeft')a.currentTime-=5};
    $('#songs').appendChild(el)})}

/* the link buttons (settings: INTERACT.links) */
if($('#linkrow')){
  var ICONS={
    youtube:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l6 3-6 3z" fill="currentColor" stroke="none"/></svg>',
    bandcamp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    github:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 008.4 22.9c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 015.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0012 .5z"/></svg>',
    discord:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12a8 8 0 01-11.5 7.2L4 20l1-4.2A8 8 0 1121 12z"/></svg>',
    link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"/></svg>'};
  INTERACT.links.forEach(function(l){
    var a=document.createElement('a');a.className='lbtn';a.href=l.url;a.target='_blank';a.rel='noopener';
    var ic=l.icon?(ICONS[l.icon]||'<span class="emo">'+esc(l.icon)+'</span>'):ICONS.link;
    a.innerHTML=ic+'<span class="lt">'+esc(l.label)+'</span>'+((l.tip||l.tipText)?'<span class="tip"><b>'+esc(l.tip)+'</b>'+esc(l.tipText)+'</span>':'');
    $('#linkrow').appendChild(a)})}

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
  var lim=+$('#grid').dataset.limit||0;if(lim){filter='current';tabs.style.display='none'}
  shown=[];P.forEach(function(p,i){if((filter==='all'||(p.status==='past'?'past':'current')===filter)&&(!lim||shown.length<lim))shown.push(i)});
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
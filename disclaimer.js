/* ===== DISCLAIMER PAGE =====
   Edit the text below, then save. Each line in "paragraphs" is one paragraph.
   Put quotes around each paragraph and a comma after it (except the last one).
   To remove the picture, delete the whole IMAGE block or set file to "".
*/
var DISCLAIMER = {
  title: "Disclaimer",
  paragraphs: [
    "i'm still learning html, css and javascript, and i'm only semi-proficient in luau. because of that, i got help from claude, an ai assistant made by anthropic, to code this website. the ideas, the content and the direction are mine. the code is where i got help.",
    "i think ai is good to use for learning and growing. it can explain things, get you unstuck, and help you try stuff you couldn't do on your own yet.",
    "but it isn't good for replacing human creativity. making music, art, animations and games is worth doing yourself, and a person's own voice isn't something generated work can stand in for.",
    "thanks for visiting."
  ],
  image: {
    file: "assets/12-giggles.jpg",
    alt: "a very serious looking roblox character sitting in a desert truck",
    caption: "(for giggles)"
  }
};

/* ---- you don't need to edit below this line ---- */
(function(){
  var box=document.getElementById('note'),t=document.getElementById('dtitle');
  if(!box||typeof DISCLAIMER==='undefined')return;
  if(t&&DISCLAIMER.title)t.textContent=DISCLAIMER.title;
  box.textContent='';
  DISCLAIMER.paragraphs.forEach(function(s,i,a){var p=document.createElement('p');p.textContent=s;if(i===a.length-1&&!(DISCLAIMER.image&&DISCLAIMER.image.file))p.style.margin='0';box.appendChild(p)});
  var im=DISCLAIMER.image;
  if(im&&im.file){
    var f=document.createElement('figure');f.style.cssText='margin:8px 0 0;text-align:center';
    var i=document.createElement('img');i.src=im.file;i.alt=im.alt||'';i.style.cssText='display:block;margin:0 auto;width:100%;max-width:340px;border:2px solid var(--ink);box-shadow:5px 5px 0 var(--ink)';
    f.appendChild(i);
    if(im.caption){var c=document.createElement('figcaption');c.textContent=im.caption;c.style.cssText='margin-top:12px;font:500 13px "Pixelify Sans",monospace;color:var(--muted)';f.appendChild(c)}
    box.appendChild(f)}
})();

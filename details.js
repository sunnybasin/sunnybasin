/* ===== "MORE INFO" PAGES =====
   The pages in the top bar (about, projects, contact) show extra detail beyond the home page.
   Edit the text below to add more. Keep the quotes and commas the same.
   To add a topic, copy one { ... } block and add a comma after the one before it. */
var MORE = {
  about: {
    heading: "More about me",
    paragraphs: [
      "i'm a composer, violinist, animator, dev, builder, modeler, programmer/coder, and cross country runner. i like making things and learning how they work.",
      "occasionally i volunteer for community work and game projects. below is a little more about each thing i do."
    ],
    topics: [
      { title: "composer",  text: "orchestral and classical, mostly. the music lives on YouTube and Bandcamp, though i don't upload as much anymore.",
        link: { label: "listen on bandcamp", url: "https://sunnyv3.bandcamp.com/" } },
      { title: "violinist", text: "i started on the piano and moved to the violin, and i've been playing for years." },
      { title: "animator",  text: "currently animating with ragdolls for an anniversary project." },
      { title: "dev",       text: "protogen os lite is open source, so you can look at the code on GitHub.",
        link: { label: "see it on github", url: "https://github.com/sunnybasin/protogen-os-lite/tree/main" } },
      { title: "builder",   text: "protogen hardware, a sticker-wrapped shotgun build, and more." },
      { title: "modeler",   text: "3D models for games and community projects." },
      { title: "runner",    text: "cross country. i'm not that fast, but i love it and i never skip a run." }
    ]
  },
  projects: {
    heading: "About these projects",
    paragraphs: [
      "these are the things i'm working on and have worked on. the ones i'm working on now come first, and the finished ones are under past projects. click a picture to see it bigger.",
      "most of what i build is for fun, and a lot of it is software and electronics for my protogen build."
    ],
    links: [
      { title: "protogen os lite", text: "the code for the protogen build.", link: { label: "open on github", url: "https://github.com/sunnybasin/protogen-os-lite/tree/main" } },
      { title: "my music", text: "classical and orchestral pieces i make for fun.", link: { label: "youtube", url: "https://www.youtube.com/@sunnybv3" } }
    ]
  },
  contact: {
    heading: "What to message me about",
    paragraphs: [
      "the quickest way to reach me is discord (@sunnybasin) or the message form below. i read everything, but i might take a bit to reply."
    ],
    topics: [
      "music, collabs, and questions about my pieces",
      "game projects and community work",
      "questions about the protogen build or the open source code",
      "or just saying hi"
    ]
  }
};

/* ---- you don't need to edit below this line ---- */
(function(){
  if(typeof MORE==='undefined')return;
  var $=function(s){return document.querySelector(s)};
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  function paras(box,arr){if(!box)return;arr.forEach(function(s){box.appendChild(el('p','',s))})}
  function cards(box,arr){if(!box)return;arr.forEach(function(t){var c=el('div','box topic');c.appendChild(el('h3','',t.title));c.appendChild(el('p','',t.text));
    if(t.link){var a=el('a','',t.link.label+' →');a.href=t.link.url;a.target='_blank';a.rel='noopener';c.appendChild(a)}box.appendChild(c)})}
  function head(id,t){var h=$(id);if(h&&t)h.textContent=t}
  head('#ma-h',MORE.about.heading);paras($('#ma-text'),MORE.about.paragraphs);cards($('#topics'),MORE.about.topics);
  head('#mp-h',MORE.projects.heading);paras($('#mp-text'),MORE.projects.paragraphs);cards($('#mp-links'),MORE.projects.links);
  head('#mc-h',MORE.contact.heading);paras($('#mc-text'),MORE.contact.paragraphs);
  var ul=$('#mc-topics');if(ul)MORE.contact.topics.forEach(function(s){ul.appendChild(el('li','',s))});
})();

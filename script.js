const body=document.body;
const nav=document.querySelector('.nav');
const toggle=document.querySelector('.nav-toggle');
const menu=document.querySelector('.nav-links');

// Mobile navigation
if(toggle && menu){
  toggle.addEventListener('click',()=>{
    const open=body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded',open);
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>body.classList.remove('menu-open')));
}

// Scroll progress + nav state
const progress=document.querySelector('.scroll-progress');
const updateScroll=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  const p=max>0?scrollY/max:0;
  if(progress) progress.style.transform=`scaleX(${p})`;
  if(nav) nav.classList.toggle('scrolled',scrollY>30);
};
addEventListener('scroll',updateScroll,{passive:true}); updateScroll();

// Reveal on scroll
const reveals=document.querySelectorAll('[data-reveal]');
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12});
reveals.forEach(el=>io.observe(el));

// Animated counters
const counters=document.querySelectorAll('[data-target]');
const countIO=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target, target=Number(el.dataset.target)||0, suffix=el.dataset.suffix||'';
  let start=0; const duration=1400, t0=performance.now();
  const tick=t=>{const k=Math.min(1,(t-t0)/duration), eased=1-Math.pow(1-k,3); el.textContent=Math.floor(target*eased).toLocaleString()+suffix; if(k<1)requestAnimationFrame(tick)};
  requestAnimationFrame(tick); countIO.unobserve(el);
}),{threshold:.5});
counters.forEach(el=>countIO.observe(el));

// Hero depth / 3D parallax
const hero=document.querySelector('.hero');
const heroLayers=hero?hero.querySelectorAll('[data-depth]'):[];
addEventListener('mousemove',e=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
  heroLayers.forEach(el=>{const d=Number(el.dataset.depth)||1; el.style.transform=`translate3d(${x*d*18}px,${y*d*12}px,0)`});
},{passive:true});

// 3D tilt cards
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${y*-5}deg) rotateY(${x*7}deg) translateY(-5px)`});
  card.addEventListener('pointerleave',()=>card.style.transform='');
 });
}

// Horizontal timeline drag/shift
const timeline=document.querySelector('.timeline-track');
if(timeline){
 let down=false,start=0,left=0;
 timeline.addEventListener('pointerdown',e=>{down=true;start=e.clientX;left=timeline.scrollLeft;timeline.setPointerCapture(e.pointerId)});
 timeline.addEventListener('pointermove',e=>{if(down)timeline.scrollLeft=left-(e.clientX-start)});
 ['pointerup','pointercancel'].forEach(t=>timeline.addEventListener(t,()=>down=false));
}

// Lightbox
const lightbox=document.querySelector('.lightbox');
const lightboxImg=document.querySelector('.lightbox img');
const closeLightbox=()=>{if(lightbox)lightbox.classList.remove('open')};
document.querySelectorAll('[data-lightbox]').forEach(card=>card.addEventListener('click',()=>{
 const img=card.querySelector('img'); if(img&&lightboxImg){lightboxImg.src=img.src;lightboxImg.alt=img.alt;lightbox.classList.add('open')}
}));
if(lightbox){lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.matches('.lightbox-close'))closeLightbox()});addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()})}

// Smooth anchor scrolling
for(const a of document.querySelectorAll('a[href^="#"]'))a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'start'})}});

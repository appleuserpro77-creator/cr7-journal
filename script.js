const q=s=>document.querySelector(s), qa=s=>[...document.querySelectorAll(s)];
const toggle=q('.nav-toggle'), nav=q('.nav nav');
toggle?.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));nav.style.display=open?'':'flex'});
qa('.nav nav a').forEach(a=>a.addEventListener('click',()=>{toggle?.setAttribute('aria-expanded','false');if(innerWidth<=800)nav.style.display='none'}));

const hero=q('.hero-photo');
if(hero && !matchMedia('(prefers-reduced-motion: reduce)').matches){
  addEventListener('scroll',()=>{hero.style.transform=`translate3d(0,${Math.min(scrollY,innerHeight)*.08}px,0) scale(1.04)`},{passive:true});
}
const obs=new IntersectionObserver(es=>es.forEach(e=>{
  if(!e.isIntersecting)return;
  const el=e.target,target=+el.dataset.target,start=performance.now();
  const tick=t=>{const p=Math.min((t-start)/1000,1),ease=1-Math.pow(1-p,3);el.textContent=Math.round(target*ease).toLocaleString();if(p<1)requestAnimationFrame(tick)};
  requestAnimationFrame(tick);obs.unobserve(el);
}),{threshold:.55});
qa('[data-target]').forEach(x=>obs.observe(x));

const viewer=q('.viewer'), viewerTitle=q('.viewer p'), close=q('.viewer button');
qa('.g').forEach(b=>b.addEventListener('click',()=>{viewerTitle.textContent=b.dataset.name||'';viewer.hidden=false;close.focus()}));
const shut=()=>viewer.hidden=true;close.addEventListener('click',shut);viewer.addEventListener('click',e=>{if(e.target===viewer)shut()});
addEventListener('keydown',e=>{if(e.key==='Escape'&&!viewer.hidden)shut()});

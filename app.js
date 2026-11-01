const canvas = document.querySelector('#ascii');
const ctx = canvas.getContext('2d');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = motionPreference.matches;
let angle = 0, lastTime = 0, animationId = 0, width = 0, height = 0;
const points = [];
const logo = new Image();
logo.src = 'assets/logo.png';
// Sample the actual brand asset, retaining the flask outline and binary cutouts.
logo.onload = () => {
  const source = document.createElement('canvas');
  source.width = source.height = 160;
  const sourceCtx = source.getContext('2d', { willReadFrequently: true });
  sourceCtx.drawImage(logo, 0, 0, 160, 160);
  const pixels = sourceCtx.getImageData(0, 0, 160, 160).data;
  for (let y = 0; y < 160; y += 2) for (let x = 0; x < 160; x += 2) {
    const index = (y * 160 + x) * 4;
    if (pixels[index + 2] > 85 && pixels[index + 1] > 70 && pixels[index + 3] > 100) {
      for (const z of [-5, 5]) points.push({x: (x - 80) / 43, y: (y - 72) / 43, z: z / 43, glyph: '01:+*#'[Math.floor(x * 7 + y * 3 + (z + 5)) % 6]});
    }
  }
  resize(); schedule();
};
logo.onerror = () => { canvas.hidden = true; const fallback = document.createElement('img'); fallback.src = 'assets/logo.png'; fallback.alt = 'ZeroByte logo'; fallback.style.cssText = 'width:70%;margin:15%'; canvas.after(fallback); };
function resize() {
  width = canvas.clientWidth; height = canvas.clientHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0); draw();
}
function draw() {
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width * .31, height * .30);
  // A true Y-axis rotation with perspective and a shallow extrusion.
  const c = Math.cos(angle), s = Math.sin(angle);
  const transformed = points.map(p => { const x = p.x*c + p.z*s, z = -p.x*s + p.z*c; return {...p, px:x, depth:z}; }).sort((a,b)=>a.depth-b.depth);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = `${Math.max(5, scale * .053)}px "IBM Plex Mono", monospace`;
  for (const p of transformed) {
    const perspective = 4.8 / (4.8 - p.depth);
    const light = .36 + ((p.depth + 2) / 4) * .57;
    ctx.fillStyle = `rgba(50,163,202,${Math.min(.95, light)})`;
    ctx.fillText(p.glyph, width/2 + p.px*scale*perspective, height/2 + p.y*scale*perspective);
  }
  document.querySelector('#rotation').textContent = `ROTATION / ${String(Math.floor(angle * 180 / Math.PI) % 360).padStart(3,'0')}°`;
}
function frame(time) {
  animationId = 0;
  if (paused || document.hidden) { lastTime = 0; return; }
  if (time - lastTime >= 1000/30) { const dt = lastTime ? Math.min(time-lastTime,100) : 0; angle = (angle + dt * .00032) % (Math.PI * 2); lastTime=time; draw(); }
  schedule();
}
function schedule() { if (!animationId && !paused && !document.hidden && points.length) animationId = requestAnimationFrame(frame); }
motionPreference.addEventListener('change', event => { paused=event.matches; lastTime=0;  draw(); schedule(); });
document.addEventListener('visibilitychange', () => { lastTime=0; if(document.hidden){cancelAnimationFrame(animationId);animationId=0;} else schedule(); });
new ResizeObserver(resize).observe(canvas);

const menu = document.querySelector('.menu'), nav = document.querySelector('#navigation');
function closeMenu() { nav.classList.remove('open'); menu.setAttribute('aria-expanded','false'); }
menu.addEventListener('click', () => { const open=nav.classList.toggle('open'); menu.setAttribute('aria-expanded',String(open)); });
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu(); if(document.activeElement.closest('#navigation')) menu.focus();}});
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){nav.querySelectorAll('a').forEach(link=>{const active=link.hash===`#${entry.target.id}`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});}},{rootMargin:'-15% 0px -55% 0px'});
['home','motto'].forEach(id=>observer.observe(document.getElementById(id)));
document.querySelector('#year').textContent=new Date().getFullYear();

function g(f=50){if(typeof window>"u")return;const d=["#ff6b6b","#feca57","#48dbfb","#ff9ff3","#54a0ff","#5f27cd","#00d2d3","#ff6348","#10b981","#f59e0b","#a78bfa","#34d399"],r=["circle","square","star","heart","triangle","ribbon"],o=["⭐","🌟","✨","🎉","🎊","💫","🔥","💖","🌈","🌟"],a=document.createElement("div");a.style.cssText="position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;",document.body.appendChild(a);const h=[];for(let t=0;t<f;t++){const e=document.createElement("div"),c=d[Math.floor(Math.random()*d.length)],n=r[Math.floor(Math.random()*r.length)],s=Math.random()*12+6,m=Math.random()*100,p=Math.random()*1080,u=Math.random()*2.5+1.5,$=Math.random()*.5;let x="50%";if(n==="square"?x="2px":n==="triangle"?x="0":n==="ribbon"&&(x="2px 50% 50% 2px"),t%7===0){const y=o[Math.floor(Math.random()*o.length)];e.textContent=y,e.style.cssText=`
        position:absolute;
        left:${m}%;
        top:-30px;
        font-size:${s+8}px;
        animation:confetti-fall${t} ${u}s ease-out ${$}s forwards;
        transform:rotate(0deg);
      `}else e.style.cssText=`
        position:absolute;
        left:${m}%;
        top:-20px;
        width:${s}px;
        height:${s*(n==="ribbon"?.4:.8)}px;
        background:${c};
        border-radius:${x};
        ${n==="star"?"clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);":""}
        ${n==="heart"?"width:10px;height:10px;background:"+c+";border-radius:10px 10px 0;":""}
        animation:confetti-fall${t} ${u}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${$}s forwards;
        transform:rotate(0deg);
      `;const M=`
      @keyframes confetti-fall${t} {
        0% {
          transform: translateY(0) rotate(0deg) scale(0.5);
          opacity: 1;
        }
        20% {
          transform: translateY(${window.innerHeight*.3}px) rotate(${p*.3}deg) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(${window.innerHeight+50}px) rotate(${p}deg) scale(0.6);
          opacity: 0.2;
        }
      }
    `,b=document.createElement("style");b.textContent=M,document.head.appendChild(b),a.appendChild(e),h.push(e)}const i=document.createElement("div");i.style.cssText=`
    position:fixed;
    top:50%;
    left:50%;
    pointer-events:none;
    z-index:10000;
    transform:translate(-50%, -50%);
  `;const l=["✨","⭐","💫","🌟","✨","⭐"];l.forEach((t,e)=>{const c=document.createElement("span"),n=e/l.length*360,s=80+Math.random()*60;c.textContent=t,c.style.cssText=`
      position:absolute;
      font-size:${16+Math.random()*14}px;
      animation: sparkle-burst-${e} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      transform: translate(0, 0);
    `;const m=`
      @keyframes sparkle-burst-${e} {
        0% { transform: translate(0, 0) scale(0); opacity: 1; }
        60% { transform: translate(${Math.cos(n*Math.PI/180)*s}px, ${Math.sin(n*Math.PI/180)*s}px) scale(1.2); opacity: 1; }
        100% { transform: translate(${Math.cos(n*Math.PI/180)*s*1.5}px, ${Math.sin(n*Math.PI/180)*s*1.5}px) scale(0); opacity: 0; }
      }
    `,p=document.createElement("style");p.textContent=m,document.head.appendChild(p),i.appendChild(c)}),a.appendChild(i),setTimeout(()=>{a.remove(),h.forEach(t=>t.remove())},5e3)}function C(f=12){if(typeof window>"u")return;const d=["✨","⭐","💫","🌟"],r=document.createElement("div");r.style.cssText="position:fixed;top:50%;left:50%;pointer-events:none;z-index:9999;",document.body.appendChild(r);for(let o=0;o<f;o++){const a=document.createElement("span"),h=d[Math.floor(Math.random()*d.length)],i=o/f*360+Math.random()*30,l=40+Math.random()*50;a.textContent=h,a.style.cssText=`position:absolute;font-size:${12+Math.random()*10}px;animation:spark-${o} 0.6s ease-out forwards`;const t=`
      @keyframes spark-${o} {
        0% { transform: translate(0,0) scale(0) rotate(0deg); opacity: 1; }
        100% { transform: translate(${Math.cos(i*Math.PI/180)*l}px, ${Math.sin(i*Math.PI/180)*l}px) scale(1.5) rotate(${Math.random()*360}deg); opacity: 0; }
      }
    `,e=document.createElement("style");e.textContent=t,document.head.appendChild(e),r.appendChild(a)}setTimeout(()=>r.remove(),800)}export{C as a,g as f};

export function fireConfetti(count = 50) {
  if (typeof window === "undefined") return;

  const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff6348", "#10b981", "#f59e0b", "#a78bfa", "#34d399"];
  const shapes = ["circle", "square", "star", "heart", "triangle", "ribbon"];
  const emojis = ["⭐", "🌟", "✨", "🎉", "🎊", "💫", "🔥", "💖", "🌈", "🌟"];

  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
  document.body.appendChild(container);

  const particles: HTMLDivElement[] = [];

  // Confetti particles
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = Math.random() * 12 + 6;
    const startX = Math.random() * 100;
    const rotation = Math.random() * 1080;
    const duration = Math.random() * 2.5 + 1.5;
    const delay = Math.random() * 0.5;

    let borderRadius = "50%";
    if (shape === "square") borderRadius = "2px";
    else if (shape === "triangle") borderRadius = "0";
    else if (shape === "ribbon") borderRadius = "2px 50% 50% 2px";

    // Make some particles emoji
    if (i % 7 === 0) {
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      particle.textContent = emoji;
      particle.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:-30px;
        font-size:${size + 8}px;
        animation:confetti-fall${i} ${duration}s ease-out ${delay}s forwards;
        transform:rotate(0deg);
      `;
    } else {
      particle.style.cssText = `
        position:absolute;
        left:${startX}%;
        top:-20px;
        width:${size}px;
        height:${size * (shape === "ribbon" ? 0.4 : 0.8)}px;
        background:${color};
        border-radius:${borderRadius};
        ${shape === "star" ? `clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);` : ""}
        ${shape === "heart" ? "width:10px;height:10px;background:" + color + ";border-radius:10px 10px 0;" : ""}
        animation:confetti-fall${i} ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards;
        transform:rotate(0deg);
      `;
    }

    const keyframes = `
      @keyframes confetti-fall${i} {
        0% {
          transform: translateY(0) rotate(0deg) scale(0.5);
          opacity: 1;
        }
        20% {
          transform: translateY(${window.innerHeight * 0.3}px) rotate(${rotation * 0.3}deg) scale(1);
          opacity: 1;
        }
        100% {
          transform: translateY(${window.innerHeight + 50}px) rotate(${rotation}deg) scale(0.6);
          opacity: 0.2;
        }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    container.appendChild(particle);
    particles.push(particle);
  }

  // Sparkle burst at the center
  const burst = document.createElement("div");
  burst.style.cssText = `
    position:fixed;
    top:50%;
    left:50%;
    pointer-events:none;
    z-index:10000;
    transform:translate(-50%, -50%);
  `;

  const sparkles = ["✨", "⭐", "💫", "🌟", "✨", "⭐"];
  sparkles.forEach((s, i) => {
    const span = document.createElement("span");
    const angle = (i / sparkles.length) * 360;
    const distance = 80 + Math.random() * 60;
    span.textContent = s;
    span.style.cssText = `
      position:absolute;
      font-size:${16 + Math.random() * 14}px;
      animation: sparkle-burst-${i} 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      transform: translate(0, 0);
    `;
    const kf = `
      @keyframes sparkle-burst-${i} {
        0% { transform: translate(0, 0) scale(0); opacity: 1; }
        60% { transform: translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(1.2); opacity: 1; }
        100% { transform: translate(${Math.cos(angle * Math.PI / 180) * distance * 1.5}px, ${Math.sin(angle * Math.PI / 180) * distance * 1.5}px) scale(0); opacity: 0; }
      }
    `;
    const sheet = document.createElement("style");
    sheet.textContent = kf;
    document.head.appendChild(sheet);
    burst.appendChild(span);
  });
  container.appendChild(burst);

  setTimeout(() => {
    container.remove();
    particles.forEach((p) => p.remove());
  }, 5000);
}

/** Small sparkle burst for mini-achievements (correct answers, XP gains) */
export function fireSparkles(count = 12) {
  if (typeof window === "undefined") return;

  const emojis = ["✨", "⭐", "💫", "🌟"];
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;top:50%;left:50%;pointer-events:none;z-index:9999;";
  document.body.appendChild(container);

  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (i / count) * 360 + Math.random() * 30;
    const distance = 40 + Math.random() * 50;
    span.textContent = emoji;
    span.style.cssText = `position:absolute;font-size:${12 + Math.random() * 10}px;animation:spark-${i} 0.6s ease-out forwards`;
    const kf = `
      @keyframes spark-${i} {
        0% { transform: translate(0,0) scale(0) rotate(0deg); opacity: 1; }
        100% { transform: translate(${Math.cos(angle * Math.PI / 180) * distance}px, ${Math.sin(angle * Math.PI / 180) * distance}px) scale(1.5) rotate(${Math.random() * 360}deg); opacity: 0; }
      }
    `;
    const sheet = document.createElement("style");
    sheet.textContent = kf;
    document.head.appendChild(sheet);
    container.appendChild(span);
  }

  setTimeout(() => container.remove(), 800);
}

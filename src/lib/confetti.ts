export function fireConfetti(count = 50) {
  if (typeof window === "undefined") return;

  const colors = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff6348"];
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;";
  document.body.appendChild(container);

  const particles: HTMLDivElement[] = [];

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 10 + 5;
    const startX = Math.random() * 100;
    const rotation = Math.random() * 720;
    const duration = Math.random() * 2 + 1;

    particle.style.cssText = `
      position:absolute;
      left:${startX}%;
      top:-20px;
      width:${size}px;
      height:${size * 0.6}px;
      background:${color};
      border-radius:${Math.random() > 0.5 ? "50%" : "2px"};
      transform:rotate(0deg);
      animation:confetti-fall${i} ${duration}s ease-out forwards;
    `;

    const keyframes = `
      @keyframes confetti-fall${i} {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(${window.innerHeight + 50}px) rotate(${rotation}deg); opacity: 0.3; }
      }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.textContent = keyframes;
    document.head.appendChild(styleSheet);

    particle.style.animation = `confetti-fall${i} ${duration}s ease-out forwards`;
    container.appendChild(particle);
    particles.push(particle);
  }

  setTimeout(() => {
    container.remove();
    particles.forEach((p) => p.remove());
  }, 4000);
}

// js/bubbles.js
// Ocean ambiance bubble animation for #bubble-bg canvas
(function() {
  const canvas = document.getElementById('bubble-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  // Ensure canvas is always at the bottom and covers the viewport
  canvas.style.position = 'fixed';
  canvas.style.left = '0';
  canvas.style.top = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '0';
  canvas.style.pointerEvents = 'none';
  // canvas.style.border = '2px solid red'; // Uncomment for debug

  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;
  let bubbles = [];
  let BUBBLE_COUNT = Math.floor((width * height) / 9000);

  function randomBubble() {
    const r = Math.random() * 24 + 12;
    return {
      x: Math.random() * width,
      y: height + r + Math.random() * height * 0.2,
      r,
      speed: 0.4 + Math.random() * 0.7,
      drift: (Math.random() - 0.5) * 0.3,
      alpha: 0.12 + Math.random() * 0.18,
      hue: 190 + Math.random() * 30
    };
  }

  function initBubbles() {
    BUBBLE_COUNT = Math.floor((width * height) / 9000);
    bubbles = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      bubbles.push(randomBubble());
    }
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    // Do NOT set canvas.style.width/height to pixel values here!
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr);
    initBubbles(); // Reinitialize bubbles for new size
  }
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const b of bubbles) {
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
      const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.2, b.x, b.y, b.r);
      grad.addColorStop(0, `hsla(${b.hue}, 80%, 95%, 0.7)`);
      grad.addColorStop(1, `hsla(${b.hue}, 80%, 60%, 0.1)`);
      ctx.fillStyle = grad;
      ctx.shadowColor = `hsla(${b.hue}, 80%, 80%, 0.5)`;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
    }
    // console.log('Bubbles drawn:', bubbles.length); // Uncomment for debug
  }
  function update() {
    for (const b of bubbles) {
      b.y -= b.speed;
      b.x += b.drift;
      if (b.y + b.r < 0 || b.x < -b.r || b.x > width + b.r) {
        Object.assign(b, randomBubble());
        b.y = height + b.r;
      }
    }
  }
  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }
  loop();
})(); 
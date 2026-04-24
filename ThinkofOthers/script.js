(() => {
  // ============ CUSTOM CURSOR ============
  const cursor = document.getElementById('cursor');
  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.15;
    curY += (mouseY - curY) * 0.15;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // cursor hover effect
  document.querySelectorAll('button, .stanza, a').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });

  // ============ CONSTELLATION CANVAS ============
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars = [];
    const count = Math.floor((W * H) / 8000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkle: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);

    // draw stars
    stars.forEach((star) => {
      star.twinkle += star.twinkleSpeed;
      const tw = (Math.sin(star.twinkle) + 1) / 2;
      const op = star.opacity * (0.5 + tw * 0.5);

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 235, 220, ${op})`;
      ctx.fill();

      // glow
      if (star.r > 1) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r * 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.r * 3);
        gradient.addColorStop(0, `rgba(201, 168, 97, ${op * 0.4})`);
        gradient.addColorStop(1, 'rgba(201, 168, 97, 0)');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    });

    // connect nearby stars
    for (let i = 0; i < stars.length; i++) {
      for (let j = i + 1; j < stars.length; j++) {
        const dx = stars[i].x - stars[j].x;
        const dy = stars[i].y - stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.strokeStyle = `rgba(201, 168, 97, ${(1 - dist / 120) * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  drawStars();

  // ============ STANZA REVEAL ============
  const items = document.querySelectorAll('[data-stanza]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((item) => observer.observe(item));

  // ============ LANGUAGE TOGGLE ============
  const langToggle = document.getElementById('langToggle');
  const langButtons = langToggle.querySelectorAll('button');

  langButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      langButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      langToggle.classList.remove('ar', 'en');
      langToggle.classList.add(lang);
      document.body.classList.remove('lang-ar', 'lang-en');
      document.body.classList.add('lang-' + lang);
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
  });
})();

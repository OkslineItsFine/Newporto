/* ═══════════════════════════════════════
   IBRA PORTFOLIO — script.js
   Parallax · Cursor · Animations · Forms
═══════════════════════════════════════ */

"use strict";

/* ════════════════════════════════════
   1. CUSTOM CURSOR — Square bracket style
════════════════════════════════════ */
(function initCursor() {
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if (!dot || !ring) return;

  // Inject bracket SVG into ring
  ring.innerHTML = `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- top-left bracket -->
      <path d="M4 12 L4 4 L12 4" stroke="#111111" stroke-width="1.5" stroke-linecap="round"/>
      <!-- top-right bracket -->
      <path d="M24 4 L32 4 L32 12" stroke="#111111" stroke-width="1.5" stroke-linecap="round"/>
      <!-- bottom-left bracket -->
      <path d="M4 24 L4 32 L12 32" stroke="#111111" stroke-width="1.5" stroke-linecap="round"/>
      <!-- bottom-right bracket -->
      <path d="M24 32 L32 32 L32 24" stroke="#111111" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `;

  let mx = 0,
    my = 0;
  let rx = 0,
    ry = 0;
  let dotX = 0,
    dotY = 0;

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
    // dot tracks instantly
    dotX = mx - 2.5;
    dotY = my - 2.5;
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
  });

  // ring follows with smooth lag
  (function animateRing() {
    rx += (mx - rx - 18) * 0.1;
    ry += (my - ry - 18) * 0.1;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animateRing);
  })();

  // Grow (rotate) on hover
  const hoverEls = document.querySelectorAll(
    "a, button, .proj-card, .csoc, .skill-item, .contact-info-item",
  );
  hoverEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      ring.classList.add("grow");
      ring.querySelector("svg").style.transform = "scale(1.6) rotate(45deg)";
    });
    el.addEventListener("mouseleave", () => {
      ring.classList.remove("grow");
      ring.querySelector("svg").style.transform = "";
    });
  });

  // Hide cursor when outside window
  document.addEventListener("mouseleave", () =>
    ring.classList.add("hidden-cur"),
  );
  document.addEventListener("mouseenter", () =>
    ring.classList.remove("hidden-cur"),
  );
})();

/* ════════════════════════════════════
   2. NAVBAR — scroll + hamburger
════════════════════════════════════ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // Scroll class
  window.addEventListener(
    "scroll",
    () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
      updateActiveLink();
    },
    { passive: true },
  );

  // Hamburger
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
    document.body.style.overflow = mobileMenu.classList.contains("open")
      ? "hidden"
      : "";
  });

  // Active link highlight
  function updateActiveLink() {
    const secs = document.querySelectorAll("section[id]");
    let current = "";
    secs.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
    });
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${current}`;
      a.classList.toggle("active", isActive);
    });
  }
})();

// Global close mob menu (called from onclick in HTML)
window.closeMob = function () {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.classList.remove("open");
  mobileMenu.classList.remove("open");
  document.body.style.overflow = "";
};

/* ════════════════════════════════════
   3. HERO CANVAS — Parallax Geometric
════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let W,
    H,
    shapes = [];
  let mouseX = 0,
    mouseY = 0;
  let scrollY = 0;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function buildShapes() {
    shapes = [];

    // Floating circles
    for (let i = 0; i < 8; i++) {
      shapes.push({
        type: "circle",
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 120 + 30,
        ox: 0,
        oy: 0, // offset applied by parallax
        speed: Math.random() * 0.04 + 0.01,
        alpha: Math.random() * 0.06 + 0.02,
        color: i % 2 === 0 ? "17,17,17" : "200,169,138",
      });
    }

    // Lines
    for (let i = 0; i < 6; i++) {
      shapes.push({
        type: "line",
        x1: Math.random() * W,
        y1: Math.random() * H,
        x2: Math.random() * W,
        y2: Math.random() * H,
        speed: Math.random() * 0.03 + 0.005,
        ox: 0,
        oy: 0,
        alpha: Math.random() * 0.08 + 0.02,
      });
    }

    // Dots grid
    for (let gx = 0; gx < W; gx += 60) {
      for (let gy = 60; gy < H; gy += 60) {
        shapes.push({
          type: "dot",
          x: gx + 30,
          y: gy,
          r: 1.5,
          ox: 0,
          oy: 0,
          speed: 0.02,
          alpha: 0.12,
        });
      }
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    shapes.forEach((s) => {
      // Subtle parallax offset from mouse
      s.ox += (mouseX * s.speed * 0.5 - s.ox) * 0.06;
      s.oy += (mouseY * s.speed * 0.5 - s.oy) * 0.06;

      // Scroll parallax
      const scrollOff = scrollY * s.speed * 0.3;

      ctx.save();
      ctx.globalAlpha = s.alpha;

      if (s.type === "circle") {
        // Subtle float animation
        const floatY = Math.sin(frame * 0.008 + s.x) * 8;
        ctx.beginPath();
        ctx.arc(
          s.x + s.ox,
          s.y + s.oy + floatY - scrollOff,
          s.r,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(${s.color || "17,17,17"}, 1)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (s.type === "line") {
        ctx.beginPath();
        ctx.moveTo(s.x1 + s.ox, s.y1 + s.oy - scrollOff);
        ctx.lineTo(s.x2 + s.ox, s.y2 + s.oy - scrollOff);
        ctx.strokeStyle = "rgba(17,17,17,1)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      } else if (s.type === "dot") {
        ctx.beginPath();
        ctx.arc(s.x + s.ox, s.y + s.oy - scrollOff, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(17,17,17,1)";
        ctx.fill();
      }

      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      mouseX = (e.clientX - W / 2) * 0.05;
      mouseY = (e.clientY - H / 2) * 0.05;
    },
    { passive: true },
  );

  window.addEventListener(
    "scroll",
    () => {
      scrollY = window.scrollY;
    },
    { passive: true },
  );

  window.addEventListener("resize", () => {
    resize();
    buildShapes();
  });
  resize();
  buildShapes();
  draw();
})();

/* ════════════════════════════════════
   4. SECTION PARALLAX — About & Contact BGs
════════════════════════════════════ */
(function initSectionParallax() {
  const sections = [
    { bgId: "aboutBg", sectionId: "about", speed: 0.25 },
    { bgId: "contactBg", sectionId: "contact", speed: 0.2 },
  ];

  // Inject SVG parallax backgrounds
  sections.forEach(({ bgId }) => {
    const bg = document.getElementById(bgId);
    if (!bg) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.style.position = "absolute";
    svg.style.inset = "0";
    svg.style.opacity = "0.5";

    // Draw grid lines
    for (let i = 0; i < 20; i++) {
      const x = (i / 20) * 100;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", `${x}%`);
      line.setAttribute("y1", "0");
      line.setAttribute("x2", `${x}%`);
      line.setAttribute("y2", "100%");
      line.setAttribute("stroke", "rgba(17,17,17,0.04)");
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);
    }
    for (let i = 0; i < 16; i++) {
      const y = (i / 16) * 100;
      const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line",
      );
      line.setAttribute("x1", "0");
      line.setAttribute("y1", `${y}%`);
      line.setAttribute("x2", "100%");
      line.setAttribute("y2", `${y}%`);
      line.setAttribute("stroke", "rgba(17,17,17,0.04)");
      line.setAttribute("stroke-width", "1");
      svg.appendChild(line);
    }

    // A few floating circles
    [
      [15, 20, 180],
      [75, 70, 120],
      [50, 45, 80],
    ].forEach(([cx, cy, r]) => {
      const circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", `${cx}%`);
      circle.setAttribute("cy", `${cy}%`);
      circle.setAttribute("r", r);
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "rgba(200,169,138,0.12)");
      circle.setAttribute("stroke-width", "1");
      svg.appendChild(circle);
    });

    bg.appendChild(svg);
  });

  // Parallax on scroll
  function applyParallax() {
    sections.forEach(({ bgId, sectionId, speed }) => {
      const bg = document.getElementById(bgId);
      const sec = document.getElementById(sectionId);
      if (!bg || !sec) return;

      const rect = sec.getBoundingClientRect();
      const offset = rect.top * speed;
      bg.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener("scroll", applyParallax, { passive: true });
  applyParallax();
})();

/* ════════════════════════════════════
   5. SCROLL REVEAL
════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("on");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  els.forEach((el) => obs.observe(el));

  // Hero reveals on load
  setTimeout(() => {
    document.querySelectorAll("#home .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("on"), i * 140 + 100);
    });
  }, 200);
})();

/* ════════════════════════════════════
   6. TYPED TEXT EFFECT
════════════════════════════════════ */
(function initTyped() {
  const el = document.getElementById("typedRole");
  if (!el) return;

  const roles = [
    "Web Developer",
    "Vibes Coder",
    "Photographer",
    "Front End Dev",
    "SMK Telkom Student",
  ];
  let ri = 0,
    ci = 0,
    deleting = false;

  function type() {
    const current = roles[ri];
    if (deleting) {
      el.textContent = current.slice(0, --ci);
    } else {
      el.textContent = current.slice(0, ++ci);
    }

    let speed = deleting ? 50 : 90;
    if (!deleting && ci === current.length) {
      speed = 1800;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      ri = (ri + 1) % roles.length;
      speed = 300;
    }

    setTimeout(type, speed);
  }
  setTimeout(type, 800);
})();

/* ════════════════════════════════════
   7. COUNTER ANIMATION (no-op, floaters removed)
════════════════════════════════════ */
// floater cards removed — counter not needed

/* ════════════════════════════════════
   8. SKILL BAR ANIMATION
════════════════════════════════════ */
(function initSkillBars() {
  const fills = document.querySelectorAll(".skill-fill");

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );

  fills.forEach((el) => obs.observe(el));
})();

/* ════════════════════════════════════
   9. HERO PARALLAX ON SCROLL
════════════════════════════════════ */
(function initHeroParallax() {
  const heroContent = document.querySelector(".hero-content");
  const heroFloater = document.querySelector(".hero-floater");

  window.addEventListener(
    "scroll",
    () => {
      const sy = window.scrollY;
      if (heroContent) {
        heroContent.style.transform = `translateY(${sy * 0.18}px)`;
        heroContent.style.opacity = `${1 - sy / 500}`;
      }
      if (heroFloater) {
        heroFloater.style.transform = `translateY(${sy * 0.12}px)`;
        heroFloater.style.opacity = `${1 - sy / 400}`;
      }
    },
    { passive: true },
  );
})();

/* ════════════════════════════════════
   10. PROJECT CARD TILT
════════════════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll(".proj-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `
        perspective(700px)
        rotateX(${-yPct * 5}deg)
        rotateY(${xPct * 5}deg)
        translateY(-6px)
      `;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.transition =
        "transform .5s cubic-bezier(0.16,1,0.3,1), box-shadow .4s";
      setTimeout(() => (card.style.transition = ""), 500);
    });

    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  });
})();

/* ════════════════════════════════════
   11. CONTACT FORM
════════════════════════════════════ */
window.handleSubmit = function (e) {
  e.preventDefault();
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const btn = form.querySelector('button[type="submit"]');

  btn.textContent = "Mengirim...";
  btn.disabled = true;

  // Simulate send
  setTimeout(() => {
    success.style.display = "block";
    form.reset();
    btn.textContent = "Kirim Pesan";
    btn.disabled = false;
    setTimeout(() => {
      success.style.display = "none";
    }, 5000);
  }, 1200);
};

/* ════════════════════════════════════
   12. SMOOTH HASH SCROLL (for browsers)
════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ════════════════════════════════════
   13. BACK TO TOP
════════════════════════════════════ */
(function initBackToTop() {
  const btn = document.querySelector(".footer-totop");
  if (!btn) return;
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* ════════════════════════════════════
   14. PAGE LOAD FADE
════════════════════════════════════ */
(function initPageLoad() {
  document.body.style.opacity = "0";
  document.body.style.transition = "opacity .5s ease";
  window.addEventListener("load", () => {
    document.body.style.opacity = "1";
  });
})();

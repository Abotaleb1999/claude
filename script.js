const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) {
  const strings = ["Full Stack Developer", "React Specialist", "Node.js Expert", "Open Source Contributor"];
  let stringIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    const current = strings[stringIndex];
    if (!deleting) {
      heroSubtitle.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      heroSubtitle.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        stringIndex = (stringIndex + 1) % strings.length;
        setTimeout(type, 400);
        return;
      }
    }
    setTimeout(type, deleting ? 60 : 100);
  };
  type();
}

const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
fadeEls.forEach(el => fadeObserver.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const navLinks = document.querySelectorAll('.nav a[href^="#"]');
const sections = Array.from(navLinks).map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const setActiveNav = () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = '#' + section.id;
    }
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
};
window.addEventListener('scroll', setActiveNav);
setActiveNav();

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -10;
    const rotateY = ((x - cx) / cx) * 10;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03,1.03,1.03)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
    card.style.transition = 'transform 0.4s ease';
  });
});

const skillsSection = document.querySelector('#skills') || document.querySelector('.skills');
if (skillsSection) {
  let skillsAnimated = false;
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !skillsAnimated) {
        skillsAnimated = true;
        const badges = entry.target.querySelectorAll('.skill-badge');
        badges.forEach((badge, i) => {
          badge.style.opacity = '0';
          badge.style.transform = 'translateY(20px)';
          badge.style.transition = `opacity 0.4s ease ${i * 100}ms, transform 0.4s ease ${i * 100}ms`;
          requestAnimationFrame(() => {
            setTimeout(() => {
              badge.style.opacity = '1';
              badge.style.transform = 'translateY(0)';
            }, i * 100);
          });
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

const contactForm = document.querySelector('.contact-form') || document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const toast = document.createElement('div');
    toast.textContent = "Message sent successfully! I'll get back to you soon.";
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
      color: '#fff',
      padding: '16px 28px',
      borderRadius: '12px',
      fontSize: '15px',
      fontWeight: '500',
      boxShadow: '0 8px 32px rgba(124,58,237,0.35)',
      zIndex: '9999',
      opacity: '0',
      transform: 'translateY(20px)',
      transition: 'opacity 0.4s ease, transform 0.4s ease',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 3000);
    contactForm.reset();
  });
}

const heroSection = document.querySelector('.hero');
if (heroSection) {
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '0',
  });
  if (getComputedStyle(heroSection).position === 'static') {
    heroSection.style.position = 'relative';
  }
  heroSection.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let w, h, particles;

  const resize = () => {
    w = canvas.width = heroSection.offsetWidth;
    h = canvas.height = heroSection.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const NUM = 80;
  const createParticles = () => Array.from({ length: NUM }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2.5 + 1,
  }));
  particles = createParticles();

  const MAX_DIST = 120;

  const animateParticles = () => {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(167,139,250,0.6)';
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(167,139,250,${(1 - dist / MAX_DIST) * 0.25})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateParticles);
  };
  animateParticles();
}

const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
Object.assign(cursorGlow.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '380px',
  height: '380px',
  borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.06) 40%, transparent 70%)',
  pointerEvents: 'none',
  zIndex: '9998',
  transform: 'translate(-50%, -50%)',
  transition: 'opacity 0.3s ease',
  opacity: '0',
  willChange: 'transform',
});
document.body.appendChild(cursorGlow);

let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;
let glowVisible = false;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!glowVisible) {
    cursorGlow.style.opacity = '1';
    glowVisible = true;
  }
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
  glowVisible = false;
});

const lerp = (a, b, t) => a + (b - a) * t;

const animateGlow = () => {
  glowX = lerp(glowX, mouseX, 0.08);
  glowY = lerp(glowY, mouseY, 0.08);
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top = glowY + 'px';
  requestAnimationFrame(animateGlow);
};
animateGlow();

/* NAVBAR SCROOL */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
});

/* MOBILE MENU */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* PARTICLE CANVAS */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createParticles() {
    particles = [];
    const count = Math.floor((canvas.width * canvas.height) / 14000);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            dx: (Math.random() - 0.5) * 0.4,
            dy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.5 ? '0,212,170' : '129,140,248',
        });
    }
}
createParticles();
window.addEventListener('resize', createParticles);

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    /* connect nearby particles */
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(129,140,248,${0.07 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke()
            }
        }
    }

    /* dots */
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    })

    requestAnimationFrame(drawParticles);
}

drawParticles();

/* TYPEWRITER */
const rolesPT = ['Estudante de ADS', 'Suporte TI N1', 'Dev em formação'];
const rolesEN = ['ADS Student', 'IT Support N1', 'Developer in training'];
let lang = 'pt';
let roleIdx = 0;
let charIdx = 0;
let deleting = false;
const typedEl = document.querySelector('.typed-text');

function typeWriter() {
    const roles = lang === 'pt' ? rolesPT : rolesEN;
    const current = roles[roleIdx % roles.length];
    if (!deleting) {
        typedEl.textContent = current.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
            deleting = true;
            setTimeout(typeWriter, 1800);
            return
        }
    } else {
        typedEl.textContent = current.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
            deleting = false;
            roleIdx++;
        }
    }
    setTimeout(typeWriter, deleting ? 50 : 80);
}

typeWriter();

/* SCROLL REVEAL */
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in, .timeline-item, .stat-card, .skill-item, .project-card').forEach(el => {
    observer.observe(el);
});

/* stagger timeline cards */
document.querySelectorAll('.timeline-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
})

/* LANGUAGE SWITCHER */
const langBtn = document.getElementById('langBtn');
langBtn.addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    const attr = lang === 'pt' ? 'data-pt' : 'data-en';
    document.querySelectorAll(`[${attr}]`).forEach(el => {
        const val = el.getAttribute(attr);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        } else if (el.tagName === 'A' || el.tagName === 'BUTTON') {
            el.textContent = val;
        } else {
            el.innerHTML = val;
        }
    })

    /* reset typewriter */
    charIdx = 0;
    deleting = false;
    roleIdx = 0;
    typedEl.textContent = '';
})

/* ACTIVE NAV LINK */
const sections = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    navAs.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
    });
});

/* CONTACT FORM (placeholder) */
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = lang === 'pt' ? 'Enviando...' : 'Sending...';
    btn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json'}
        });

        if (response.ok) {
            btn.textContent = lang === 'pt' ? 'Mensagem enviada!' : 'Message sent!';
            btn.style.background = '#0f7a5c'
            form.reset();
        } else {
            btn.textContent = lang === 'pt' ? 'Erro ao enviar. Tente novamente.' : 'Error. Try again.'
            btn.style.background = '#7f1d1d';
        }
    } catch {
        btn.textContent = lang === 'pt' ? 'Erro de conexão.' : 'Connection error.';
        btn.style.background = '#7f1d1d';
    }

    setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
    }, 3000);
})

/* SMOOTH SCROLL */
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;

        const start = window.scrollY;
        const end = target.getBoundingClientRect().top + window.scrollY;
        const distance = end - start;
        const duration = 800;
        let startTime = null;

        function ease(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            window.scrollTo(0, start + distance * ease(progress));
            if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    });
});

const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalBar = document.getElementById('projectModalBar');

document.querySelectorAll('.project-links a[aria-label="Demo"]').forEach(link => {
    link.addEventListener('click' , (e) => {
        e.preventDefault();
        const card = link.closest('.project-card');
        const title = card.querySelector('.project-title').textContent;
        projectModalTitle.textContent = title;
        projectModal.classList.add('open');
        setTimeout(() => {
            projectModalBar.style.width = '65%';
        }, 100);
    });
});

function closeProjectModal () {
    projectModal.classList.remove('open');
    setTimeout(() => {
        projectModalBar.style.width = '0%';
    }, 300);
}

projectModalClose.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
});
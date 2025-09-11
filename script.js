// ===== Preloader =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    const progressBar = document.querySelector('.loader-progress-bar');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 5 + 2; // smoother increment
        if (progress > 100) progress = 100;
        progressBar.style.width = progress + '%';

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => preloader.classList.add('hidden'), 500);
        }
    }, 100);
});

// ===== Custom Cursor =====
const cursor = document.querySelector('.cursor');
const cursorTrail = document.querySelector('.cursor-trail');
let mouseX = 0, mouseY = 0, trailX = 0, trailY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;

    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.style.opacity = '1';

    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

document.addEventListener('mousedown', () => cursor.classList.add('active'));
document.addEventListener('mouseup', () => cursor.classList.remove('active'));

document.querySelectorAll('h1, h2, h3, h4, p, a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
});

// ===== Theme Toggle =====
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// ===== Mobile Menu =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('show');
    document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : '';
});

mobileLinks.forEach(link => link.addEventListener('click', () => {
    mobileMenuBtn.classList.remove('active');
    mobileMenu.classList.remove('show');
    document.body.style.overflow = '';
}));

document.addEventListener('click', e => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('show');
        document.body.style.overflow = '';
    }
});

// ===== Scroll Animations =====
const scrollElements = document.querySelectorAll('.animate-on-scroll');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.2 });

scrollElements.forEach(el => observer.observe(el));

// Header scroll effect
const header = document.querySelector('header');
const scrollProgress = document.querySelector('.scroll-progress');
const scrollToTopBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header effect
    header.classList.toggle('scrolled', scrollY > 100);

    // Scroll progress
    scrollProgress.style.width = (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100 + '%';

    // Scroll to top
    scrollToTopBtn.classList.toggle('show', scrollY > 500);
});

scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Smooth navigation
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ===== Typing Animation =====
document.querySelectorAll('.typing').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            el.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    setTimeout(typeWriter, 1000);
});

// ===== Stats Counter =====
const stats = document.querySelectorAll('.stat-number');
const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent.replace('+',''));
        let current = 0;
        const increment = Math.ceil(target / 100);
        const update = () => {
            current += increment;
            if(current < target) {
                stat.textContent = current + (stat.textContent.includes('+') ? '+' : '');
                requestAnimationFrame(update);
            } else {
                stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
            }
        };
        update();
    });
};

const aboutSection = document.querySelector('#about');
if (aboutSection) {
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    });
    statsObserver.observe(aboutSection);
}

// ===== Project Links Loader =====
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const original = link.innerHTML;
        link.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        setTimeout(() => window.location.href = href, 1500);
    });
});

// ===== Parallax Floating Elements =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.floating-element').forEach((el, i) => {
        const speed = (i + 1) * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// ===== Skill Tags Hover =====
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => tag.style.transform = 'translateY(-2px) scale(1.05)');
    tag.addEventListener('mouseleave', () => tag.style.transform = 'translateY(0) scale(1)');
});

// ===== Social Icons Tooltip =====
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        const title = icon.getAttribute('title');
        if (!title) return;
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = title;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--bg-tertiary);
            color: var(--text-primary);
            padding: 0.5rem;
            border-radius: var(--radius);
            font-size: 0.75rem;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            z-index: 1000;
            box-shadow: var(--shadow);
        `;
        icon.style.position = 'relative';
        icon.appendChild(tooltip);
    });
    icon.addEventListener('mouseleave', () => {
        const tooltip = icon.querySelector('.tooltip');
        if(tooltip) tooltip.remove();
    });
});

// ===== Console Message =====
console.log('%c👋 Hello there!', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
console.log('%cWelcome to my portfolio! If you\'re interested in the code, check out the source or contact me.', 'color: #64748b; font-size: 14px;');
console.log('%c🚀 Built with HTML, CSS, and vanilla JavaScript', 'color: #10b981; font-size: 12px;');


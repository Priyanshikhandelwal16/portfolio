// =========================
// ENHANCED 3D PORTFOLIO ANIMATIONS
// =========================

// Initialize variables
let mouseX = 0, mouseY = 0;
let isLoaded = false;

// =========================
// PARTICLE SYSTEM
// =========================
class ParticleSystem {
  constructor() {
    this.particles = [];
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.setupCanvas();
    this.createParticles();
    this.animate();
  }

  setupCanvas() {
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '1';
    this.canvas.style.opacity = '0.6';
    document.body.appendChild(this.canvas);
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 200 // Blue-ish particles
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
      this.ctx.fill();
    });

    requestAnimationFrame(() => this.animate());
  }
}

// =========================
// 3D TILT EFFECTS
// =========================
class TiltEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      maxTilt: options.maxTilt || 15,
      perspective: options.perspective || 1000,
      scale: options.scale || 1.05,
      speed: options.speed || 300,
      glare: options.glare !== false,
      ...options
    };
    this.init();
  }

  init() {
    this.element.style.transformStyle = 'preserve-3d';
    this.element.style.transition = `all ${this.options.speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`;
    
    this.element.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
  }

  handleMouseEnter(e) {
    this.element.style.willChange = 'transform';
  }

  handleMouseMove(e) {
    const rect = this.element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * -this.options.maxTilt;
    const rotateY = (x - centerX) / centerX * this.options.maxTilt;
    
    this.element.style.transform = `
      perspective(${this.options.perspective}px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale3d(${this.options.scale}, ${this.options.scale}, ${this.options.scale})
    `;

    if (this.options.glare) {
      this.updateGlare(x, y, rect);
    }
  }

  handleMouseLeave() {
    this.element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    this.element.style.willChange = 'auto';
    this.removeGlare();
  }

  updateGlare(x, y, rect) {
    let glareElement = this.element.querySelector('.tilt-glare');
    if (!glareElement) {
      glareElement = document.createElement('div');
      glareElement.className = 'tilt-glare';
      glareElement.style.position = 'absolute';
      glareElement.style.top = '0';
      glareElement.style.left = '0';
      glareElement.style.width = '100%';
      glareElement.style.height = '100%';
      glareElement.style.borderRadius = 'inherit';
      glareElement.style.pointerEvents = 'none';
      glareElement.style.overflow = 'hidden';
      this.element.appendChild(glareElement);
    }

    const glarePos = (x / rect.width) * 100;
    const glareOpacity = Math.min(Math.max((x + y) / (rect.width + rect.height), 0), 1) * 0.3;
    
    glareElement.style.background = `linear-gradient(${90 + (x / rect.width) * 180}deg, rgba(255,255,255,0) 0%, rgba(255,255,255,${glareOpacity}) 50%, rgba(255,255,255,0) 100%)`;
  }

  removeGlare() {
    const glareElement = this.element.querySelector('.tilt-glare');
    if (glareElement) {
      glareElement.style.background = 'none';
    }
  }
}

// =========================
// MAGNETIC CURSOR EFFECT
// =========================
class MagneticCursor {
  constructor() {
    this.cursor = document.querySelector('.cursor');
    this.cursorOutline = document.querySelector('.cursor-outline');
    this.magneticElements = document.querySelectorAll('a, button, .project-card, .skill');
    this.init();
  }

  init() {
    if (!this.cursor || !this.cursorOutline) return;

    document.addEventListener('mousemove', this.updateCursor.bind(this));
    
    this.magneticElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.magneticEffect(el, true));
      el.addEventListener('mouseleave', () => this.magneticEffect(el, false));
      el.addEventListener('mousemove', (e) => this.updateMagneticPosition(e, el));
    });
  }

  updateCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (this.cursor) {
      this.cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
    
    if (this.cursorOutline) {
      this.cursorOutline.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }
  }

  magneticEffect(element, isEntering) {
    if (isEntering) {
      this.cursorOutline?.classList.add('hovered');
      element.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    } else {
      this.cursorOutline?.classList.remove('hovered');
      element.style.transform = 'translate(0px, 0px) scale(1)';
      element.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1)';
    }
  }

  updateMagneticPosition(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    const distance = Math.sqrt(x * x + y * y);
    const maxDistance = Math.max(rect.width, rect.height) / 2;
    
    if (distance < maxDistance) {
      const strength = (maxDistance - distance) / maxDistance;
      const moveX = x * strength * 0.3;
      const moveY = y * strength * 0.3;
      
      element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    }
  }
}

// =========================
// SCROLL ANIMATIONS
// =========================
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
    
    // Observe elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .project-card, .skill-category').forEach(el => {
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateElement(entry.target);
      }
    });
  }

  animateElement(element) {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0px) translateX(0px) scale(1)';
    element.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1)';
    
    // Add stagger effect for multiple elements
    const siblings = Array.from(element.parentNode.children);
    const index = siblings.indexOf(element);
    element.style.transitionDelay = `${index * 100}ms`;
  }
}

// =========================
// FLOATING ELEMENTS
// =========================
class FloatingElements {
  constructor() {
    this.elements = document.querySelectorAll('.floating-card, .skill-orb');
    this.init();
  }

  init() {
    this.elements.forEach((el, index) => {
      this.createFloatingAnimation(el, index);
    });
  }

  createFloatingAnimation(element, index) {
    const amplitude = 20 + Math.random() * 30;
    const frequency = 0.02 + Math.random() * 0.01;
    const phase = index * 0.5;
    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps
      
      const y = Math.sin(time * frequency + phase) * amplitude;
      const x = Math.cos(time * frequency * 0.7 + phase) * (amplitude * 0.5);
      const rotation = Math.sin(time * frequency * 0.5 + phase) * 5;
      
      element.style.transform = `translate(${x}px, ${y}px) rotateZ(${rotation}deg)`;
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }
}

// =========================
// TEXT ANIMATIONS
// =========================
class TextAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.animateHeroText();
    this.animateSkillBubbles();
  }

  animateHeroText() {
    const heroText = document.querySelector('#hero-para');
    if (!heroText) return;

    const words = heroText.textContent.split(' ');
    heroText.innerHTML = '';
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.transform = 'translateY(50px) rotateX(-90deg)';
      span.style.transition = `all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1) ${index * 100}ms`;
      
      if (word.includes('Priyanshi') || word.includes('Khandelwal')) {
        span.style.color = '#3b82f6';
        span.style.fontWeight = '700';
      }
      
      heroText.appendChild(span);
      
      // Trigger animation
      setTimeout(() => {
        span.style.opacity = '1';
        span.style.transform = 'translateY(0px) rotateX(0deg)';
      }, 500 + index * 100);
    });
  }

  animateSkillBubbles() {
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
      skill.style.opacity = '0';
      skill.style.transform = 'scale(0.3) rotateY(-180deg)';
      skill.style.transition = `all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) ${index * 50}ms`;
      
      setTimeout(() => {
        skill.style.opacity = '1';
        skill.style.transform = 'scale(1) rotateY(0deg)';
      }, 1000 + index * 50);
    });
  }
}

// =========================
// 3D CARD EFFECTS
// =========================
class CardEffects {
  constructor() {
    this.cards = document.querySelectorAll('.project-card, .skill-category, .info-box');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      new TiltEffect(card, {
        maxTilt: 10,
        perspective: 1000,
        scale: 1.03,
        speed: 400,
        glare: true
      });
      
      this.addHoverEffects(card);
    });
  }

  addHoverEffects(card) {
    let timeout;
    
    card.addEventListener('mouseenter', () => {
      clearTimeout(timeout);
      card.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.3)';
      card.style.zIndex = '10';
      
      // Add ripple effect
      this.createRipple(card);
    });
    
    card.addEventListener('mouseleave', () => {
      timeout = setTimeout(() => {
        card.style.boxShadow = '';
        card.style.zIndex = '';
      }, 300);
    });
  }

  createRipple(element) {
    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.width = '0px';
    ripple.style.height = '0px';
    ripple.style.background = 'rgba(59, 130, 246, 0.2)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'rippleExpand 0.6s ease-out';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // Add keyframes if not exists
    if (!document.querySelector('#rippleKeyframes')) {
      const style = document.createElement('style');
      style.id = 'rippleKeyframes';
      style.textContent = `
        @keyframes rippleExpand {
          to {
            width: 300px;
            height: 300px;
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    setTimeout(() => ripple.remove(), 600);
  }
}

// =========================
// THEME ENHANCEMENT
// =========================
class ThemeEnhancer {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.init();
  }

  init() {
    if (!this.themeToggle) return;
    
    this.themeToggle.addEventListener('click', () => {
      this.addTransitionEffects();
    });
  }

  addTransitionEffects() {
    // Create a smooth transition overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%)';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    overlay.style.transition = 'opacity 0.5s ease';
    
    document.body.appendChild(overlay);
    
    // Animate the overlay
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      setTimeout(() => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 500);
      }, 200);
    });
  }
}

// =========================
// PAGE LOADER ENHANCEMENT
// =========================
class PageLoader {
  constructor() {
    this.loader = document.getElementById('loader');
    this.main = document.getElementById('main');
    this.init();
  }

  init() {
    this.animateLoader();
  }

  animateLoader() {
    let progress = 0;
    const loaderText = document.querySelector('#loader p');
    const spinner = document.querySelector('.spinner');
    
    // Enhanced spinner animation
    if (spinner) {
      spinner.style.animation = 'spin 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite';
    }
    
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.hideLoader();
      }
      
      if (loaderText) {
        loaderText.textContent = Math.floor(progress) + '%';
        loaderText.style.transform = `scale(${1 + (progress / 100) * 0.2})`;
      }
    }, 100);
  }

  hideLoader() {
    setTimeout(() => {
      if (this.loader) {
        this.loader.style.transform = 'translateY(-100%) scale(0.8)';
        this.loader.style.opacity = '0';
        this.loader.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        
        setTimeout(() => {
          this.loader.style.display = 'none';
          if (this.main) {
            this.main.style.display = 'block';
            this.main.style.opacity = '0';
            this.main.style.transform = 'scale(0.95)';
            this.main.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1)';
            
            requestAnimationFrame(() => {
              this.main.style.opacity = '1';
              this.main.style.transform = 'scale(1)';
            });
          }
          isLoaded = true;
        }, 1000);
      }
    }, 500);
  }
}

// =========================
// PERFORMANCE OPTIMIZATION
// =========================
class PerformanceOptimizer {
  constructor() {
    this.rafId = null;
    this.observers = [];
    this.init();
  }

  init() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.reduceMotion();
    }
    
    // Optimize for mobile
    if (window.innerWidth <= 768) {
      this.optimizeForMobile();
    }
    
    // Intersection observer for performance
    this.setupVisibilityOptimization();
  }

  reduceMotion() {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    document.querySelectorAll('*').forEach(el => {
      el.style.animationDuration = '0.1s';
      el.style.transitionDuration = '0.1s';
    });
  }

  optimizeForMobile() {
    // Disable intensive animations on mobile
    document.querySelectorAll('.floating-card, .skill-orb').forEach(el => {
      el.style.animation = 'none';
    });
  }

  setupVisibilityOptimization() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const element = entry.target;
        if (entry.isIntersecting) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      });
    });

    document.querySelectorAll('.project-card, .skill-category').forEach(el => {
      observer.observe(el);
    });
  }
}

// =========================
// EMAIL JS (Keep original)
// =========================
if (typeof emailjs !== 'undefined') {
  emailjs.init("UvtZ1cmgVB3_QgPE9");
  
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const form = this;
      const responseMsg = document.getElementById("response-msg");

      emailjs.sendForm("priyanshikh16@gmail.com", "template_3o5i6w6", form).then(
        function () {
          if (responseMsg) {
            responseMsg.textContent = "Message sent successfully!";
            responseMsg.style.color = "green";
            responseMsg.style.opacity = '1';
            responseMsg.style.transform = 'translateY(0px)';
          }
          form.reset();
        },
        function (error) {
          if (responseMsg) {
            responseMsg.textContent = "Failed to send. Please try again.";
            responseMsg.style.color = "red";
            responseMsg.style.opacity = '1';
            responseMsg.style.transform = 'translateY(0px)';
          }
          console.error("EmailJS Error:", error);
        }
      );
    });
  }
}

// =========================
// THEME TOGGLE (Enhanced)
// =========================
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    
    if (isDark) {
      html.removeAttribute("data-theme");
      themeToggle.innerHTML = `<i class="ri-moon-line"></i>`;
    } else {
      html.setAttribute("data-theme", "dark");
      themeToggle.innerHTML = `<i class="ri-sun-line"></i>`;
    }
  });
}

// =========================
// NAVIGATION ENHANCEMENT
// =========================
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const navClose = document.getElementById("nav-close");

if (hamburger && navLinks && navClose) {
  hamburger.onclick = function () {
    navLinks.classList.add("open");
    navClose.classList.add("open");
  };
  
  navClose.onclick = function () {
    navLinks.classList.remove("open");
    navClose.classList.remove("open");
  };
  
  // Close menu on link click
  navLinks.querySelectorAll("a").forEach((link) => {
    link.onclick = () => {
      navLinks.classList.remove("open");
      navClose.classList.remove("open");
    };
  });
}

// =========================
// INITIALIZE EVERYTHING
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all classes
  new PageLoader();
  new ParticleSystem();
  new MagneticCursor();
  new ScrollAnimations();
  new FloatingElements();
  new TextAnimations();
  new CardEffects();
  new ThemeEnhancer();
  new PerformanceOptimizer();
  
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // Add viewport height fix for mobile
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  
  console.log('🚀 Enhanced 3D Portfolio Loaded Successfully!');
});

// =========================
// ADDITIONAL CSS INJECTION
// =========================
const additionalStyles = `
<style>
/* Enhanced 3D Animations */
.fade-in, .slide-in-left, .slide-in-right {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1);
}

.slide-in-left {
  transform: translateX(-30px);
}

.slide-in-right {
  transform: translateX(30px);
}

.project-card, .skill-category {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1);
}

.project-card.visible, .skill-category.visible {
  transform: translateY(0px) scale(1);
  opacity: 1;
}

/* Enhanced hover effects */
.project-card:hover {
  transform: translateY(-10px) rotateX(5deg) rotateY(2deg) scale(1.02);
}

.skill:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

/* Smooth transitions for theme changes */
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

/* Enhanced cursor styles */
.cursor {
  mix-blend-mode: difference;
  transition: all 0.1s ease;
}

.cursor-outline {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1);
}

.cursor-outline.hovered {
  width: 50px;
  height: 50px;
  border-width: 3px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .floating-card, .skill-orb {
    animation: none !important;
    transform: none !important;
  }
  
  .cursor, .cursor-outline {
    display: none !important;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
`;

// Inject additional styles
document.head.insertAdjacentHTML('beforeend', additionalStyles);

// =========================
// UNIQUE SECTION SCROLL ANIMATIONS
// =========================

class SectionScrollAnimator {
  constructor() {
    this.sections = Array.from(document.querySelectorAll('section'));
    this.animationClasses = [
      'animate-fade-up',
      'animate-flip',
      'animate-zoom-in',
      'animate-slide-diagonal',
      'animate-rotate-in'
    ];
    this.init();
    this.injectSectionAnimationsCSS();
  }

  init() {
    // Assign scroll-animate and a random animation class to each section
    this.sections.forEach((section, idx) => {
      section.classList.add('scroll-animate');
      // Cycle or randomize animation classes for uniqueness
      section.classList.add(this.animationClasses[idx % this.animationClasses.length]);
      section.style.opacity = '0';
      section.style.willChange = 'transform, opacity';
    });

    const observer = new IntersectionObserver(this.onIntersect.bind(this), {
      threshold: 0.2,
      rootMargin: '0px 0px -20px 0px'
    });

    this.sections.forEach((section) => observer.observe(section));
  }

  onIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }

  injectSectionAnimationsCSS() {
    if (document.getElementById('section-animations-css')) return;
    const style = document.createElement('style');
    style.id = 'section-animations-css';
    style.textContent = `
    section.scroll-animate {
      opacity: 0;
      transform: translateY(40px);
      transition: none;
    }
    section.scroll-animate.active {
      opacity: 1;
      transition: all 1.1s cubic-bezier(0.19,1,0.22,1);
    }
    /* Fade Up */
    section.animate-fade-up.active {
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
    /* Flip */
    section.animate-flip.active {
      transform: rotateY(0deg) scale(1);
      animation: flipSection 1.2s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    section.animate-flip {
      transform: rotateY(80deg) scale(0.94);
    }
    @keyframes flipSection {
      from { transform: rotateY(80deg) scale(0.94); opacity: 0.3;}
      to { transform: rotateY(0deg) scale(1); opacity: 1;}
    }
    /* Zoom In */
    section.animate-zoom-in.active {
      transform: scale(1);
      animation: zoomInSection 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    section.animate-zoom-in {
      transform: scale(0.7);
    }
    @keyframes zoomInSection {
      from { transform: scale(0.7); opacity: 0;}
      to { transform: scale(1); opacity: 1;}
    }
    /* Slide Diagonal */
    section.animate-slide-diagonal.active {
      transform: translate(0, 0);
      animation: diagonalSlideSection 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    section.animate-slide-diagonal {
      transform: translate(-60px, 60px) scale(0.95);
    }
    @keyframes diagonalSlideSection {
      from { transform: translate(-60px, 60px) scale(0.95); opacity: 0.3;}
      to { transform: translate(0,0) scale(1); opacity: 1;}
    }
    /* Rotate In */
    section.animate-rotate-in.active {
      transform: rotateZ(0deg) translateY(0px) scale(1);
      animation: rotateInSection 1.1s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    section.animate-rotate-in {
      transform: rotateZ(-15deg) translateY(40px) scale(0.98);
    }
    @keyframes rotateInSection {
      from { transform: rotateZ(-15deg) translateY(40px) scale(0.98); opacity: 0.3;}
      to { transform: rotateZ(0deg) translateY(0px) scale(1); opacity: 1;}
    }
    `;
    document.head.appendChild(style);
  }
}

// =========================
// INITIALIZE SECTION ANIMATIONS
// =========================
document.addEventListener('DOMContentLoaded', () => {
  new SectionScrollAnimator();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#main").style.display = "block";
});


document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector("#hero");
  if (hero) hero.classList.add("active");
});



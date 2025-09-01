// =========================
// OPTIMIZED PORTFOLIO ANIMATION SYSTEM
// =========================

// Global state
let isInitialized = false;
let isMobile = window.innerWidth <= 768;

// =========================
// UTILITY FUNCTIONS
// =========================
const Utils = {
  detectMobile() {
    return window.innerWidth <= 768 || 
           /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  selectElements(selector) {
    return Array.from(document.querySelectorAll(selector));
  },
  
  // Check if element exists
  elementExists(selector) {
    return document.querySelector(selector) !== null;
  }
};

// =========================
// CUSTOM CURSOR
// =========================
class CustomCursor {
  constructor() {
    this.cursor = document.querySelector('.cursor');
    this.cursorOutline = document.querySelector('.cursor-outline');
    this.init();
  }

  init() {
    if (!this.cursor || !this.cursorOutline || isMobile) {
      // Hide custom cursor on mobile or if elements don't exist
      if (this.cursor) this.cursor.style.display = 'none';
      if (this.cursorOutline) this.cursorOutline.style.display = 'none';
      return;
    }

    document.addEventListener('mousemove', (e) => {
      this.moveCursor(e);
    });

    this.setupHoverEffects();
  }

  moveCursor(e) {
    if (!this.cursor || !this.cursorOutline) return;
    
    this.cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    // Add a slight delay to the outline for a smooth trailing effect
    requestAnimationFrame(() => {
      this.cursorOutline.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    });
  }

  setupHoverEffects() {
    // Elements that should trigger cursor changes
    const hoverElements = [
      ...Utils.selectElements('a'),
      ...Utils.selectElements('button'),
      ...Utils.selectElements('.project-card'),
      ...Utils.selectElements('.hero-buttons a'),
      ...Utils.selectElements('.skill')
    ];

    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        if (this.cursorOutline) {
          this.cursorOutline.classList.add('hovered');
        }
      });

      el.addEventListener('mouseleave', () => {
        if (this.cursorOutline) {
          this.cursorOutline.classList.remove('hovered');
        }
      });
    });
  }
}

// =========================
// PAGE LOADER
// =========================
class PageLoader {
  constructor() {
    this.loader = document.getElementById('loader');
    this.main = document.getElementById('main');
    this.init();
  }

  init() {
    if (this.main) {
      gsap.set(this.main, { autoAlpha: 0 });
    }

    if (this.loader) {
      this.animateLoader();
    } else {
      this.showMainContent();
    }
  }

  animateLoader() {
    const loaderText = this.loader.querySelector('p');
    const spinner = this.loader.querySelector('.spinner');
    
    const counter = { value: 0 };
    
    gsap.to(counter, {
      value: 100,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        if (loaderText) {
          loaderText.textContent = Math.round(counter.value) + '%';
        }
      },
      onComplete: () => this.hideLoader()
    });

    if (spinner) {
      gsap.to(spinner, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1
      });
    }
  }

  hideLoader() {
    gsap.to(this.loader, {
      duration: 0.5,
      autoAlpha: 0,
      y: -50,
      ease: "power2.inOut",
      onComplete: () => {
        if (this.loader) this.loader.style.display = 'none';
        this.showMainContent();
      }
    });
  }

  showMainContent() {
    if (this.main) {
      gsap.to(this.main, {
        duration: 0.8,
        autoAlpha: 1,
        ease: "power2.out",
        onComplete: () => {
          // Initialize other animations
          AnimationController.initializeAll();
        }
      });
    } else {
      AnimationController.initializeAll();
    }
  }
}

// =========================
// HERO ANIMATIONS
// =========================
class HeroAnimations {
  constructor() {
    this.hero = document.querySelector('#hero');
    this.heroLeft = document.querySelector('#hero-left');
    this.heroRight = document.querySelector('#hero-right');
    this.heroText = document.querySelector('#hero-para');
    this.heroButtons = Utils.selectElements('.hero-buttons a');
    this.init();
  }

  init() {
    if (!this.hero) return;
    
    this.setInitialStates();
    this.createTimeline();
  }

  setInitialStates() {
    gsap.set(this.hero, { autoAlpha: 1 });
    
    if (this.heroLeft) {
      gsap.set(this.heroLeft, { x: -50, autoAlpha: 0 });
    }
    
    if (this.heroRight) {
      gsap.set(this.heroRight, { x: 50, autoAlpha: 0, scale: 0.9 });
    }
    
    if (this.heroButtons.length) {
      gsap.set(this.heroButtons, { y: 30, autoAlpha: 0 });
    }
    
    this.prepareTextAnimation();
  }

  prepareTextAnimation() {
    if (!this.heroText) return;
    
    const text = this.heroText.textContent;
    const words = text.split(' ');
    
    this.heroText.innerHTML = words.map(word => {
      const isHighlight = word.toLowerCase().includes('priyanshi') || 
                         word.toLowerCase().includes('khandelwal');
      return `<span class="word ${isHighlight ? 'highlight' : ''}">${word}</span>`;
    }).join(' ');
    
    const wordSpans = this.heroText.querySelectorAll('.word');
    gsap.set(wordSpans, { y: 60, autoAlpha: 0, rotationX: -90 });
  }

  createTimeline() {
    // Wait before starting hero animation
    const tl = gsap.timeline({ delay: 1.2 });

    // Hero left
    if (this.heroLeft) {
      tl.to(this.heroLeft, {
        duration: 1.2,
        x: 0,
        autoAlpha: 1,
        ease: "power2.out"
      }, 0);
    }

    // Text animation
    const wordSpans = this.heroText?.querySelectorAll('.word');
    if (wordSpans?.length) {
      tl.to(wordSpans, {
        duration: 0.8,
        y: 0,
        autoAlpha: 1,
        rotationX: 0,
        stagger: 0.12,
        ease: "back.out(1.7)"
      }, 0.5);
    }

    // Hero buttons
    if (this.heroButtons.length) {
      tl.to(this.heroButtons, {
        duration: 0.8,
        y: 0,
        autoAlpha: 1,
        stagger: 0.15,
        ease: "back.out(1.7)"
      }, 1.0);
    }

    // Hero right
    if (this.heroRight) {
      tl.to(this.heroRight, {
        duration: 1.2,
        x: 0,
        autoAlpha: 1,
        scale: 1,
        ease: "power2.out"
      }, 0.3);
    }
  }
}

// =========================
// ENHANCED PROJECT CARD ANIMATIONS (COLOR-SAFE)
// =========================
class ProjectCardAnimations {
  constructor() {
    this.projectCards = Utils.selectElements('.project-card');
    this.animatedCards = new Set();
    this.init();
  }

  init() {
    if (!this.projectCards.length) return;
    
    this.setupInitialStates();
    this.setupIndividualScrollTriggers();
    this.setupHoverEffects();
  }

  setupInitialStates() {
    // Set initial state for all project cards (NO COLOR CHANGES)
    this.projectCards.forEach(card => {
      gsap.set(card, {
        y: 80,
        autoAlpha: 0,
        scale: 0.9,
        transformOrigin: "center center"
      });
    });
  }

  setupIndividualScrollTriggers() {
    this.projectCards.forEach((card, index) => {
      // Create individual scroll trigger for each card
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        once: true,
        onEnter: () => {
          if (this.animatedCards.has(index)) return;
          
          // Delay each card by 200ms
          setTimeout(() => {
            this.animateCardIn(card, index);
          }, index * 200);
        }
      });
    });
  }

  animateCardIn(card, index) {
    if (this.animatedCards.has(index)) return;
    
    this.animatedCards.add(index);
    
    // Simple, smooth entrance animation (NO COLOR CHANGES)
    const tl = gsap.timeline();
    
    // Main card animation
    tl.to(card, {
      duration: 1,
      y: 0,
      autoAlpha: 1,
      scale: 1,
      ease: "power2.out"
    });

    // Animate card content elements if they exist
    const cardImage = card.querySelector('img');
    const cardTitle = card.querySelector('h3, .project-title');
    const cardDescription = card.querySelector('p, .project-description');
    const cardTags = card.querySelectorAll('.tech-tag, .tag');
    const cardLinks = card.querySelectorAll('a, .project-link');

    // Image animation (NO FILTERS)
    if (cardImage) {
      gsap.set(cardImage, { scale: 1.1, autoAlpha: 0 });
      tl.to(cardImage, {
        duration: 1,
        scale: 1,
        autoAlpha: 1,
        ease: "power2.out"
      }, 0.2);
    }

    // Title animation
    if (cardTitle) {
      gsap.set(cardTitle, { y: 20, autoAlpha: 0 });
      tl.to(cardTitle, {
        duration: 0.8,
        y: 0,
        autoAlpha: 1,
        ease: "power2.out"
      }, 0.4);
    }

    // Description animation
    if (cardDescription) {
      gsap.set(cardDescription, { y: 15, autoAlpha: 0 });
      tl.to(cardDescription, {
        duration: 0.8,
        y: 0,
        autoAlpha: 1,
        ease: "power2.out"
      }, 0.6);
    }

    // Tags animation
    if (cardTags.length) {
      gsap.set(cardTags, { scale: 0.8, autoAlpha: 0 });
      tl.to(cardTags, {
        duration: 0.6,
        scale: 1,
        autoAlpha: 1,
        stagger: 0.05,
        ease: "back.out(1.7)"
      }, 0.8);
    }

    // Links/buttons animation
    if (cardLinks.length) {
      gsap.set(cardLinks, { y: 15, autoAlpha: 0 });
      tl.to(cardLinks, {
        duration: 0.6,
        y: 0,
        autoAlpha: 1,
        stagger: 0.1,
        ease: "power2.out"
      }, 1.0);
    }
  }

  setupHoverEffects() {
    this.projectCards.forEach(card => {
      card.style.transition = 'none';
      
      if (!isMobile) {
        this.setupDesktopHover(card);
      } else {
        this.setupMobileTouch(card);
      }
    });
  }

  setupDesktopHover(card) {
    const image = card.querySelector('img');
    
    const hoverEnter = () => {
      gsap.killTweensOf([card, image]);
      
      const tl = gsap.timeline();
      
      tl.to(card, {
        duration: 0.4,
        y: -12,
        scale: 1.03,
        ease: "power2.out"
      });
      
      if (image) {
        tl.to(image, {
          duration: 0.5,
          scale: 1.08,
          ease: "power2.out"
        }, 0);
      }
    };

    const hoverLeave = () => {
      gsap.killTweensOf([card, image]);
      
      const tl = gsap.timeline();
      
      tl.to(card, {
        duration: 0.5,
        y: 0,
        scale: 1,
        ease: "power2.out"
      });
      
      if (image) {
        tl.to(image, {
          duration: 0.5,
          scale: 1,
          ease: "power2.out"
        }, 0);
      }
    };

    card.addEventListener('mouseenter', hoverEnter);
    card.addEventListener('mouseleave', hoverLeave);
  }

  setupMobileTouch(card) {
    const tapAnimation = () => {
      gsap.killTweensOf(card);
      
      gsap.to(card, {
        duration: 0.1,
        scale: 0.98,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(card, {
            duration: 0.3,
            y: -4,
            ease: "back.out(1.7)",
            onComplete: () => {
              gsap.to(card, {
                duration: 0.4,
                y: 0,
                ease: "power2.out"
              });
            }
          });
        }
      });
    };

    card.addEventListener('touchstart', tapAnimation);
  }
}

// =========================
// SCROLL ANIMATIONS FOR ALL SECTIONS
// =========================
class ScrollAnimations {
  constructor() {
    this.animatedSections = new Set();
    this.init();
  }

  init() {
    this.animateAboutSection();
    this.animateSkillsSection();
    this.animateContactSection();
    this.animateFooterSection();
  }

  createScrollTrigger(section, elements, animationConfig) {
    if (!section || this.animatedSections.has(section)) return;
    
    gsap.set(elements, animationConfig.initialState || {});
    
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (this.animatedSections.has(section)) return;
        
        gsap.to(elements, {
          ...animationConfig.animateTo,
          onComplete: () => {
            this.animatedSections.add(section);
          }
        });
      }
    });
  }

  animateAboutSection() {
    const aboutSection = document.querySelector('#About');
    if (!aboutSection) return;
    
    const aboutLeft = document.querySelector('#about-left');
    const aboutRight = document.querySelector('#about-right');
    
    if (aboutLeft && aboutRight) {
      this.createScrollTrigger(
        aboutSection,
        [aboutLeft, aboutRight],
        {
          initialState: { y: 60, autoAlpha: 0 },
          animateTo: {
            duration: 1.2,
            y: 0,
            autoAlpha: 1,
            stagger: 0.3,
            ease: "power2.out"
          }
        }
      );
    }
  }

  animateSkillsSection() {
    const skillsSection = document.querySelector('.skills-section, #skills');
    if (!skillsSection) return;
    
    const skillCategories = Utils.selectElements('.skill-category');
    const skills = Utils.selectElements('.skill, .tech-tag');
    
    if (skillCategories.length) {
      this.createScrollTrigger(
        skillsSection,
        skillCategories,
        {
          initialState: { y: 80, autoAlpha: 0 },
          animateTo: {
            duration: 1,
            y: 0,
            autoAlpha: 1,
            stagger: 0.2,
            ease: "power2.out"
          }
        }
      );
    }
    
    if (skills.length) {
      this.createScrollTrigger(
        skillsSection,
        skills,
        {
          initialState: { scale: 0.5, autoAlpha: 0 },
          animateTo: {
            duration: 0.6,
            scale: 1,
            autoAlpha: 1,
            stagger: 0.05,
            ease: "back.out(1.7)",
            delay: 0.3
          }
        }
      );
    }
  }

  animateContactSection() {
    const contactSection = document.querySelector('#Contact, #contact');
    if (!contactSection) return;
    
    const contactInfo = document.querySelector('.contact-info');
    const contactForm = document.querySelector('.contact-form');
    const infoBoxes = Utils.selectElements('.info-box');
    
    if (contactInfo && contactForm) {
      this.createScrollTrigger(
        contactSection,
        [contactInfo, contactForm],
        {
          initialState: { y: 60, autoAlpha: 0 },
          animateTo: {
            duration: 1,
            y: 0,
            autoAlpha: 1,
            stagger: 0.2,
            ease: "power2.out"
          }
        }
      );
    }
    
    if (infoBoxes.length) {
      this.createScrollTrigger(
        contactSection,
        infoBoxes,
        {
          initialState: { y: 40, autoAlpha: 0 },
          animateTo: {
            duration: 0.8,
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.3
          }
        }
      );
    }
  }

  animateFooterSection() {
    const footer = document.querySelector('.footer, footer');
    if (!footer) return;
    
    const footerElements = Utils.selectElements('.footer-about, .footer-links, .footer-socials');
    const socialIcons = Utils.selectElements('.social-icons a, .footer a');
    
    if (footerElements.length) {
      this.createScrollTrigger(
        footer,
        footerElements,
        {
          initialState: { y: 40, autoAlpha: 0 },
          animateTo: {
            duration: 0.8,
            y: 0,
            autoAlpha: 1,
            stagger: 0.1,
            ease: "power2.out"
          }
        }
      );
    }

    if (socialIcons.length) {
      this.createScrollTrigger(
        footer,
        socialIcons,
        {
          initialState: { scale: 0.3, autoAlpha: 0 },
          animateTo: {
            duration: 0.6,
            scale: 1,
            autoAlpha: 1,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 0.5
          }
        }
      );
    }
  }
}

// =========================
// NAVIGATION CONTROLLER
// =========================
class NavigationController {
  constructor() {
    this.hamburger = document.getElementById('hamburger');
    this.navLinks = document.getElementById('nav-links');
    this.navClose = document.getElementById('nav-close');
    this.init();
  }

  init() {
    if (!this.hamburger || !this.navLinks) return;

    if (isMobile) {
      gsap.set(this.navLinks, { y: -30, autoAlpha: 0, display: 'none' });
      
      this.hamburger.addEventListener('click', () => this.toggleNav());
      
      if (this.navClose) {
        this.navClose.addEventListener('click', () => this.closeNav());
      }

      // Close nav on link click
      const navLinkElements = this.navLinks.querySelectorAll('a');
      navLinkElements.forEach(link => {
        link.addEventListener('click', () => this.closeNav());
      });
    } else {
      gsap.set(this.navLinks, { display: 'flex', autoAlpha: 1, y: 0 });
    }
  }

  toggleNav() {
    if (this.navLinks.classList.contains('open')) {
      this.closeNav();
    } else {
      this.openNav();
    }
  }

  openNav() {
    if (this.navLinks.classList.contains('open')) return;

    this.navLinks.classList.add('open');
    gsap.set(this.navLinks, { display: 'flex' });

    gsap.to(this.navLinks, {
      duration: 0.4,
      y: 0,
      autoAlpha: 1,
      ease: "power2.out"
    });

    // Show cross icon
    if (this.navClose) {
      this.navClose.classList.add('show');
    }
  }

  closeNav() {
    if (!this.navLinks.classList.contains('open')) return;

    gsap.to(this.navLinks, {
      duration: 0.3,
      y: -30,
      autoAlpha: 0,
      ease: "power2.inOut",
      onComplete: () => {
        this.navLinks.classList.remove('open');
        gsap.set(this.navLinks, { display: 'none' });
      }
    });

    // Hide cross icon
    if (this.navClose) {
      this.navClose.classList.remove('show');
    }
  }
}

   

// =========================
// THEME TOGGLE
// =========================
class ThemeController {
  constructor() {
    this.themeToggle = document.getElementById('theme-toggle');
    this.init();
  }

  init() {
    if (!this.themeToggle) return;

    // Set initial icon based on current theme
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    this.themeToggle.innerHTML = isDark ? '<i class="ri-sun-line"></i>' : '<i class="ri-moon-line"></i>';

    this.themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        this.themeToggle.innerHTML = '<i class="ri-moon-line"></i>';
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        this.themeToggle.innerHTML = '<i class="ri-sun-line"></i>';
      }
      
      this.animateThemeTransition();
    });
  }

  animateThemeTransition() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    
    gsap.fromTo(overlay, 
      { autoAlpha: 0 },
      {
        duration: 0.4,
        autoAlpha: 1,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.to(overlay, {
            duration: 0.4,
            autoAlpha: 0,
            ease: "power2.inOut",
            onComplete: () => overlay.remove()
          });
        }
      }
    );
  }
}

// =========================
// EMAIL FUNCTIONALITY
// =========================
class EmailController {
  constructor() {
    this.init();
  }

  init() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm && typeof emailjs !== 'undefined') {
      emailjs.init("UvtZ1cmgVB3_QgPE9");
      contactForm.addEventListener('submit', this.handleSubmit.bind(this));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const responseMsg = document.getElementById('response-msg');

    gsap.to(form, {
      duration: 0.1,
      scale: 0.98,
      ease: "power2.out",
      yoyo: true,
      repeat: 1
    });

    // Replace with your actual EmailJS service ID and template ID
    const serviceId = "priyanshikh16@gmail.com";
    const templateId = "template_3o5i6w6";
    
    emailjs.sendForm(serviceId, templateId, form).then(
      () => {
        if (responseMsg) {
          responseMsg.textContent = "Message sent successfully!";
          responseMsg.style.color = "var(--accent-primary)";
          gsap.fromTo(responseMsg, 
            { autoAlpha: 0, y: 20 },
            { duration: 0.5, autoAlpha: 1, y: 0, ease: "power2.out" }
          );
        }
        form.reset();
      },
      (error) => {
        if (responseMsg) {
          responseMsg.textContent = "Failed to send. Please try again.";
          responseMsg.style.color = "var(--accent-secondary)";
          gsap.fromTo(responseMsg, 
            { autoAlpha: 0, y: 20 },
            { duration: 0.5, autoAlpha: 1, y: 0, ease: "power2.out" }
          );
        }
        console.error("EmailJS Error:", error);
      }
    );
  }
}

// =========================
// MAIN ANIMATION CONTROLLER
// =========================
class AnimationController {
  static initializeAll() {
    if (isInitialized) return;
    
    try {
      // Update mobile detection
      isMobile = Utils.detectMobile();
      
      // Set GSAP defaults
      gsap.defaults({
        ease: "power2.out",
        duration: 0.8
      });
      
      // Accessibility: reduce motion if preferred
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0.3);
      }
      
      // Initialize all animation classes
      new CustomCursor();
      new HeroAnimations();
      new ScrollAnimations();
      new ProjectCardAnimations(); // Clean project animations
      new NavigationController();
      new ThemeController();
      new EmailController();
      
      // Handle resize events
      const debouncedResize = Utils.debounce(() => {
        const newIsMobile = Utils.detectMobile();
        if (newIsMobile !== isMobile) {
          location.reload();
        }
        ScrollTrigger.refresh();
      }, 300);
      
      window.addEventListener('resize', debouncedResize);
      
      // Smooth scrolling for navigation
      const navLinks = document.querySelectorAll('a[href^="#"]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const targetId = link.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });
      
      // Mobile viewport height fix
      const setVH = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      setVH();
      window.addEventListener('resize', setVH);
      
      isInitialized = true;
      console.log('✅ Portfolio animations initialized successfully!');
      
    } catch (error) {
      console.error('❌ Animation initialization error:', error);
      // Fallback: ensure basic functionality works
      isInitialized = true;
    }
  }
}

// =========================
// INITIALIZE APPLICATION
// =========================
document.addEventListener('DOMContentLoaded', () => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  const checkGSAP = () => {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // Initialize with or without loader
      const loader = document.getElementById('loader');
      if (loader) {
        new PageLoader();
      } else {
        AnimationController.initializeAll();
      }
    } else {
      setTimeout(checkGSAP, 100);
    }
  };
  
  checkGSAP();
});

// Fallback initialization
// Fallback initialization
window.addEventListener('load', () => {
  setTimeout(() => {
    if (!isInitialized) {
      // If GSAP is not available, still initialize basic functionality
      if (typeof gsap === 'undefined') {
        console.warn('⚠️ GSAP not loaded, initializing basic functionality only');
        
        // Basic features without animations
        new CustomCursor();
        new NavigationController();
        new ThemeController();
        new EmailController();
      } else {
        // If GSAP exists but init didn't fire, force init
        AnimationController.initializeAll();
      }
    }
  }, 1500);
});

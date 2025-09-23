// 🚀 Optimized Portfolio JavaScript - Ultra Smooth & Fast

// ===== Setup =====
let animationState = new Map(); 
const isMobile = window.innerWidth <= 768;
gsap.registerPlugin(ScrollTrigger);

// ===== Hide Elements to Prevent FOUC =====
gsap.set([
  "header", ".hero-text", ".hero-img", ".hero-buttons a", ".social-icons a",
  "#about .section-title", "#about .about-image", "#about .stat",
  "#about .about-text p", "#about .about-text h3",
  "#skills .section-title", "#skills .skill-category", "#skills .skill-tag",
  "#projects .section-title", "#projects .project-card",
  "#contact .section-title", "#contact .contact-info", "#contact .contact-form", "#contact .form-group",
  "footer .footer-info", "footer .footer-links", "footer .footer-social a", "footer .footer-bottom"
], { opacity: 0 });

// ===== Preloader =====
window.addEventListener("load", () => {
  const preloader = document.querySelector(".preloader");
  const progressBar = document.querySelector(".loader-progress-bar");
  const loaderDots = document.querySelectorAll(".loader-dot");
  let progress = 0;

  // Loader dots rotation
  gsap.to(loaderDots, { rotationY: 360, duration: 2, repeat: -1, stagger: 0.2, ease: "power2.inOut" });

  function updateProgress() {
    progress += Math.random() * 6 + 4;
    if (progress > 100) progress = 100;

    progressBar.style.width = progress + "%";
    progressBar.style.boxShadow = `0 0 ${progress / 5}px var(--primary)`;

    if (progress < 100) {
      requestAnimationFrame(updateProgress);
    } else {
      gsap.to(preloader, {
        opacity: 0, scale: 0.9, duration: 0.7, ease: "power3.inOut",
        onComplete: () => {
          preloader.style.display = "none";
          initMainAnimations();
          initSectionAnimations();
          initProjectHoverEffects();
          initSkillTagEffects();
        }
      });
    }
  }
  requestAnimationFrame(updateProgress);
});

// ===== Main Animations =====
function initMainAnimations() {
  if (animationState.get("mainInit")) return;
  animationState.set("mainInit", true);

  const tl = gsap.timeline();
  tl.to("header", { y: 0, opacity: 1, duration: 1, ease: "power2.out" })
    .to(".hero-text", { x: 0, opacity: 1, duration: 1.5, ease: "power1.out" }, "-=0.8")
    .to(".hero-img", { scale: 1, opacity: 1, duration: 1.8, ease: "power1.out" }, "-=1.2")
    .to(".hero-buttons a", { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power1.out" }, "-=0.6")
    .to(".social-icons a", { scale: 1, opacity: 1, duration: 0.8, stagger: 0.08, ease: "back.out(1.2)" }, "-=0.5");
}

// ===== Custom Cursor =====
(function() {
  const cursor = document.querySelector(".cursor");
  const cursorTrail = document.querySelector(".cursor-trail");
  if (!cursor || isMobile) return;

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0, trailX = 0, trailY = 0;

  document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    trailX += (mouseX - trailX) * 0.08;
    trailY += (mouseY - trailY) * 0.08;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    if (cursorTrail) cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) scale(0.8)`;

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll("a, button, .project-card, .skill-tag").forEach(el => {
    el.addEventListener("mouseenter", () => {
      gsap.to(cursor, { scale: 1.5, backgroundColor: "rgba(139, 92, 246, 0.8)", duration: 0.2 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(cursor, { scale: 1, backgroundColor: "rgba(139, 92, 246, 0.5)", duration: 0.2 });
    });
  });
})();

// ===== Section Animations =====
function sectionAnimate(selector, animations, stateKey) {
  ScrollTrigger.create({
    trigger: selector,
    start: "top 80%",
    once: true,
    onEnter: () => {
      if (animationState.get(stateKey)) return;
      animationState.set(stateKey, true);
      animations();
    }
  });
}

function initSectionAnimations() {
  sectionAnimate("#about", () => {
    gsap.to("#about .section-title", { y: 0, opacity: 1, duration: 1 });
    gsap.to("#about .about-text p, #about .about-text h3", { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, delay: 0.3 });
    gsap.to("#about .about-image", { scale: 1, opacity: 1, duration: 1.2, delay: 0.4 });
    gsap.to("#about .stat", { y: 0, opacity: 1, duration: 0.7, stagger: 0.15, delay: 0.6 });
  }, "about");

  sectionAnimate("#skills", () => {
    gsap.to("#skills .section-title", { y: 0, opacity: 1, duration: 1 });
    gsap.to("#skills .skill-category", { y: 0, opacity: 1, rotationX: 0, duration: 1, stagger: 0.15, delay: 0.3 });
    gsap.to("#skills .skill-tag", { scale: 1, opacity: 1, duration: 0.5, stagger: 0.04, delay: 0.6, ease: "back.out(1.4)" });
  }, "skills");

  sectionAnimate("#projects", () => {
    gsap.to("#projects .section-title", { y: 0, opacity: 1, duration: 1 });
    gsap.to("#projects .project-card", { y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.3, stagger: 0.15 });
  }, "projects");

  sectionAnimate("#contact", () => {
    gsap.to("#contact .section-title", { y: 0, opacity: 1, duration: 1 });
    gsap.to("#contact .contact-info", { x: 0, opacity: 1, duration: 1, delay: 0.2 });
    gsap.to("#contact .contact-form", { x: 0, opacity: 1, duration: 1, delay: 0.4 });
    gsap.to("#contact .form-group", { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.6 });
  }, "contact");

  sectionAnimate("footer", () => {
    gsap.to("footer .footer-info, footer .footer-links, footer .footer-social a, footer .footer-bottom", {
      y: 0, opacity: 1, stagger: 0.15, duration: 1
    });
  }, "footer");
}

// ===== Hover Effects (3D Optimized) =====
function initProjectHoverEffects() {
  document.querySelectorAll(".project-card").forEach(card => {
    if (isMobile) return;
    gsap.set(card, { transformPerspective: 800 });
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { rotationY: 5, rotationX: 5, scale: 1.03, boxShadow: "0 20px 40px rgba(139,92,246,0.3)", duration: 0.3 });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, boxShadow: "0 5px 15px rgba(0,0,0,0.1)", duration: 0.3 });
    });
  });
}

function initSkillTagEffects() {
  document.querySelectorAll(".skill-tag").forEach(tag => {
    if (isMobile) return;
    tag.addEventListener("mouseenter", () => gsap.to(tag, { scale: 1.1, rotationZ: Math.random() * 6 - 3, duration: 0.3 }));
    tag.addEventListener("mouseleave", () => gsap.to(tag, { scale: 1, rotationZ: 0, duration: 0.3 }));
  });
}

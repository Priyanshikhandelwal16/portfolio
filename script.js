// =========================
// EMAIL JS
// =========================
emailjs.init('UvtZ1cmgVB3_QgPE9');
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = this;
  const responseMsg = document.getElementById('response-msg');

  emailjs.sendForm('priyanshikh16@gmail.com', 'template_3o5i6w6', form)
    .then(function () {
      responseMsg.textContent = 'Message sent successfully!';
      responseMsg.style.color = 'green';
      responseMsg.style.opacity = 0;
      gsap.to(responseMsg, {opacity: 1, duration: 0.8});
      form.reset();
    }, function (error) {
      responseMsg.textContent = 'Failed to send. Please try again.';
      responseMsg.style.color = 'red';
      responseMsg.style.opacity = 0;
      gsap.to(responseMsg, {opacity: 1, duration: 0.8});
      console.error('EmailJS Error:', error);
    });
});

// =========================
// THEME TOGGLE
// =========================
const toggleBtn = document.getElementById("theme-toggle");
const html = document.documentElement;

toggleBtn.addEventListener("click", () => {
  if (html.getAttribute("data-theme") === "dark") {
    html.removeAttribute("data-theme");
    toggleBtn.innerHTML = `<i class="ri-moon-line"></i>`;
  } else {
    html.setAttribute("data-theme", "dark");
    toggleBtn.innerHTML = `<i class="ri-sun-line"></i>`;
  }
  applyHeroColors();
});

// =========================
// HERO TEXT SPLIT + COLOR
// =========================
let heroParagraph = document.querySelector("#hero-para");
let text = heroParagraph.innerText.split(" ");
heroParagraph.innerHTML = "";

text.forEach(word => {
  let span = document.createElement("span");
  span.textContent = word + "\u00A0";
  span.dataset.type = (word === "Priyanshi" || word === "Khandelwal") ? "name" : "normal";
  span.style.opacity = 0;
  span.style.display = "inline-block";
  heroParagraph.appendChild(span);
});

function applyHeroColors() {
  const isDark = html.getAttribute("data-theme") === "dark";
  document.querySelectorAll("#hero-para span").forEach(span => {
    if (span.dataset.type === "name") {
      span.style.color = "#3B82F6";
    } else {
      span.style.color = isDark ? "#ffffff" : "#111827";
    }
  });
}
applyHeroColors();

// =========================
// 3D TILT EFFECT
// =========================
function tiltEffect(elements) {
  elements.forEach(el => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * 20;
      const rotateY = ((x / rect.width) - 0.5) * 20;
      el.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "rotateX(0) rotateY(0) scale(1)";
    });
  });
}
tiltEffect(document.querySelectorAll(".project-card, #hero-right img, #about-left img"));

// =========================
// FULL PAGE TIMELINE
// =========================
let tl = gsap.timeline();

// Loader counter
let counter = { value: 0 };
tl.to(counter, {
  value: 100,
  duration: 2.5,
  ease: "power1.inOut",
  onUpdate: () => {
    document.querySelector("#loader p").innerText = Math.floor(counter.value) + "%";
  }
});

// Loader slide up
tl.to("#loader", {
  y: "-100%",
  duration: 1,
  ease: "power2.inOut",
  onComplete: () => {
    document.querySelector("#main").style.display = "block";
  }
});

// Hero Animation
tl.from("#hero-left", {opacity:0, x:-50, duration:1, ease:"power3.out"});
tl.fromTo("#hero-para span", 
  {opacity:0, y:20}, 
  {opacity:1, y:0, duration:0.5, stagger:0.15, ease:"power3.out"}
);
tl.from("#hero-right img", {opacity:0, x:50, duration:1, ease:"power3.out"});

// About Section
tl.from("#about-left img", {opacity:0, x:-50, rotateY:-15, duration:1, ease:"power3.out"});
tl.from("#about-right h2, #about-right p", {opacity:0, x:50, stagger:0.2, duration:1, ease:"power3.out"});

// Skills Section
document.querySelectorAll(".progress-bar span").forEach(span => span.style.width = "0%"); // start from 0
tl.to(".progress-bar span", {width:"var(--width)", duration:1.2, stagger:0.2, ease:"power3.out"});

// Projects Section
tl.from(".project-card", {opacity:0, y:50, scale:0.9, rotateX:5, rotateY:5, stagger:0.2, duration:1, ease:"power3.out"});

// Contact Section
tl.from(".contact-info, .contact-form", {opacity:0, y:50, stagger:0.2, duration:1, ease:"power3.out"});

// Footer Section
tl.from(".footer-about, .footer-links, .footer-socials", {
  opacity: 0,
  y: 50,
  rotateX: 5,
  rotateY: 5,
  stagger: 0.2,
  duration: 1,
  ease: "power3.out"
});
tl.from(".footer-bottom", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power3.out"
});

document.querySelectorAll('.skill').forEach(skill => {
  const level = skill.getAttribute('data-level'); 
  skill.style.setProperty('--level', level);
});

// ===== Custom Cursor =====
const cursor = document.querySelector(".cursor");
const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0, mouseY = 0;
let outlineX = 0, outlineY = 0;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
});

// Smooth delay for outline
function animateCursor() {
  outlineX += (mouseX - outlineX) * 0.15;
  outlineY += (mouseY - outlineY) * 0.15;
  cursorOutline.style.transform = `translate(${outlineX}px, ${outlineY}px)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects
document.querySelectorAll("a, button, .project-card, .hero-buttons a").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursorOutline.classList.add("hovered");
  });
  el.addEventListener("mouseleave", () => {
    cursorOutline.classList.remove("hovered");
  });
});

// Hamburger menu toggle for nav-bar with cross icon
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");
const navClose = document.getElementById("nav-close");

// Open mobile nav
hamburger.onclick = function () {
  navLinks.classList.add("open");
  navClose.classList.add("open");
};

// Close mobile nav by cross icon
navClose.onclick = function () {
  navLinks.classList.remove("open");
  navClose.classList.remove("open");
};

// Optional: close menu on link click (mobile UX)
navLinks.querySelectorAll("a").forEach(link => {
  link.onclick = () => {
    navLinks.classList.remove("open");
    navClose.classList.remove("open");
  };
});

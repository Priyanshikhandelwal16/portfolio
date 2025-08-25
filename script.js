// =========================
// EMAIL JS
// =========================
emailjs.init("UvtZ1cmgVB3_QgPE9");
document
  .getElementById("contact-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const form = this;
    const responseMsg = document.getElementById("response-msg");

    emailjs.sendForm("priyanshikh16@gmail.com", "template_3o5i6w6", form).then(
      function () {
        responseMsg.textContent = "Message sent successfully!";
        responseMsg.style.color = "green";
        responseMsg.style.opacity = 0;
        gsap.to(responseMsg, { opacity: 1, duration: 0.8 });
        form.reset();
      },
      function (error) {
        responseMsg.textContent = "Failed to send. Please try again.";
        responseMsg.style.color = "red";
        responseMsg.style.opacity = 0;
        gsap.to(responseMsg, { opacity: 1, duration: 0.8 });
        console.error("EmailJS Error:", error);
      }
    );
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

text.forEach((word) => {
  let span = document.createElement("span");
  span.textContent = word + "\u00A0";
  span.dataset.type =
    word === "Priyanshi" || word === "Khandelwal" ? "name" : "normal";
  span.style.opacity = 0;
  span.style.display = "inline-block";
  heroParagraph.appendChild(span);
});

function applyHeroColors() {
  const isDark = html.getAttribute("data-theme") === "dark";
  document.querySelectorAll("#hero-para span").forEach((span) => {
    if (span.dataset.type === "name") {
      span.style.color = "#3B82F6";
    } else {
      span.style.color = isDark ? "#ffffff" : "#111827";
    }
  });
}
applyHeroColors();

// =========================
// GSAP SAFE REGISTRATION + FALLBACK
// =========================
try {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }
} catch (e) {
  console.warn("ScrollTrigger registration failed:", e);
}

// Replace hero split animation with fade-in/out
function fadeHeroText() {
  try {
    const spans = document.querySelectorAll("#hero-para span");
    gsap.set(spans, { opacity: 0 });
    gsap.to(spans, {
      opacity: 1,
      duration: 0.6,
      stagger: 0.06,
      ease: "power2.out",
    });
  } catch (e) {
    // no-op if gsap missing
  }
}
fadeHeroText();

// Guard 3D tilt on non-touch only
function isTouchDevice() {
  return window.matchMedia("(hover: none)").matches || "ontouchstart" in window;
}

if (!isTouchDevice()) {
  if (typeof tiltEffect === "function") {
    tiltEffect(document.querySelectorAll(".project-card, #hero-right img"));
  }
} else {
  // Remove any transforms on touch devices
  document
    .querySelectorAll(".project-card, #hero-right img, #about-left img")
    .forEach((el) => {
      el.style.transform = "none";
    });
}

// Scroll animations for sections (guarded)
try {
  ["#hero", "#About", "#skills", "#projects", "#Contact", ".footer"].forEach(
    (sel) => {
      if (window.ScrollTrigger) {
        gsap.from(sel, {
          scrollTrigger: { trigger: sel, start: "top 80%" },
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "power2.out",
        });
      }
    }
  );
} catch (e) {
  console.warn("Scroll animations disabled:", e);
}

// =========================
// FULL PAGE TIMELINE
// =========================
let tl = gsap.timeline();

// Loader counter
let counter = { value: 0 };
tl.to(counter, {
  value: 100,
  duration: 2.0,
  ease: "power1.inOut",
  onUpdate: () => {
    document.querySelector("#loader p").innerText =
      Math.floor(counter.value) + "%";
  },
});

// Loader slide up
// Ensure main shows even if animation errors
function showMain() {
  const loader = document.getElementById("loader");
  const main = document.getElementById("main");
  if (loader) loader.style.display = "none";
  if (main) main.style.display = "block";
}

tl.to("#loader", {
  y: "-100%",
  duration: 1,
  ease: "power2.inOut",
  onComplete: () => {
    document.querySelector("#main").style.display = "block";
  },
});

// Fallback: if something blocks GSAP, force-hide loader after 4s
setTimeout(() => {
  const mainVisible =
    document.getElementById("main")?.style.display === "block";
  if (!mainVisible) {
    console.warn("Loader fallback activated");
    showMain();
  }
}, 4000);

// =========================
// Remaining timeline sections
// =========================
// About Section
try {
  tl.from("#about-left img", {
    opacity: 0,
    x: -50,
    rotateY: -15,
    duration: 1,
    ease: "power3.out",
  });
  tl.from("#about-right h2, #about-right p", {
    opacity: 0,
    x: 50,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  });
} catch (e) {}

// Projects Section
try {
  tl.from(".project-card", {
    opacity: 0,
    y: 50,
    scale: 0.9,
    rotateX: 5,
    rotateY: 5,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  });
} catch (e) {}

// Contact Section
try {
  tl.from(".contact-info, .contact-form", {
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  });
} catch (e) {}

// Footer Section
try {
  tl.from(".footer-about, .footer-links, .footer-socials", {
    opacity: 0,
    y: 50,
    rotateX: 5,
    rotateY: 5,
    stagger: 0.2,
    duration: 1,
    ease: "power3.out",
  });
  tl.from(".footer-bottom", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out",
  });
} catch (e) {}

// ===== Custom Cursor =====
const cursor = document.querySelector(".cursor");
const cursorOutline = document.querySelector(".cursor-outline");

let mouseX = 0,
  mouseY = 0;
let outlineX = 0,
  outlineY = 0;

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
document
  .querySelectorAll("a, button, .project-card, .hero-buttons a")
  .forEach((el) => {
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

hamburger.onclick = function () {
  navLinks.classList.add("open");
  navClose.classList.add("open");
};
navClose.onclick = function () {
  navLinks.classList.remove("open");
  navClose.classList.remove("open");
};

// Optional: close menu on link click (mobile UX)
navLinks.querySelectorAll("a").forEach((link) => {
  link.onclick = () => {
    navLinks.classList.remove("open");
    navClose.classList.remove("open");
  };
});

// Project popup modal
const modal = document.getElementById("project-modal");
const modalClose = document.querySelector(".project-modal-close");
const modalTitle = document.getElementById("project-modal-title");
const modalGif = document.getElementById("project-modal-gif");
const modalDesc = document.getElementById("project-modal-desc");

function openProjectModal(card) {
  const title = card.querySelector("h3")?.textContent || "Project";
  const desc = card.querySelector(".card-content p")?.textContent || "";
  const img = card.querySelector("img")?.getAttribute("src") || "";
  modalTitle.textContent = title;
  modalDesc.textContent = desc;
  const gifCandidate = img.replace(/\.[a-zA-Z0-9]+$/, ".gif");
  modalGif.src = gifCandidate || img;
  modal.classList.add("open");
}
function closeProjectModal() {
  modal.classList.remove("open");
}
modalClose.addEventListener("click", closeProjectModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeProjectModal();
});

const projectCards = document.querySelectorAll(".project-card");
projectCards.forEach((card) => {
  if (!isTouchDevice()) {
    let hoverTimeout;
    card.addEventListener("mouseenter", () => {
      hoverTimeout = setTimeout(() => openProjectModal(card), 120);
    });
    card.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimeout);
    });
  }
  card.addEventListener("click", () => openProjectModal(card));
});

// Constrain project grid on very small screens to avoid overflow
window.addEventListener("resize", () => {
  document
    .querySelectorAll(".project-card")
    .forEach((c) => (c.style.maxWidth = "520px"));
});

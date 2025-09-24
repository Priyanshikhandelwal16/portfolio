       function setHeaderOffset() {
                const h = document.querySelector('header')?.offsetHeight || 0;
                document.documentElement.style.setProperty('--header-h', h + 'px');
            }

      // Custom Cursor
      const cursor = document.querySelector(".cursor");
      const cursorTrail = document.querySelector(".cursor-trail");

      document.addEventListener(
        "mousemove",
        (e) => {
          if (!cursor || !cursorTrail) return;
          cursor.style.left = e.clientX + "px";
          cursor.style.top = e.clientY + "px";
          setTimeout(() => {
            cursorTrail.style.left = e.clientX + "px";
            cursorTrail.style.top = e.clientY + "px";
          }, 100);
        },
        { passive: true }
      );

      // Particle System
      function createParticles() {
        const particlesContainer = document.getElementById("particles");
        if (!particlesContainer) return;
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.className = "particle";
          particle.style.left = Math.random() * 100 + "%";
          particle.style.top = Math.random() * 100 + "%";
          particle.style.animation = `float${
            Math.floor(Math.random() * 3) + 1
          } ${Math.random() * 10 + 10}s infinite linear`;
          particle.style.animationDelay = Math.random() * 10 + "s";
          particlesContainer.appendChild(particle);
        }
      }

      // Intersection Observer for Scroll Animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      };
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      }, observerOptions);

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          const href = this.getAttribute("href");
          if (!href) return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      });

      // Form submission
      document
        .getElementById("contact-form")
        ?.addEventListener("submit", function (e) {
          e.preventDefault();
          const formData = new FormData(this);
          const name = formData.get("name");
          const email = formData.get("email");
          const subject = formData.get("subject");
          const message = formData.get("message");
          if (name && email && subject && message) {
            alert("Thank you for your message! I will get back to you soon.");
            this.reset();
          } else {
            alert("Please fill in all fields.");
          }
        });

      // Hover effects to project cards
      document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-15px) scale(1.02)";
        });
        card.addEventListener("mouseleave", function () {
          this.style.transform = "translateY(0) scale(1)";
        });
      });

      // Ripple effect on buttons
      document.querySelectorAll(".btn").forEach((btn) => {
        btn.addEventListener("click", function (e) {
          const ripple = document.createElement("span");
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x =
            (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
          const y =
            (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;
          ripple.style.width = ripple.style.height = size + "px";
          ripple.style.left = x + "px";
          ripple.style.top = y + "px";
          ripple.classList.add("ripple");
          this.appendChild(ripple);
          setTimeout(() => ripple.remove(), 600);
        });
      });

      // Add ripple effect styles dynamically
      const style = document.createElement("style");
      style.textContent = `
      .btn { position: relative; overflow: hidden; }
      .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.6); transform: scale(0); animation: ripple 0.6s linear; pointer-events: none; }
      @keyframes ripple { to { transform: scale(4); opacity: 0; } }
    `;
      document.head.appendChild(style);

      // Parallax effect for hero shapes
      window.addEventListener(
        "scroll",
        () => {
          const scrollY = window.scrollY || window.pageYOffset;
          const morphingShapes = document.querySelectorAll(".morphing-shape");
          morphingShapes.forEach((shape, index) => {
            const speed = 0.15 + index * 0.08;
            shape.style.translate = `0 ${scrollY * speed}px`;
          });
        },
        { passive: true }
      );

      function applyTheme(t) {
        document.documentElement.dataset.theme = t;
        localStorage.setItem("theme", t);
        const icon = document.querySelector(".theme-toggle i");
        if (icon) {
          if (t === "light") {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
          } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
          }
        }
      }
      function initTheme() {
        const saved = localStorage.getItem("theme");
        const preferLight =
          window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: light)").matches;
        applyTheme(saved || (preferLight ? "light" : "dark"));
      }
      document.querySelector(".theme-toggle")?.addEventListener("click", () => {
        const current =
          document.documentElement.dataset.theme === "light" ? "light" : "dark";
        applyTheme(current === "light" ? "dark" : "light");
      });

      window.addEventListener("load", () => {
        setHeaderOffset();
        const loader = document.getElementById("loader");
        createParticles();
        const heroSection = document.querySelector(".hero");
        if (heroSection) {
          heroSection.style.opacity = "1";
          heroSection.style.transform = "translateY(0)";
        }
        setTimeout(() => loader?.classList.add("hidden"), 300);
      });

      // Observe sections on DOM ready (except hero)
      document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        setHeaderOffset();

        const sections = document.querySelectorAll("section");
        sections.forEach((section) => {
          section.style.opacity = "0";
          section.style.transform = "translateY(50px)";
          section.style.transition = "all 0.8s ease";
          if (!section.classList.contains("hero")) observer.observe(section);
        });
      });

      // Update header offset on resize
      window.addEventListener("resize", setHeaderOffset);

      // Hamburger menu functionality

      function setupHamburger() {
        const btn = document.getElementById("hamburger");
        const panel = document.getElementById("mobile-menu");
        const closeBtn = panel?.querySelector(".menu-close");

        if (!btn || !panel) {
          console.error("Hamburger menu elements not found");
          return;
        }

        const closeMenu = () => {
          btn.setAttribute("aria-expanded", "false");
          panel.setAttribute("aria-hidden", "true");
          btn.classList.remove("active");
          document.body.classList.remove("menu-open");
        };

        const openMenu = () => {
          btn.setAttribute("aria-expanded", "true");
          panel.setAttribute("aria-hidden", "false");
          btn.classList.add("active");
          document.body.classList.add("menu-open");
        };

        // Toggle menu on hamburger click
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isExpanded = btn.getAttribute("aria-expanded") === "true";
          isExpanded ? closeMenu() : openMenu();
        });

        // Close menu on close button click
        closeBtn?.addEventListener("click", closeMenu);

        // Close menu when clicking on a navigation link
        panel.querySelectorAll("[data-close-menu]").forEach((link) => {
          link.addEventListener("click", closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
          if (
            !panel.contains(e.target) &&
            !btn.contains(e.target) &&
            panel.getAttribute("aria-hidden") === "false"
          ) {
            closeMenu();
          }
        });

        // Close menu on escape key
        document.addEventListener("keydown", (e) => {
          if (
            e.key === "Escape" &&
            panel.getAttribute("aria-hidden") === "false"
          ) {
            closeMenu();
          }
        });

        // Close menu on window resize (if resizing to desktop)
        window.addEventListener("resize", () => {
          if (
            window.innerWidth > 768 &&
            panel.getAttribute("aria-hidden") === "false"
          ) {
            closeMenu();
          }
          setHeaderOffset(); // Recalculate header offset on resize
        });
      }

      (function revealProjects() {
        const cards = Array.from(document.querySelectorAll(".project-card"));
        if (!cards.length) return;

        if (window.innerWidth >= 1024) {
          cards.slice(0, 3).forEach((c) => c.classList.add("revealed"));
        }

        const io = new IntersectionObserver(
          (entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                obs.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
        );

        cards.forEach((c) => io.observe(c));
      })();

setupHamburger();

 // Handle form submission
  document.getElementById("contact-form").addEventListener("submit", function(e) {
    e.preventDefault(); // prevent page reload

    emailjs.sendForm("priyanshikh16@gmail.com", "template_3o5i6w6", this)
      .then(() => {
        alert("✅ Message sent successfully!");
        this.reset();
      })
      .catch((error) => {
        console.error("❌ Failed to send message:", error);
        alert("Something went wrong. Please try again.");
      });
  });
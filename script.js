window.addEventListener('load', function() {
            const progressBar = document.querySelector('.loader-progress-bar');
            let progress = 0;
            
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 100) progress = 100;
                
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        document.querySelector('.preloader').classList.add('hidden');
                    }, 500);
                }
            }, 100);
        });

        // Custom Cursor
        const cursor = document.querySelector('.cursor');
        const cursorTrail = document.querySelector('.cursor-trail');
        let mouseX = 0, mouseY = 0;
        let trailX = 0, trailY = 0;

        document.addEventListener('mousemove', (e) => {
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

        // Cursor interactions
        document.addEventListener('mousedown', () => cursor.classList.add('active'));
        document.addEventListener('mouseup', () => cursor.classList.remove('active'));

        const textElements = document.querySelectorAll('h1, h2, h3, h4, p, a, button');
        textElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('text-hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('text-hover'));
        });

        // Theme Toggle
        const themeToggle = document.querySelector('.theme-toggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or default to 'light'
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        if (currentTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        }

        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });

        // Mobile Menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('show');
            document.body.style.overflow = mobileMenu.classList.contains('show') ? 'hidden' : '';
        });

        // Close mobile menu when clicking on a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        });

        // Header scroll effect
        const header = document.querySelector('header');
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Scroll progress
        const scrollProgress = document.querySelector('.scroll-progress');
        window.addEventListener('scroll', function() {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        });

        // Scroll to top button
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Animate on scroll
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const animateOnScroll = () => {
            animateElements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('animate-in');
                }
            });
        };

        window.addEventListener('scroll', animateOnScroll);
        animateOnScroll(); // Run once on load

      const contactForm = document.querySelector('.contact-form form');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;

        // Get form data
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Show spinner & disable button
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Send email using EmailJS
        emailjs.send('priyanshikh16@gmail.com', 'template_3o5i6w6', {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        })
        .then(() => {
            alert("Message sent successfully! I'll get back to you soon.");
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        })
        .catch((error) => {
            console.error('EmailJS Error:', error);
            alert('Oops! Something went wrong. Please try again later.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });


        // Typing animation for hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle:last-of-type');
        if (heroSubtitle) {
            const text = heroSubtitle.textContent;
            heroSubtitle.textContent = '';
            
            let i = 0;
            function typeWriter() {
                if (i < text.length) {
                    heroSubtitle.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            }
            
            // Start typing animation after page load
            setTimeout(typeWriter, 1000);
        }

        // Counter animation for stats
        const stats = document.querySelectorAll('.stat-number');
        const animateStats = () => {
            stats.forEach(stat => {
                const target = parseInt(stat.textContent.replace('+', ''));
                const increment = target / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
                        setTimeout(updateCounter, 20);
                    } else {
                        stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                    }
                };
                
                updateCounter();
            });
        };

        // Trigger stats animation when about section comes into view
        const aboutSection = document.querySelector('#about');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        if (aboutSection) {
            statsObserver.observe(aboutSection);
        }

        // Add loading animation to project links
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    // You can redirect to actual links here
                    console.log('Navigate to:', this.getAttribute('href'));
                }, 1500);
            });
        });

        // Parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            document.querySelectorAll('.floating-element').forEach((element, index) => {
                const speed = (index + 1) * 0.1;
                element.style.transform = `translateY(${parallax * speed}px) rotate(${scrolled * 0.05}deg)`;
            });
        });

        // Add hover effect to skill tags
        const skillTags = document.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-2px) scale(1.05)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Initialize tooltips for social icons
        const socialIcons = document.querySelectorAll('.social-icons a');
        socialIcons.forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                const title = this.getAttribute('title');
                if (title) {
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
                    this.style.position = 'relative';
                    this.appendChild(tooltip);
                }
            });
            
            icon.addEventListener('mouseleave', function() {
                const tooltip = this.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });

        // Console message
        console.log('%c👋 Hello there!', 'color: #8b5cf6; font-size: 20px; font-weight: bold;');
        console.log('%cWelcome to my portfolio! If you\'re interested in the code, check out the source or contact me.', 'color: #64748b; font-size: 14px;');
        console.log('%c🚀 Built with HTML, CSS, and vanilla JavaScript', 'color: #10b981; font-size: 12px;');
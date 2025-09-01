// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initThemeToggle();
    initTypingAnimation();
    initScrollAnimations();
    initBackToTop();
    initContactForm();
    initMobileMenu();
    initNavbarScroll();
    initHeroParallax();
    initCloudEffect(); // NEW: Add cloudy background effect
});

// Navigation functionality
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Highlight active section in navigation
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const currentTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    body.setAttribute('data-color-scheme', currentTheme);
    updateThemeIcon(currentTheme, icon);

    themeToggle.addEventListener('click', function() {
        const newTheme = body.getAttribute('data-color-scheme') === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, icon);
    });
}

function updateThemeIcon(theme, icon) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Typing animation for hero section
function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const skills = ['React & Node.js', 'MongoDB & JavaScript', 'Modern Web Technologies', 'Full-Stack Development'];
    let skillIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeSkill() {
        const currentSkill = skills[skillIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentSkill.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentSkill.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && charIndex === currentSkill.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            skillIndex = (skillIndex + 1) % skills.length;
            typeSpeed = 500;
        }

        setTimeout(typeSkill, typeSpeed);
    }
    typeSkill();
}

// Scroll animations for elements
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    const animateElements = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .education-item, .course-card, .publication-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.8 });

    document.querySelectorAll('.stat-item h3').forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element) {
    const targetText = element.textContent;
    const target = parseFloat(targetText);
    if (isNaN(target)) return;
    
    const duration = 1500;
    const stepTime = 20;
    const totalSteps = duration / stepTime;
    const increment = target / totalSteps;
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (targetText.includes('.')) {
            element.textContent = current.toFixed(2);
        } else if (targetText.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Contact form only handles validation now
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        // Simple client-side validation
        const name = contactForm.querySelector('#name').value;
        const email = contactForm.querySelector('#email').value;
        const message = contactForm.querySelector('#message').value;

        if (!name || !email || !message) {
            e.preventDefault(); // Stop submission if fields are empty
            showNotification('Please fill in all required fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            e.preventDefault(); // Stop submission if email is invalid
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // If validation passes, the form will submit naturally.
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
        fontWeight: '500',
        zIndex: '9999',
        transform: 'translateX(120%)',
        transition: 'transform 0.5s ease-in-out',
    });

    document.body.appendChild(notification);

    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => { document.body.removeChild(notification); }, 500);
    }, 5000);
}

// Mobile menu functionality
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });
}

// Cleaner navbar background change on scroll using a CSS class
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    });
}

// Parallax effect for hero content
function initHeroParallax() {
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3; // Slower rate for a subtle effect
        heroContent.style.transform = `translateY(${rate}px)`;
        heroContent.style.opacity = 1 - (scrolled / 800);
    });
}

// NEW: Adds a cloudy floating effect to section backgrounds
function initCloudEffect() {
    const targetSelectors = ['#about', '#skills', '#experience', '#projects', '#education', '#contact'];

    targetSelectors.forEach(selector => {
        const section = document.querySelector(selector);
        if (!section) return;

        // Ensure the main content container is positioned above the clouds
        const container = section.querySelector('.container');
        if (container) {
            container.style.position = 'relative';
            container.style.zIndex = '2';
        }

        const cloudContainer = document.createElement('div');
        cloudContainer.className = 'cloud-container';
        
        const numClouds = 7; // You can change this number
        for (let i = 0; i < numClouds; i++) {
            const cloud = document.createElement('div');
            // Cycle through 5 different cloud styles
            const cloudStyle = `x${(i % 5) + 1}`; 
            cloud.className = `cloud ${cloudStyle}`;
            
            // Randomize starting position and animation delay for a natural look
            cloud.style.top = `${Math.random() * 90}%`;
            cloud.style.left = `${Math.random() * 100 - 50}%`;
            cloud.style.animationDelay = `${Math.random() * -25}s`;
            
            cloudContainer.appendChild(cloud);
        }
        
        // Add the cloud container to the beginning of the section
        section.prepend(cloudContainer);
    });
}


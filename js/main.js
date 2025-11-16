// ===== MAIN JAVASCRIPT FILE =====

(function() {
    'use strict';

    // ===== VARIABLES =====
    const body = document.body;
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelector('.nav-links');
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksArray = Array.from(document.querySelectorAll('.nav-link'));
    const tabButtons = Array.from(document.querySelectorAll('.tab-button'));
    const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));
    const contentTabs = Array.from(document.querySelectorAll('.content-tab'));
    const tabContents = Array.from(document.querySelectorAll('.tab-content'));
    const scrollElements = Array.from(document.querySelectorAll('[data-scroll]'));
    
    let isScrolling = false;
    let scrollTimer = null;

    // ===== UTILITY FUNCTIONS =====
    
    // Throttle function for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Debounce function
    function debounce(func, wait, immediate) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ===== NAVIGATION =====
    
    // Handle navigation scroll effect
    function handleNavScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('nav-scroll');
        } else {
            header.classList.remove('nav-scroll');
        }
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        const isOpen = navLinks.classList.contains('active');
        
        if (isOpen) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('open');
            body.style.overflow = '';
        } else {
            navLinks.classList.add('active');
            menuBtn.classList.add('open');
            body.style.overflow = 'hidden';
        }
    }

    // Close mobile menu when clicking on nav links
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('open');
        body.style.overflow = '';
    }

    // Smooth scroll to section
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = header.offsetHeight;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight - 50;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // ===== EXPERIENCE TABS =====
    
    function switchTab(index) {
        // Remove active class from all buttons and panels
        tabButtons.forEach(button => button.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));
        
        // Add active class to clicked button and corresponding panel
        tabButtons[index].classList.add('active');
        tabPanels[index].classList.add('active');
        
        // Update ARIA attributes
        tabButtons.forEach((button, i) => {
            button.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
    }

    // ===== SCROLL REVEAL ANIMATIONS =====
    
    function revealElements() {
        const reveals = document.querySelectorAll('.scroll-reveal:not(.active)');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // ===== TYPING ANIMATION =====
    
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // ===== SCROLL PROGRESS INDICATOR =====
    
    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: var(--accent);
                z-index: 9999;
                transition: width 0.3s ease;
            `;
            document.body.appendChild(progressBar);
        }
        
        progressBar.style.width = scrolled + '%';
    }

    // ===== PARALLAX EFFECT =====
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // ===== INTERSECTION OBSERVER =====
    
    function setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // Add staggered animation delay for child elements
                    const children = entry.target.querySelectorAll('.animate-on-scroll');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('in-view');
                        }, index * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });

        // Observe other elements with animation classes
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===== ACTIVE SECTION HIGHLIGHTING =====
    
    function updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.getBoundingClientRect().top + scrollY - 200;
            const sectionId = section.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== PRELOADER =====
    
    function hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }
    }

    // ===== CURSOR EFFECT =====
    
    function initCustomCursor() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--accent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            mix-blend-mode: difference;
            transition: transform 0.1s ease;
            opacity: 0;
        `;
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        function updateCursor() {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        }

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        // Scale cursor on hover
        const hoverElements = document.querySelectorAll('a, button, .project, .other-project');
        hoverElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });

        updateCursor();
    }

    // ===== THEME SWITCHING =====
    
    function initThemeSwitch() {
        const themeSwitch = document.querySelector('.theme-switch');
        if (!themeSwitch) return;

        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);

        themeSwitch.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // ===== EVENT LISTENERS =====
    
    function initEventListeners() {
        // Window scroll events
        window.addEventListener('scroll', throttle(() => {
            handleNavScroll();
            revealElements();
            updateScrollProgress();
            updateActiveSection();
            handleParallax();
        }, 10));

        // Mobile menu toggle
        if (menuBtn) {
            menuBtn.addEventListener('click', toggleMobileMenu);
        }

        // Navigation links
        navLinksArray.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = link.getAttribute('href');
                
                // Only prevent default for hash links (smooth scrolling)
                if (target.startsWith('#')) {
                    e.preventDefault();
                    smoothScrollTo(target);
                    closeMobileMenu();
                }
                // For all other links (external, files, etc.), let default behavior happen
                else {
                    // Close mobile menu for any navigation
                    closeMobileMenu();
                }
            });
        });

        // Experience tabs
        tabButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                switchTab(index);
            });
            
            // Keyboard navigation
            button.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' && index > 0) {
                    switchTab(index - 1);
                    tabButtons[index - 1].focus();
                } else if (e.key === 'ArrowRight' && index < tabButtons.length - 1) {
                    switchTab(index + 1);
                    tabButtons[index + 1].focus();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Window resize
        window.addEventListener('resize', debounce(() => {
            // Close mobile menu on larger screens
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        }, 250));

        // Focus management for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('user-is-tabbing');
        });
    }

    // ===== ANIMATIONS ON LOAD =====
    
    function initLoadAnimations() {
        // Add delay to elements for staggered animation
        const animatedElements = document.querySelectorAll('.hero *');
        animatedElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.1}s`;
            element.classList.add('fade-in-up');
        });

        // Type writer effect for hero subtitle
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const text = heroSubtitle.textContent;
            setTimeout(() => {
                typeWriter(heroSubtitle, text, 50);
            }, 1000);
        }
    }

    // ===== EMAIL OBFUSCATION =====
    
    function initEmailProtection() {
        const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
        emailLinks.forEach(link => {
            const email = link.getAttribute('href').replace('mailto:', '');
            link.setAttribute('href', '#');
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = `mailto:${email}`;
            });
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    function optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ===== INITIALIZATION =====
    
    function init() {
        // Initialize all components
        initEventListeners();
        setupIntersectionObserver();
        initLoadAnimations();
        initEmailProtection();
        optimizeImages();
        
        // Fix for hero button to ensure smooth scrolling
        const heroButton = document.querySelector('.hero-cta .btn-primary');
        if (heroButton) {
            heroButton.addEventListener('click', (e) => {
                const target = heroButton.getAttribute('href');
                if (target && target.startsWith('#')) {
                    e.preventDefault();
                    smoothScrollTo(target);
                }
            });
        }
        
        // Initialize optional features based on screen size
        if (window.innerWidth > 1024) {
            initCustomCursor();
        }
        
        // Initialize theme switch if available
        initThemeSwitch();
        
        // Initialize image sliders for project pages
        if (document.getElementById('robotSliderTrack')) {
            initImageSlider('robotSliderTrack', 'prevBtn', 'nextBtn');
        }
        
        if (document.getElementById('aroaSliderTrack')) {
            initImageSlider('aroaSliderTrack', 'aroaPrevBtn', 'aroaNextBtn');
        }
        
        if (document.getElementById('websiteSliderTrack')) {
            initImageSlider('websiteSliderTrack', 'websitePrevBtn', 'websiteNextBtn');
        }
        
        // Initial calls
        handleNavScroll();
        revealElements();
        updateActiveSection();
        
        // Hide preloader
        setTimeout(hidePreloader, 500);
        
        console.log('Portfolio initialized successfully! 🚀');
    }

    // ===== DOM READY =====
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===== PUBLIC API =====
    
    window.Portfolio = {
        smoothScrollTo,
        switchTab,
        toggleMobileMenu,
        closeMobileMenu
    };

})();

// ===== ADDITIONAL UTILITIES =====

// Console easter egg
console.log(`
    Portfolio Website
    HIRE ME ILL DO ANYTHING AND I MEAN ANYTHING
`);

// Konami code easter egg
(function() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let userInput = [];
    
    document.addEventListener('keydown', (e) => {
        userInput.push(e.keyCode);
        
        if (userInput.length > konamiCode.length) {
            userInput.shift();
        }
        
        if (userInput.toString() === konamiCode.toString()) {
            // Easter egg trigger
            document.body.style.animation = 'rainbow 1s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 3000);
            
            console.log('🎉 Konami Code activated! You found the easter egg!');
        }
    });

    // ===== PROJECT CONTENT TABS =====
    function initContentTabs() {
        if (contentTabs.length === 0) return;

        // Show first tab by default
        if (contentTabs[0]) {
            contentTabs[0].classList.add('active');
        }
        if (tabContents[0]) {
            tabContents[0].classList.add('active');
        }

        contentTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                contentTabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));

                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                if (tabContents[index]) {
                    tabContents[index].classList.add('active');
                }
            });
        });
    }

    // Initialize content tabs
    initContentTabs();


})();

// ===== IMAGE SLIDER FUNCTIONALITY =====
function initImageSlider(trackId, prevBtnId, nextBtnId) {
    const sliderTrack = document.getElementById(trackId);
    const slides = sliderTrack ? sliderTrack.querySelectorAll('.slide') : [];
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dots = sliderTrack ? sliderTrack.parentElement.querySelectorAll('.slider-dots .dot') : [];
    
    console.log(`Slider elements found for ${trackId}:`, { 
        sliderTrack: !!sliderTrack, 
        slides: slides.length, 
        prevBtn: !!prevBtn, 
        nextBtn: !!nextBtn, 
        dots: dots.length 
    });
    
    if (prevBtn) console.log('Prev button element:', prevBtn);
    if (nextBtn) console.log('Next button element:', nextBtn);
    
    if (!sliderTrack || !slides.length) {
        console.log('Slider initialization failed - missing elements');
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Set up dynamic slider dimensions based on number of slides
    const slideWidth = 100 / totalSlides; // Each slide width as percentage
    const trackWidth = totalSlides * 100; // Total track width as percentage
    
    // Apply dynamic styles
    sliderTrack.style.width = `${trackWidth}%`;
    slides.forEach(slide => {
        slide.style.minWidth = `${slideWidth}%`;
        slide.style.flex = `0 0 ${slideWidth}%`;
    });
    
    // Update slider display
    function updateSlider(slideIndex) {
        console.log('Updating slider to slide:', slideIndex, 'Total slides:', totalSlides);
        
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        if (slides[slideIndex]) {
            slides[slideIndex].classList.add('active');
            console.log('Activated slide:', slideIndex, 'Alt text:', slides[slideIndex].querySelector('img')?.alt);
        }
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }
        
        // Update button states
        updateButtonStates(slideIndex);
        
        // Move slider track
        const translateX = -slideIndex * slideWidth;
        console.log('Setting transform to:', `translateX(${translateX}%)`);
        sliderTrack.style.transform = `translateX(${translateX}%)`;
    }
    
    // Update button states based on current slide
    function updateButtonStates(slideIndex) {
        // Disable/enable prev button
        if (prevBtn) {
            if (slideIndex === 0) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
        }
        
        // Disable/enable next button
        if (nextBtn) {
            if (slideIndex === totalSlides - 1) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }
    }
    
    // Next slide
    function nextSlide() {
        const nextIndex = currentSlide + 1;
        if (nextIndex < totalSlides) {
            console.log('Next slide called. Current:', currentSlide, '→ Next:', nextIndex);
            currentSlide = nextIndex;
            updateSlider(currentSlide);
        } else {
            console.log('Next slide called but already at last slide:', currentSlide);
            // Optional: Add visual feedback that we're at the end
            // For now, do nothing (no wrapping)
        }
    }
    
    // Previous slide
    function prevSlide() {
        const prevIndex = currentSlide - 1;
        if (prevIndex >= 0) {
            console.log('Prev slide called. Current:', currentSlide, '→ Prev:', prevIndex);
            currentSlide = prevIndex;
            updateSlider(currentSlide);
        } else {
            console.log('Prev slide called but already at first slide:', currentSlide);
            // Optional: Add visual feedback that we're at the beginning
            // For now, do nothing (no wrapping)
        }
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        updateSlider(currentSlide);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button (right arrow) clicked');
            nextSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Prev button (left arrow) clicked');
            prevSlide();
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Initialize first slide
    updateSlider(0);
}

// Add rainbow animation for easter egg
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);
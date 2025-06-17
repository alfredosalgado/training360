/*=============== VARIABLES ===============*/
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section[id]');
const scrollUp = document.getElementById('scroll-up');
const contactForm = document.getElementById('contact-form');
const contactMessage = document.getElementById('contact-message');

/*=============== MENU SHOW & HIDE ===============*/
// Menu show
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
        document.body.style.overflow = 'hidden';
    });
}

// Menu hide
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
        document.body.style.overflow = 'auto';
    });
}

/*=============== REMOVE MENU MOBILE ===============*/
const linkAction = () => {
    navMenu.classList.remove('show-menu');
    document.body.style.overflow = 'auto';
};

navLinks.forEach(n => n.addEventListener('click', linkAction));

/*=============== CHANGE BACKGROUND HEADER ===============*/
const scrollHeader = () => {
    const header = document.getElementById('header');
    // When the scroll is greater than 50 viewport height, add the scroll-header class
    if (window.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
};

window.addEventListener('scroll', scrollHeader);

/*=============== SHOW SCROLL UP ===============*/
const scrollUpFunction = () => {
    // When the scroll is higher than 350 viewport height, add the show-scroll class
    if (window.scrollY >= 350) {
        scrollUp.classList.add('show-scroll');
    } else {
        scrollUp.classList.remove('show-scroll');
    }
};

window.addEventListener('scroll', scrollUpFunction);

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 58;
        const sectionId = current.getAttribute('id');
        const sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            sectionsClass?.classList.add('active-link');
        } else {
            sectionsClass?.classList.remove('active-link');
        }
    });
};

window.addEventListener('scroll', scrollActive);

/*=============== SMOOTH SCROLLING ===============*/
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/*=============== SCROLL ANIMATIONS ===============*/
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.section');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
});

/*=============== CONTACT FORM ===============*/
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const validatePhone = (phone) => {
    const re = /^[\+]?[(]?[\d\s\-\(\)]{8,}$/;
    return re.test(phone);
};

const showMessage = (message, type) => {
    contactMessage.textContent = message;
    contactMessage.className = `contact__form-message ${type}`;
    
    setTimeout(() => {
        contactMessage.className = 'contact__form-message';
    }, 5000);
};

const resetForm = () => {
    contactForm.reset();
    
    // Reset floating labels
    const formGroups = contactForm.querySelectorAll('.contact__form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('.contact__form-input');
        const label = group.querySelector('.contact__form-label');
        
        if (input && label) {
            input.value = '';
            input.placeholder = ' ';
        }
    });
};

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name').trim(),
            email: formData.get('email').trim(),
            phone: formData.get('phone').trim(),
            company: formData.get('company').trim(),
            service: formData.get('service'),
            message: formData.get('message').trim()
        };
        
        // Validation
        if (!data.name) {
            showMessage('Por favor, ingresa tu nombre completo.', 'error');
            return;
        }
        
        if (!data.email || !validateEmail(data.email)) {
            showMessage('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }
        
        if (!data.phone || !validatePhone(data.phone)) {
            showMessage('Por favor, ingresa un número de teléfono válido.', 'error');
            return;
        }
        
        if (!data.service) {
            showMessage('Por favor, selecciona un servicio de interés.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('.contact__form-button');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Create email content
            const emailSubject = `Nueva solicitud de cotización - ${data.service}`;
            const emailBody = `
Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone}
Empresa: ${data.company || 'No especificada'}
Servicio: ${data.service}

Mensaje:
${data.message || 'Sin mensaje adicional'}
            `.trim();
            
            // Create mailto link
            const mailtoLink = `mailto:training360ltda@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            showMessage('¡Solicitud enviada exitosamente! Se abrirá tu cliente de correo para confirmar el envío.', 'success');
            
            // Reset form
            resetForm();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
        }, 2000);
    });
}

/*=============== FLOATING LABELS ===============*/
const setupFloatingLabels = () => {
    const formInputs = document.querySelectorAll('.contact__form-input');
    
    formInputs.forEach(input => {
        // Set initial state
        input.placeholder = ' ';
        
        // Handle focus and blur events
        input.addEventListener('focus', () => {
            input.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value.trim()) {
                input.parentNode.classList.remove('focused');
            }
        });
        
        // Handle initial values (for auto-fill)
        if (input.value.trim()) {
            input.parentNode.classList.add('focused');
        }
    });
};

/*=============== LOADING ANIMATIONS ===============*/
const addLoadingAnimations = () => {
    const cards = document.querySelectorAll('.services__card, .why-us__card, .benefits__item');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(card);
    });
};

/*=============== SMOOTH HOVER EFFECTS ===============*/
const addHoverEffects = () => {
    const cards = document.querySelectorAll('.services__card, .why-us__card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
};

/*=============== TYPEWRITER EFFECT FOR HERO TITLE ===============*/
const typewriterEffect = () => {
    const heroTitle = document.querySelector('.hero__title');
    const text = heroTitle.innerHTML;
    
    heroTitle.innerHTML = '';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            heroTitle.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 50);
};

/*=============== COUNTER ANIMATION ===============*/
const animateCounters = () => {
    const counters = document.querySelectorAll('[data-counter]');
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-counter');
            const count = +counter.innerText;
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target;
            }
        };
        
        observer.observe(counter);
        counter.addEventListener('intersect', updateCount);
    });
};

/*=============== PARALLAX EFFECT ===============*/
const parallaxEffect = () => {
    const parallaxElements = document.querySelectorAll('.hero__image, .about__image, .challenge__image');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
};

/*=============== MODAL FUNCTIONALITY ===============*/
const setupModals = () => {
    const serviceCards = document.querySelectorAll('.services__card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add click effect
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
                card.style.transform = 'translateY(-5px)';
            }, 150);
        });
    });
};

/*=============== LAZY LOADING IMAGES ===============*/
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
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
};

/*=============== PROGRESS BARS ===============*/
const animateProgressBars = () => {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        observer.observe(bar);
        
        bar.addEventListener('intersect', () => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    });
};

/*=============== TESTIMONIALS SLIDER ===============*/
const setupTestimonialSlider = () => {
    const testimonials = document.querySelectorAll('.testimonial');
    let currentTestimonial = 0;
    
    const showTestimonial = (index) => {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
    };
    
    // Auto-play testimonials
    setInterval(() => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }, 5000);
};

/*=============== PERFORMANCE OPTIMIZATION ===============*/
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Debounced scroll functions
const debouncedScrollHeader = debounce(scrollHeader, 10);
const debouncedScrollActive = debounce(scrollActive, 10);
const debouncedScrollUp = debounce(scrollUpFunction, 10);

// Remove original listeners and add debounced ones
window.removeEventListener('scroll', scrollHeader);
window.removeEventListener('scroll', scrollActive);
window.removeEventListener('scroll', scrollUpFunction);

window.addEventListener('scroll', debouncedScrollHeader);
window.addEventListener('scroll', debouncedScrollActive);
window.addEventListener('scroll', debouncedScrollUp);

/*=============== INITIALIZATION ===============*/
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    setupFloatingLabels();
    addLoadingAnimations();
    addHoverEffects();
    setupModals();
    lazyLoadImages();
    animateProgressBars();
    
    // Add fade-in animation to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(30px)';
        heroSection.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        
        setTimeout(() => {
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Initialize scroll animations
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

/*=============== SERVICE WORKER FOR PWA ===============*/
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

/*=============== ACCESSIBILITY IMPROVEMENTS ===============*/
const setupAccessibility = () => {
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
            navMenu.classList.remove('show-menu');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Add focus management
    const focusableElements = document.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="email"], input[type="tel"], select'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
    
    // Add aria-labels for better screen reader support
    const buttons = document.querySelectorAll('button, .button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label')) {
            const text = button.textContent.trim();
            if (text) {
                button.setAttribute('aria-label', text);
            }
        }
    });
};

/*=============== PERFORMANCE MONITORING ===============*/
const performanceMonitoring = () => {
    // Monitor loading performance
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page loaded in ${loadTime}ms`);
        
        // Log Core Web Vitals if available
        if ('web-vitals' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }
    });
};

/*=============== ERROR HANDLING ===============*/
const setupErrorHandling = () => {
    window.addEventListener('error', (e) => {
        console.error('Global error:', e.error);
        
        // Show user-friendly error message for critical errors
        if (e.error && e.error.message.includes('network')) {
            showMessage('Error de conexión. Por favor, verifica tu conexión a internet.', 'error');
        }
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
    });
};

/*=============== FINAL INITIALIZATION ===============*/
document.addEventListener('DOMContentLoaded', () => {
    setupAccessibility();
    performanceMonitoring();
    setupErrorHandling();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});

/*=============== UTILS ===============*/
const utils = {
    // Smooth scroll to element
    scrollTo: (element, offset = 0) => {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    },
    
    // Get element position
    getElementPosition: (element) => {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.pageYOffset,
            left: rect.left + window.pageXOffset
        };
    },
    
    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Format phone number
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (match) {
            return `+56 ${match[1]} ${match[2]} ${match[3]}`;
        }
        return phone;
    }
};

// Export utils for external use
window.Training360Utils = utils;

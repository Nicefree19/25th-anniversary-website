/**
 * Main JavaScript File
 * 어린이도서연구회 은평지회 25주년 기념 웹사이트
 */

// Performance optimization: Use 'DOMContentLoaded' for critical, 'load' for non-critical
document.addEventListener('DOMContentLoaded', function() {
    // Initialize critical modules first
    initializeCritical();
});

// Non-critical initialization after page load
window.addEventListener('load', function() {
    // Initialize non-critical modules
    initializeNonCritical();
});

/**
 * Initialize Critical Modules (DOMContentLoaded)
 */
function initializeCritical() {
    // Hide loading screen
    hideLoadingScreen();
    
    // Initialize scroll events (critical for header)
    initializeScrollEvents();
    
    // Initialize lazy loading (critical for performance)
    initializeLazyLoading();
    
    // Initialize countdown if visible
    const countdown = document.getElementById('countdown');
    if (countdown && isInViewport(countdown)) {
        initializeCountdown();
    }
}

/**
 * Initialize Non-Critical Modules (window load)
 */
function initializeNonCritical() {
    // Initialize AOS (Animate On Scroll)
    requestIdleCallback(() => {
        initializeAOS();
    });
    
    // Initialize Swiper
    requestIdleCallback(() => {
        initializeSwiper();
    });
    
    // Initialize countdown if not already initialized
    const countdown = document.getElementById('countdown');
    if (countdown && !countdown.dataset.initialized) {
        initializeCountdown();
    }
    
    // Initialize form handling
    initializeFormHandling();
}

// Polyfill for requestIdleCallback
if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(callback) {
        return setTimeout(callback, 1);
    };
}

/**
 * Hide Loading Screen
 */
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    }
}

/**
 * Initialize AOS (Animate On Scroll)
 */
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100,
            delay: 0,
            mirror: false
        });
    }
}

/**
 * Initialize Swiper Slider
 */
function initializeSwiper() {
    // Program Slider
    const programSlider = document.getElementById('programSlider');
    if (programSlider && typeof Swiper !== 'undefined') {
        new Swiper('#programSlider', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }
    
    // Gallery Slider (for gallery page)
    const gallerySlider = document.getElementById('gallerySlider');
    if (gallerySlider && typeof Swiper !== 'undefined') {
        new Swiper('#gallerySlider', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            thumbs: {
                swiper: {
                    el: '#galleryThumbs',
                    slidesPerView: 5,
                    spaceBetween: 10,
                    watchSlidesProgress: true,
                },
            },
        });
    }
}

/**
 * Initialize Countdown Timer
 */
function initializeCountdown() {
    const countdown = document.getElementById('countdown');
    if (!countdown) return;
    
    // Mark as initialized
    countdown.dataset.initialized = 'true';
    
    // Set target date: September 20, 2025, 10:30 AM
    const targetDate = new Date('2025-09-20T10:30:00');
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        if (difference <= 0) {
            // Event has started
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

/**
 * Initialize Scroll Events
 */
function initializeScrollEvents() {
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('backToTop');
    
    let lastScrollY = 0;
    let ticking = false;
    
    function updateScrollState() {
        const scrollY = window.scrollY;
        
        // Header scroll effect
        if (header) {
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Back to top button
        if (backToTopBtn) {
            if (scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    }
    
    // Scroll event listener
    window.addEventListener('scroll', requestTick);
    
    // Back to top button click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Initialize Form Handling
 */
function initializeFormHandling() {
    const forms = document.querySelectorAll('form[data-ajax]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.textContent = '처리 중...';
            
            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Show success message
                showNotification('성공적으로 제출되었습니다!', 'success');
                
                // Reset form
                form.reset();
            } catch (error) {
                // Show error message
                showNotification('오류가 발생했습니다. 다시 시도해주세요.', 'error');
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    });
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification__content">
            <p>${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Initialize Lazy Loading
 */
function initializeLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        lazyImages.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else {
        // Use Intersection Observer as fallback
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

/**
 * Utility Functions
 */

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
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

// Format date
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('ko-KR', options);
}

// Export functions for use in other modules
window.appUtils = {
    debounce,
    throttle,
    isInViewport,
    formatDate,
    showNotification
};
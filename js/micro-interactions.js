/**
 * Premium Micro Interactions & 3D Effects System
 * 고급 마이크로 인터랙션 및 3D 효과 시스템 - 국내 최고 웹디자이너 수준
 */

class MicroInteractionsSystem {
    constructor() {
        this.isEnabled = this.shouldEnable();
        this.activeElements = new Map();
        this.settings = this.getOptimalSettings();
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    shouldEnable() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.innerWidth <= 768;
        return !prefersReducedMotion && !isMobile;
    }
    
    getOptimalSettings() {
        return {
            tiltStrength: 15,
            scaleStrength: 1.05,
            shadowStrength: 30,
            transitionDuration: 300,
            perspectiveDistance: 1000,
            magneticStrength: 0.3,
            rippleSize: 200
        };
    }
    
    init() {
        this.setup3DEffects();
        this.setupMagneticButtons();
        this.setupRippleEffects();
        this.setupTextRevealEffects();
        this.setupScrollTriggeredAnimations();
        this.setupAdvancedHoverEffects();
        
        console.log('⚡ Micro Interactions 활성화');
    }
    
    setup3DEffects() {
        const elements = document.querySelectorAll(
            '.event-info__card, .feature-card, .game-card, .special-program__item'
        );
        
        elements.forEach(element => {
            this.make3D(element);
        });
    }
    
    make3D(element) {
        element.style.transformStyle = 'preserve-3d';
        element.style.transition = `transform ${this.settings.transitionDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        const handleMouseMove = (e) => {
            if (!this.isEnabled) return;
            
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * this.settings.tiltStrength;
            const rotateY = (centerX - x) / centerX * this.settings.tiltStrength;
            
            const translateZ = this.settings.shadowStrength;
            
            element.style.transform = `
                perspective(${this.settings.perspectiveDistance}px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(${translateZ}px)
                scale(${this.settings.scaleStrength})
            `;
            
            // Dynamic shadow based on tilt
            const shadowX = rotateY * 2;
            const shadowY = rotateX * 2;
            element.style.boxShadow = `
                ${shadowX}px ${shadowY + 20}px 40px rgba(0, 0, 0, 0.2),
                inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `;
        };
        
        const handleMouseLeave = () => {
            element.style.transform = '';
            element.style.boxShadow = '';
        };
        
        element.addEventListener('mousemove', handleMouseMove);
        element.addEventListener('mouseleave', handleMouseLeave);
        
        this.activeElements.set(element, { handleMouseMove, handleMouseLeave });
    }
    
    setupMagneticButtons() {
        const buttons = document.querySelectorAll('.btn, .back-to-top, .mobile-menu-btn');
        
        buttons.forEach(button => {
            this.makeMagnetic(button);
        });
    }
    
    makeMagnetic(button) {
        let isHovering = false;
        
        const handleMouseMove = (e) => {
            if (!this.isEnabled || !isHovering) return;
            
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = Math.max(rect.width, rect.height);
            
            if (distance < maxDistance) {
                const strength = this.settings.magneticStrength * (1 - distance / maxDistance);
                const translateX = x * strength;
                const translateY = y * strength;
                
                button.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
            }
        };
        
        const handleMouseEnter = () => {
            isHovering = true;
            button.style.transition = 'transform 0.1s ease-out';
        };
        
        const handleMouseLeave = () => {
            isHovering = false;
            button.style.transform = '';
            button.style.transition = 'transform 0.3s ease-out';
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
    }
    
    setupRippleEffects() {
        const clickableElements = document.querySelectorAll(
            '.btn, .nav__link, .mobile-nav__link, .event-info__card, .feature-card'
        );
        
        clickableElements.forEach(element => {
            this.addRippleEffect(element);
        });
    }
    
    addRippleEffect(element) {
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        const createRipple = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.className = 'micro-ripple';
            
            const size = this.settings.rippleSize;
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x - size/2}px;
                top: ${y - size/2}px;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                animation: rippleExpand 0.6s ease-out;
                z-index: 1;
            `;
            
            element.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.remove();
                }
            }, 600);
        };
        
        element.addEventListener('click', createRipple);
        
        // CSS 애니메이션 정의
        this.addRippleStyles();
    }
    
    addRippleStyles() {
        const styles = `
            @keyframes rippleExpand {
                from {
                    transform: scale(0);
                    opacity: 1;
                }
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        this.addStyleSheet('ripple-effects', styles);
    }
    
    setupTextRevealEffects() {
        const textElements = document.querySelectorAll('h2, h3, .section__subtitle');
        
        textElements.forEach(element => {
            this.addTextRevealEffect(element);
        });
    }
    
    addTextRevealEffect(element) {
        if (element.classList.contains('text-reveal-processed')) return;
        
        const text = element.textContent;
        const words = text.split(' ');
        
        element.innerHTML = '';
        element.classList.add('text-reveal-processed');
        
        words.forEach((word, index) => {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'reveal-word';
            wordSpan.textContent = word + ' ';
            wordSpan.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                transition-delay: ${index * 0.1}s;
            `;
            element.appendChild(wordSpan);
        });
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const words = entry.target.querySelectorAll('.reveal-word');
                    words.forEach(word => {
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    }
    
    setupScrollTriggeredAnimations() {
        const animatedElements = document.querySelectorAll(
            '.timeline__content, .about__card, .program__item'
        );
        
        animatedElements.forEach((element, index) => {
            this.addScrollAnimation(element, index);
        });
    }
    
    addScrollAnimation(element, index) {
        element.style.cssText = `
            opacity: 0;
            transform: translateY(50px) scale(0.9);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            transition-delay: ${(index % 3) * 0.1}s;
        `;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(element);
    }
    
    setupAdvancedHoverEffects() {
        // Logo hover effect
        const logo = document.querySelector('.header__logo');
        if (logo) {
            this.addLogoHoverEffect(logo);
        }
        
        // Icon hover effects
        const icons = document.querySelectorAll('.event-info__icon, .game-card__icon');
        icons.forEach(icon => {
            this.addIconHoverEffect(icon);
        });
        
        // Image hover effects
        const images = document.querySelectorAll('.game-card__image, .special-program__image');
        images.forEach(image => {
            this.addImageHoverEffect(image);
        });
    }
    
    addLogoHoverEffect(logo) {
        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.1) rotateY(10deg)';
            logo.style.filter = 'drop-shadow(0 10px 20px rgba(210, 105, 30, 0.3))';
        });
        
        logo.addEventListener('mouseleave', () => {
            logo.style.transform = '';
            logo.style.filter = '';
        });
    }
    
    addIconHoverEffect(icon) {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotateZ(5deg)';
            icon.style.filter = 'brightness(1.2) saturate(1.3)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = '';
            icon.style.filter = '';
        });
    }
    
    addImageHoverEffect(image) {
        const container = image.parentElement;
        container.style.overflow = 'hidden';
        
        image.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.1) rotateZ(2deg)';
            image.style.filter = 'brightness(1.1) contrast(1.2) saturate(1.2)';
        });
        
        image.addEventListener('mouseleave', () => {
            image.style.transform = '';
            image.style.filter = '';
        });
    }
    
    addStyleSheet(id, styles) {
        let styleSheet = document.getElementById(id);
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = id;
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = styles;
    }
    
    // Performance optimization methods
    optimizeForLowEnd() {
        this.settings.tiltStrength = 5;
        this.settings.scaleStrength = 1.02;
        this.settings.shadowStrength = 10;
        this.settings.transitionDuration = 150;
    }
    
    disable() {
        this.isEnabled = false;
        
        // Remove all event listeners and reset styles
        this.activeElements.forEach((handlers, element) => {
            element.removeEventListener('mousemove', handlers.handleMouseMove);
            element.removeEventListener('mouseleave', handlers.handleMouseLeave);
            element.style.transform = '';
            element.style.boxShadow = '';
        });
        
        this.activeElements.clear();
    }
    
    enable() {
        if (this.shouldEnable()) {
            this.isEnabled = true;
            this.init();
        }
    }
    
    destroy() {
        this.disable();
        
        // Remove style sheets
        const styleSheets = document.querySelectorAll('#ripple-effects');
        styleSheets.forEach(sheet => sheet.remove());
        
        console.log('⚡ Micro Interactions 비활성화');
    }
}

// 전역 접근을 위한 내보내기
window.MicroInteractionsSystem = MicroInteractionsSystem;
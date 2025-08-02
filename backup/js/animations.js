/**
 * Animations JavaScript
 * 어린이도서연구회 은평지회 25주년 기념 웹사이트
 */

// Animations Module
const Animations = (function() {
    'use strict';
    
    // Configuration
    const config = {
        leafCount: 15,
        leafColors: ['#FF6B6B', '#FFD93D', '#FF8C42', '#FFA500', '#FF6347'],
        particleCount: 50,
        scrollAnimationOffset: 100
    };
    
    /**
     * Initialize Animations
     */
    function init() {
        // Initialize leaf animation
        initLeafAnimation();
        
        // Initialize scroll animations
        initScrollAnimations();
        
        // Initialize hover effects
        initHoverEffects();
        
        // Initialize parallax effects
        initParallaxEffects();
        
        // Initialize text animations
        initTextAnimations();
        
        // Initialize counter animations
        initCounterAnimations();
    }
    
    /**
     * Initialize Leaf Animation
     */
    function initLeafAnimation() {
        const canvas = document.getElementById('leafCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let leaves = [];
        
        // Set canvas size
        function setCanvasSize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        setCanvasSize();
        window.addEventListener('resize', setCanvasSize);
        
        // Leaf class
        class Leaf {
            constructor() {
                this.reset();
                this.y = Math.random() * canvas.height;
            }
            
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = -50;
                this.size = Math.random() * 20 + 10;
                this.speedY = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
                this.color = config.leafColors[Math.floor(Math.random() * config.leafColors.length)];
                this.opacity = Math.random() * 0.6 + 0.4;
            }
            
            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y * 0.01) * 0.5;
                this.rotation += this.rotationSpeed;
                
                if (this.y > canvas.height + 50) {
                    this.reset();
                }
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation * Math.PI / 180);
                
                // Draw leaf shape
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(-this.size/2, -this.size/2, -this.size/2, 0);
                ctx.quadraticCurveTo(-this.size/4, this.size/2, 0, this.size);
                ctx.quadraticCurveTo(this.size/4, this.size/2, this.size/2, 0);
                ctx.quadraticCurveTo(this.size/2, -this.size/2, 0, -this.size);
                ctx.fill();
                
                ctx.restore();
            }
        }
        
        // Create leaves
        for (let i = 0; i < config.leafCount; i++) {
            leaves.push(new Leaf());
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            leaves.forEach(leaf => {
                leaf.update();
                leaf.draw();
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    /**
     * Initialize Scroll Animations
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
        
        if (!animatedElements.length) return;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: `0px 0px -${config.scrollAnimationOffset}px 0px`
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    
                    // Stagger animations for multiple elements
                    const siblings = entry.target.parentElement.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
                    siblings.forEach((sibling, index) => {
                        setTimeout(() => {
                            sibling.classList.add('in-view');
                        }, index * 100);
                    });
                }
            });
        }, observerOptions);
        
        animatedElements.forEach(el => observer.observe(el));
    }
    
    /**
     * Initialize Hover Effects
     */
    function initHoverEffects() {
        // Magnetic buttons
        const magneticButtons = document.querySelectorAll('.btn');
        
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
        
        // Tilt effect on cards
        const cards = document.querySelectorAll('.card, .feature-card, .program-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const rotateX = (y - 0.5) * 10;
                const rotateY = (x - 0.5) * -10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
    
    /**
     * Initialize Parallax Effects
     */
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        if (!parallaxElements.length) return;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                
                el.style.transform = `translateY(${yPos}px)`;
            });
        }
        
        window.addEventListener('scroll', throttle(updateParallax, 16));
    }
    
    /**
     * Initialize Text Animations
     */
    function initTextAnimations() {
        // Typing effect
        const typingElements = document.querySelectorAll('[data-typing]');
        
        typingElements.forEach(el => {
            const text = el.textContent;
            el.textContent = '';
            el.style.visibility = 'visible';
            
            let index = 0;
            function type() {
                if (index < text.length) {
                    el.textContent += text.charAt(index);
                    index++;
                    setTimeout(type, 100);
                }
            }
            
            // Start typing when element is in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.disconnect();
                }
            });
            
            observer.observe(el);
        });
        
        // Split text animation
        const splitTextElements = document.querySelectorAll('[data-split-text]');
        
        splitTextElements.forEach(el => {
            const text = el.textContent;
            el.innerHTML = text.split('').map((char, i) => 
                `<span style="animation-delay: ${i * 0.05}s">${char}</span>`
            ).join('');
        });
    }
    
    /**
     * Initialize Counter Animations
     */
    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.counter);
            const duration = parseInt(counter.dataset.duration) || 2000;
            const start = 0;
            const increment = target / (duration / 16);
            
            let current = start;
            
            function updateCounter() {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            }
            
            // Start counting when element is in view
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.disconnect();
                }
            });
            
            observer.observe(counter);
        });
    }
    
    /**
     * Create Ripple Effect
     */
    function createRipple(e, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    /**
     * Create Particle Effect
     */
    function createParticles(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            const angle = (Math.PI * 2 * i) / count;
            const velocity = Math.random() * 50 + 50;
            
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }
    
    /**
     * Utility: Throttle
     */
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
    
    // Public API
    return {
        init: init,
        createRipple: createRipple,
        createParticles: createParticles
    };
})();

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', Animations.init);

// Add animation styles
const animationStyles = `
<style>
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .particle {
        position: fixed;
        width: 8px;
        height: 8px;
        background: var(--color-primary);
        border-radius: 50%;
        pointer-events: none;
        animation: particle-float 1s ease-out forwards;
    }
    
    @keyframes particle-float {
        to {
            transform: translate(var(--tx), var(--ty));
            opacity: 0;
        }
    }
    
    [data-typing] {
        visibility: hidden;
    }
    
    [data-split-text] span {
        display: inline-block;
        animation: split-text-fade 0.6s ease-out forwards;
        opacity: 0;
    }
    
    @keyframes split-text-fade {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
`;

document.head.insertAdjacentHTML('beforeend', animationStyles);
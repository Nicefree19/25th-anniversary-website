/**
 * Premium Custom Cursor System
 * 고급 커스텀 커서 시스템 - 국내 최고 웹디자이너 수준
 */

class CustomCursor {
    constructor() {
        this.cursor = null;
        this.follower = null;
        this.isEnabled = this.shouldEnable();
        this.ripples = [];
        this.trails = [];
        this.settings = this.getOptimalSettings();
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    shouldEnable() {
        // 터치 디바이스나 모바일에서는 비활성화
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isMobile = window.innerWidth <= 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return !isTouchDevice && !isMobile && !prefersReducedMotion;
    }
    
    getOptimalSettings() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        return {
            cursorSize: 12,
            followerSize: 40,
            followSpeed: 0.15,
            rippleCount: 8,
            trailLength: 12,
            isDarkMode,
            colors: {
                cursor: isDarkMode ? '#F97316' : '#D2691E',
                follower: isDarkMode ? 'rgba(249, 115, 22, 0.1)' : 'rgba(210, 105, 30, 0.1)',
                ripple: isDarkMode ? '#F97316' : '#D2691E',
                trail: isDarkMode ? 'rgba(249, 115, 22, 0.3)' : 'rgba(210, 105, 30, 0.3)'
            }
        };
    }
    
    init() {
        this.createCursorElements();
        this.setupEventListeners();
        this.hideBrowserCursor();
        this.startAnimation();
        
        console.log('🎯 Custom Cursor 활성화');
    }
    
    createCursorElements() {
        // 메인 커서
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.innerHTML = `
            <div class="cursor-core"></div>
            <div class="cursor-glow"></div>
        `;
        
        // 팔로워 (지연 따라다니는 원)
        this.follower = document.createElement('div');
        this.follower.className = 'custom-cursor-follower';
        
        // 트레일 컨테이너
        this.trailContainer = document.createElement('div');
        this.trailContainer.className = 'cursor-trail-container';
        
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.follower);
        document.body.appendChild(this.trailContainer);
        
        this.applyStyles();
    }
    
    applyStyles() {
        const styles = `
            .custom-cursor {
                position: fixed;
                width: ${this.settings.cursorSize}px;
                height: ${this.settings.cursorSize}px;
                pointer-events: none;
                z-index: 9999;
                mix-blend-mode: difference;
                will-change: transform;
                transform: translate3d(0, 0, 0);
            }
            
            .cursor-core {
                width: 100%;
                height: 100%;
                background: ${this.settings.colors.cursor};
                border-radius: 50%;
                box-shadow: 0 0 10px ${this.settings.colors.cursor};
                transition: all 0.1s ease;
            }
            
            .cursor-glow {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, ${this.settings.colors.cursor}40 0%, transparent 70%);
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .custom-cursor-follower {
                position: fixed;
                width: ${this.settings.followerSize}px;
                height: ${this.settings.followerSize}px;
                background: ${this.settings.colors.follower};
                border: 2px solid ${this.settings.colors.cursor}30;
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                will-change: transform;
                transform: translate3d(0, 0, 0);
            }
            
            .cursor-trail-container {
                position: fixed;
                pointer-events: none;
                z-index: 9997;
                will-change: transform;
                transform: translate3d(0, 0, 0);
            }
            
            .cursor-trail {
                position: absolute;
                width: 4px;
                height: 4px;
                background: ${this.settings.colors.trail};
                border-radius: 50%;
                pointer-events: none;
                will-change: transform, opacity;
                transform: translate3d(0, 0, 0);
            }
            
            .cursor-ripple {
                position: fixed;
                border: 2px solid ${this.settings.colors.ripple};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9996;
                animation: cursorRipple 0.6s ease-out;
                will-change: transform, opacity;
                transform: translate3d(0, 0, 0);
            }
            
            @keyframes cursorRipple {
                from {
                    width: 10px;
                    height: 10px;
                    opacity: 1;
                }
                to {
                    width: 50px;
                    height: 50px;
                    opacity: 0;
                }
            }
            
            /* 호버 상태 변화 */
            .custom-cursor.hover .cursor-core {
                transform: scale(1.5);
                background: ${this.settings.colors.cursor};
                box-shadow: 0 0 20px ${this.settings.colors.cursor};
            }
            
            .custom-cursor.hover .cursor-glow {
                opacity: 1;
            }
            
            .custom-cursor-follower.hover {
                transform: scale(1.3) translate3d(var(--x), var(--y), 0);
                background: ${this.settings.colors.follower};
                border-color: ${this.settings.colors.cursor}60;
            }
            
            .custom-cursor.click .cursor-core {
                transform: scale(0.8);
            }
            
            /* 브라우저 기본 커서 숨기기 */
            body, body * {
                cursor: none !important;
            }
            
            /* 다크모드 조정 */
            @media (prefers-color-scheme: dark) {
                .custom-cursor {
                    mix-blend-mode: normal;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    hideBrowserCursor() {
        document.documentElement.style.cursor = 'none';
    }
    
    setupEventListeners() {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        // 마우스 움직임 추적
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // 메인 커서 위치 업데이트 (즉시)
            this.cursor.style.transform = `translate3d(${mouseX - this.settings.cursorSize/2}px, ${mouseY - this.settings.cursorSize/2}px, 0)`;
            
            // 트레일 추가
            this.addTrail(mouseX, mouseY);
        });
        
        // 팔로워 부드러운 애니메이션
        const updateFollower = () => {
            followerX += (mouseX - followerX) * this.settings.followSpeed;
            followerY += (mouseY - followerY) * this.settings.followSpeed;
            
            this.follower.style.setProperty('--x', `${followerX - this.settings.followerSize/2}px`);
            this.follower.style.setProperty('--y', `${followerY - this.settings.followerSize/2}px`);
            this.follower.style.transform = `translate3d(${followerX - this.settings.followerSize/2}px, ${followerY - this.settings.followerSize/2}px, 0)`;
            
            requestAnimationFrame(updateFollower);
        };
        updateFollower();
        
        // 클릭 이벤트
        document.addEventListener('mousedown', (e) => {
            this.cursor.classList.add('click');
            this.createRipple(e.clientX, e.clientY);
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
        });
        
        // 호버 상태 추적
        this.setupHoverTracking();
        
        // 다크모드 변경 감지
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                this.settings.isDarkMode = e.matches;
                this.updateColors();
            });
    }
    
    setupHoverTracking() {
        // 호버 가능한 요소들
        const hoverableSelectors = [
            'a', 'button', '.btn', '.nav__link', '.mobile-nav__link',
            '.event-info__card', '.feature-card', '.game-card',
            '.special-program__item', '.timeline__content',
            '[role="button"]', '.back-to-top'
        ];
        
        hoverableSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('hover');
                    this.follower.classList.add('hover');
                });
                
                element.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('hover');
                    this.follower.classList.remove('hover');
                });
            });
        });
    }
    
    addTrail(x, y) {
        if (this.trails.length >= this.settings.trailLength) {
            const oldTrail = this.trails.shift();
            if (oldTrail.element && oldTrail.element.parentNode) {
                oldTrail.element.remove();
            }
        }
        
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = `${x - 2}px`;
        trail.style.top = `${y - 2}px`;
        trail.style.opacity = '1';
        
        this.trailContainer.appendChild(trail);
        
        const trailData = {
            element: trail,
            life: 1,
            decay: 0.05
        };
        
        this.trails.push(trailData);
    }
    
    createRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'cursor-ripple';
        ripple.style.left = `${x - 5}px`;
        ripple.style.top = `${y - 5}px`;
        
        document.body.appendChild(ripple);
        
        // 애니메이션 완료 후 제거
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
    
    startAnimation() {
        const animate = () => {
            // 트레일 업데이트
            this.trails = this.trails.filter(trail => {
                trail.life -= trail.decay;
                if (trail.element) {
                    trail.element.style.opacity = trail.life;
                }
                
                if (trail.life <= 0) {
                    if (trail.element && trail.element.parentNode) {
                        trail.element.remove();
                    }
                    return false;
                }
                return true;
            });
            
            requestAnimationFrame(animate);
        };
        animate();
    }
    
    updateColors() {
        this.settings = this.getOptimalSettings();
        this.applyStyles();
    }
    
    destroy() {
        if (this.cursor) this.cursor.remove();
        if (this.follower) this.follower.remove();
        if (this.trailContainer) this.trailContainer.remove();
        
        // 기본 커서 복원
        document.documentElement.style.cursor = '';
        
        // 모든 리플 제거
        document.querySelectorAll('.cursor-ripple').forEach(ripple => ripple.remove());
        
        console.log('🎯 Custom Cursor 비활성화');
    }
}

// 전역 접근을 위한 내보내기
window.CustomCursor = CustomCursor;
/**
 * Premium Parallax Scrolling System
 * 고급 시차 스크롤 시스템 - 국내 최고 웹디자이너 수준
 */

class ParallaxScrollSystem {
    constructor() {
        this.elements = [];
        this.isEnabled = this.shouldEnable();
        this.ticking = false;
        this.scrollTop = 0;
        this.windowHeight = window.innerHeight;
        this.settings = this.getOptimalSettings();
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    shouldEnable() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.innerWidth <= 768;
        const isLowPowerDevice = navigator.hardwareConcurrency < 4;
        
        return !prefersReducedMotion && !isLowPowerDevice && !isMobile;
    }
    
    getOptimalSettings() {
        return {
            smoothing: 0.1,
            threshold: 0.1,
            precision: 1,
            rafThrottle: true,
            enableTransform3d: true,
            maxElements: 20
        };
    }
    
    init() {
        this.setupParallaxElements();
        this.bindEvents();
        this.update();
        
        console.log('🌊 Parallax Scrolling 활성화');
    }
    
    setupParallaxElements() {
        // 자동으로 parallax 속성을 가진 요소들을 찾기
        const autoElements = document.querySelectorAll('[data-parallax]');
        autoElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const direction = element.dataset.parallaxDirection || 'vertical';
            const trigger = element.dataset.parallaxTrigger || 'scroll';
            
            this.addElement(element, speed, direction, trigger);
        });
        
        // 미리 정의된 parallax 요소들
        this.addPredefinedElements();
    }
    
    addPredefinedElements() {
        // Hero 섹션 배경
        const heroBackground = document.querySelector('.hero__background');
        if (heroBackground) {
            this.addElement(heroBackground, 0.3, 'vertical');
        }
        
        // Hero 로고
        const heroLogo = document.querySelector('.hero__logo');
        if (heroLogo) {
            this.addElement(heroLogo, 0.2, 'vertical');
        }
        
        // 섹션 배경들
        const sectionAlts = document.querySelectorAll('.section--alt');
        sectionAlts.forEach((section, index) => {
            this.addElement(section, 0.15 + (index * 0.05), 'vertical');
        });
        
        // 카드들에 미묘한 parallax 효과
        const cards = document.querySelectorAll('.event-info__card, .feature-card');
        cards.forEach((card, index) => {
            this.addElement(card, 0.05 + (index * 0.02), 'vertical', 'hover');
        });
        
        // Footer 배경
        const footer = document.querySelector('.footer');
        if (footer) {
            this.addElement(footer, 0.1, 'vertical');
        }
    }
    
    addElement(element, speed = 0.5, direction = 'vertical', trigger = 'scroll') {
        if (this.elements.length >= this.settings.maxElements) {
            return;
        }
        
        const parallaxElement = {
            element,
            speed,
            direction,
            trigger,
            initialY: 0,
            initialX: 0,
            currentY: 0,
            currentX: 0,
            inView: false,
            rect: null
        };
        
        // Intersection Observer로 뷰포트 내 요소만 추적
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                parallaxElement.inView = entry.isIntersecting;
                if (entry.isIntersecting) {
                    parallaxElement.rect = entry.boundingClientRect;
                }
            });
        }, {
            threshold: this.settings.threshold,
            rootMargin: '50px'
        });
        
        observer.observe(element);
        parallaxElement.observer = observer;
        
        this.elements.push(parallaxElement);
        
        // 초기 위치 설정
        this.setInitialPosition(parallaxElement);
    }
    
    setInitialPosition(parallaxElement) {
        const { element } = parallaxElement;
        
        // GPU 가속을 위한 transform3d 준비
        if (this.settings.enableTransform3d) {
            element.style.willChange = 'transform';
            element.style.transform = 'translate3d(0, 0, 0)';
        }
        
        // 백페이스 가시성 숨기기 (성능 개선)
        element.style.backfaceVisibility = 'hidden';
        element.style.perspective = '1000px';
    }
    
    bindEvents() {
        // 스크롤 이벤트 (throttled)
        window.addEventListener('scroll', () => {
            this.scrollTop = window.pageYOffset;
            this.requestTick();
        }, { passive: true });
        
        // 리사이즈 이벤트
        window.addEventListener('resize', () => {
            this.windowHeight = window.innerHeight;
            this.updateElementRects();
        }, { passive: true });
        
        // 마우스 무브 이벤트 (호버 parallax용)
        document.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e);
        }, { passive: true });
    }
    
    requestTick() {
        if (!this.ticking) {
            if (this.settings.rafThrottle) {
                requestAnimationFrame(() => this.update());
            } else {
                this.update();
            }
        }
        this.ticking = true;
    }
    
    update() {
        this.elements.forEach(parallaxElement => {
            if (parallaxElement.inView) {
                this.updateElement(parallaxElement);
            }
        });
        
        this.ticking = false;
    }
    
    updateElement(parallaxElement) {
        const { element, speed, direction, trigger } = parallaxElement;
        
        if (trigger === 'scroll') {
            this.updateScrollParallax(parallaxElement);
        } else if (trigger === 'hover') {
            this.updateHoverParallax(parallaxElement);
        }
    }
    
    updateScrollParallax(parallaxElement) {
        const { element, speed, direction } = parallaxElement;
        
        // 요소의 현재 위치 계산
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + this.scrollTop;
        const elementHeight = rect.height;
        
        // 뷰포트 내에서의 상대적 위치 (0-1)
        const scrollProgress = (this.scrollTop - elementTop + this.windowHeight) / 
                              (this.windowHeight + elementHeight);
        
        // 시차 오프셋 계산
        let translateY = 0;
        let translateX = 0;
        
        if (direction === 'vertical') {
            translateY = (scrollProgress - 0.5) * speed * 100;
        } else if (direction === 'horizontal') {
            translateX = (scrollProgress - 0.5) * speed * 100;
        } else if (direction === 'both') {
            translateY = (scrollProgress - 0.5) * speed * 50;
            translateX = (scrollProgress - 0.5) * speed * 25;
        }
        
        // 부드러운 보간
        parallaxElement.currentY += (translateY - parallaxElement.currentY) * this.settings.smoothing;
        parallaxElement.currentX += (translateX - parallaxElement.currentX) * this.settings.smoothing;
        
        // 소수점 정밀도 제한 (성능 최적화)
        const finalY = Math.round(parallaxElement.currentY * this.settings.precision) / this.settings.precision;
        const finalX = Math.round(parallaxElement.currentX * this.settings.precision) / this.settings.precision;
        
        // Transform 적용
        this.applyTransform(element, finalX, finalY);
    }
    
    updateHoverParallax(parallaxElement) {
        // 호버 기반 parallax는 마우스 무브 이벤트에서 처리됨
    }
    
    handleMouseMove(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        this.elements.forEach(parallaxElement => {
            if (parallaxElement.trigger === 'hover' && parallaxElement.inView) {
                const { element, speed } = parallaxElement;
                const rect = element.getBoundingClientRect();
                
                // 마우스와 요소 중심의 상대적 거리
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = (mouseX - centerX) / rect.width;
                const deltaY = (mouseY - centerY) / rect.height;
                
                // 호버 영역 내에서만 효과 적용
                if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
                    const translateX = deltaX * speed * 20;
                    const translateY = deltaY * speed * 10;
                    
                    this.applyTransform(element, translateX, translateY, 0.2);
                } else {
                    // 마우스가 벗어나면 원위치
                    this.applyTransform(element, 0, 0, 0.3);
                }
            }
        });
    }
    
    applyTransform(element, x, y, duration = 0) {
        if (this.settings.enableTransform3d) {
            element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        } else {
            element.style.transform = `translate(${x}px, ${y}px)`;
        }
        
        if (duration > 0) {
            element.style.transition = `transform ${duration}s ease-out`;
        } else {
            element.style.transition = '';
        }
    }
    
    updateElementRects() {
        this.elements.forEach(parallaxElement => {
            if (parallaxElement.inView) {
                parallaxElement.rect = parallaxElement.element.getBoundingClientRect();
            }
        });
    }
    
    // 동적으로 요소 추가/제거
    addElementDynamic(selector, speed = 0.5, direction = 'vertical', trigger = 'scroll') {
        const element = document.querySelector(selector);
        if (element) {
            this.addElement(element, speed, direction, trigger);
            return true;
        }
        return false;
    }
    
    removeElement(element) {
        const index = this.elements.findIndex(pe => pe.element === element);
        if (index !== -1) {
            const parallaxElement = this.elements[index];
            if (parallaxElement.observer) {
                parallaxElement.observer.disconnect();
            }
            
            // 스타일 초기화
            element.style.transform = '';
            element.style.willChange = '';
            element.style.transition = '';
            
            this.elements.splice(index, 1);
            return true;
        }
        return false;
    }
    
    // 일시정지/재개
    pause() {
        this.isEnabled = false;
        this.elements.forEach(pe => {
            pe.element.style.transform = '';
        });
    }
    
    resume() {
        if (this.shouldEnable()) {
            this.isEnabled = true;
            this.update();
        }
    }
    
    destroy() {
        this.elements.forEach(parallaxElement => {
            const { element, observer } = parallaxElement;
            
            // Observer 해제
            if (observer) {
                observer.disconnect();
            }
            
            // 스타일 초기화
            element.style.transform = '';
            element.style.willChange = '';
            element.style.backfaceVisibility = '';
            element.style.perspective = '';
            element.style.transition = '';
        });
        
        this.elements = [];
        
        // 이벤트 리스너 제거는 여기서는 생략 (메모리 누수 방지를 위해 실제로는 구현 필요)
        
        console.log('🌊 Parallax Scrolling 비활성화');
    }
}

// 전역 접근을 위한 내보내기
window.ParallaxScrollSystem = ParallaxScrollSystem;
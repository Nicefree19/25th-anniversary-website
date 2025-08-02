/**
 * Premium Effects Manager
 * 프리미엄 효과 통합 관리 시스템 - 국내 최고 웹디자이너 수준
 */

class PremiumEffectsManager {
    constructor() {
        this.effects = new Map();
        this.isInitialized = false;
        this.performanceMonitor = new PerformanceMonitor();
        this.settings = this.getOptimalSettings();
        
        this.init();
    }
    
    getOptimalSettings() {
        const isMobile = window.innerWidth <= 768;
        const isLowPowerMode = this.detectLowPowerMode();
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return {
            enableParticles: !prefersReducedMotion && !isLowPowerMode,
            enableAdvancedEffects: !isMobile && !isLowPowerMode,
            performanceLevel: isLowPowerMode ? 'minimal' : (isMobile ? 'medium' : 'high'),
            adaptiveQuality: true
        };
    }
    
    detectLowPowerMode() {
        // 배터리 API 또는 성능 힌트로 저전력 모드 감지
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                if (battery.charging === false && battery.level < 0.2) {
                    this.settings.performanceLevel = 'minimal';
                }
            });
        }
        
        // 하드웨어 동시성으로 성능 추정
        const cores = navigator.hardwareConcurrency || 4;
        return cores < 4;
    }
    
    async init() {
        if (this.isInitialized) return;
        
        console.log('🍂 Premium Effects Manager 초기화 중...');
        
        try {
            // 성능 모니터링 시작
            this.performanceMonitor.start();
            
            // 낙엽 파티클 시스템 초기화
            await this.initParticleSystem();
            
            // 커스텀 커서 초기화
            await this.initCustomCursor();
            
            // 시차 스크롤 초기화
            await this.initParallaxScrolling();
            
            // 고급 타이포그래피 애니메이션 초기화
            await this.initTypographyAnimations();
            
            // 마이크로 인터랙션 시스템 초기화
            await this.initMicroInteractions();
            
            this.isInitialized = true;
            
            // 성능 적응형 품질 조정
            if (this.settings.adaptiveQuality) {
                this.startAdaptiveQualityMonitoring();
            }
            
            console.log('✅ Premium Effects Manager 초기화 완료');
            
        } catch (error) {
            console.error('❌ Premium Effects 초기화 실패:', error);
            this.fallbackMode();
        }
    }
    
    async initParticleSystem() {
        const canvas = document.getElementById('leafCanvas');
        if (!canvas) {
            console.warn('Leaf canvas not found');
            return;
        }
        
        if (this.settings.enableParticles) {
            const particleSystem = new AutumnLeafParticleSystem(canvas);
            this.effects.set('particles', particleSystem);
            
            // Intersection Observer로 뷰포트 기반 활성화
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        particleSystem.start();
                    } else {
                        particleSystem.stop();
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(canvas);
            
            console.log('🍃 낙엽 파티클 시스템 활성화');
        } else {
            canvas.style.display = 'none';
            console.log('⚡ 파티클 시스템 비활성화 (성능 최적화)');
        }
    }
    
    async initCustomCursor() {
        if (this.settings.enableAdvancedEffects) {
            const cursor = new CustomCursor();
            this.effects.set('cursor', cursor);
            console.log('🎯 커스텀 커서 활성화');
        } else {
            console.log('⚡ 커스텀 커서 비활성화 (모바일/터치 디바이스)');
        }
    }
    
    async initParallaxScrolling() {
        if (this.settings.enableAdvancedEffects) {
            const parallax = new ParallaxScrollSystem();
            this.effects.set('parallax', parallax);
            console.log('🌊 시차 스크롤 활성화');
        } else {
            console.log('⚡ 시차 스크롤 비활성화 (성능 최적화)');
        }
    }
    
    async initTypographyAnimations() {
        const typography = new TypographyAnimationSystem();
        this.effects.set('typography', typography);
        console.log('✨ 타이포그래피 애니메이션 활성화');
    }
    
    async initMicroInteractions() {
        if (this.settings.enableAdvancedEffects) {
            const microInteractions = new MicroInteractionsSystem();
            this.effects.set('microInteractions', microInteractions);
            console.log('⚡ 마이크로 인터랙션 활성화');
        } else {
            console.log('⚡ 마이크로 인터랙션 비활성화 (모바일/성능 최적화)');
        }
    }
    
    startAdaptiveQualityMonitoring() {
        setInterval(() => {
            const fps = this.performanceMonitor.getCurrentFPS();
            const memoryUsage = this.performanceMonitor.getMemoryUsage();
            
            // 성능이 떨어지면 품질 자동 조정
            if (fps < 30 || memoryUsage > 80) {
                this.adjustQuality('down');
            } else if (fps > 55 && memoryUsage < 50) {
                this.adjustQuality('up');
            }
        }, 2000);
    }
    
    adjustQuality(direction) {
        const particleSystem = this.effects.get('particles');
        if (!particleSystem) return;
        
        if (direction === 'down') {
            // 성능 저하시 품질 감소
            particleSystem.settings.particleCount = Math.max(5, particleSystem.settings.particleCount - 3);
            particleSystem.settings.spawnRate *= 0.8;
            console.log('📉 품질 자동 조정: 성능 우선 모드');
        } else if (direction === 'up' && this.settings.performanceLevel === 'high') {
            // 성능 여유시 품질 증가
            particleSystem.settings.particleCount = Math.min(50, particleSystem.settings.particleCount + 2);
            particleSystem.settings.spawnRate *= 1.1;
            console.log('📈 품질 자동 조정: 고품질 모드');
        }
    }
    
    fallbackMode() {
        // 오류 발생시 기본 모드로 전환
        this.settings.enableParticles = false;
        this.settings.enableAdvancedEffects = false;
        
        // 모든 고급 효과 비활성화
        this.effects.forEach((effect, name) => {
            try {
                if (effect.destroy) effect.destroy();
                if (effect.stop) effect.stop();
            } catch (e) {
                console.warn(`Effect ${name} cleanup failed:`, e);
            }
        });
        
        this.effects.clear();
        console.log('🔧 Fallback 모드 활성화 - 기본 기능만 동작');
    }
    
    // 외부에서 효과 제어 가능한 메서드들
    pauseAllEffects() {
        this.effects.forEach(effect => {
            if (effect.stop) effect.stop();
        });
    }
    
    resumeAllEffects() {
        this.effects.forEach(effect => {
            if (effect.start) effect.start();
        });
    }
    
    toggleEffect(effectName) {
        const effect = this.effects.get(effectName);
        if (effect) {
            if (effect.isRunning) {
                effect.stop();
            } else {
                effect.start();
            }
        }
    }
    
    getPerformanceStats() {
        return {
            fps: this.performanceMonitor.getCurrentFPS(),
            memory: this.performanceMonitor.getMemoryUsage(),
            activeEffects: Array.from(this.effects.keys()),
            performanceLevel: this.settings.performanceLevel,
            deviceInfo: this.getDeviceInfo(),
            accessibilitySettings: this.getAccessibilitySettings()
        };
    }
    
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
            deviceMemory: navigator.deviceMemory || 'unknown',
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink
            } : 'unknown',
            touchSupport: 'ontouchstart' in window,
            screenSize: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`
        };
    }
    
    getAccessibilitySettings() {
        return {
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
            prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            fontSize: window.getComputedStyle(document.documentElement).fontSize,
            colorGamut: window.matchMedia('(color-gamut: p3)').matches ? 'p3' : 'srgb'
        };
    }
    
    // 접근성 준수 검증
    validateAccessibility() {
        const issues = [];
        
        // 대비율 검증 (간단한 예시)
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--color-primary');
        const backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--color-background');
        
        // ARIA 속성 검증
        const interactiveElements = document.querySelectorAll('button, a, [role="button"]');
        interactiveElements.forEach(element => {
            if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
                issues.push(`Interactive element missing accessible label: ${element.tagName}`);
            }
        });
        
        // 키보드 접근성 검증
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
        focusableElements.forEach(element => {
            const tabIndex = element.getAttribute('tabindex');
            if (tabIndex && parseInt(tabIndex) > 0) {
                issues.push(`Element has positive tabindex which disrupts natural tab order: ${element.tagName}`);
            }
        });
        
        return {
            isAccessible: issues.length === 0,
            issues,
            wcagLevel: issues.length === 0 ? 'AA' : 'Below AA'
        };
    }
    
    // 성능 벤치마크
    async runPerformanceBenchmark() {
        const benchmark = {
            timestamp: Date.now(),
            tests: {}
        };
        
        // DOM 조작 성능 테스트
        const domStart = performance.now();
        for (let i = 0; i < 1000; i++) {
            const div = document.createElement('div');
            div.style.transform = `translateX(${i}px)`;
            div.style.opacity = Math.random();
        }
        benchmark.tests.domManipulation = performance.now() - domStart;
        
        // CSS 애니메이션 성능 테스트
        const animStart = performance.now();
        const testElement = document.createElement('div');
        testElement.style.cssText = `
            position: fixed;
            top: -100px;
            left: -100px;
            width: 100px;
            height: 100px;
            background: red;
            transition: transform 0.5s ease;
        `;
        document.body.appendChild(testElement);
        
        testElement.style.transform = 'translateX(100px)';
        
        setTimeout(() => {
            benchmark.tests.cssAnimation = performance.now() - animStart;
            document.body.removeChild(testElement);
        }, 100);
        
        // Canvas 성능 테스트 (파티클 시스템용)
        const canvasStart = performance.now();
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        
        for (let i = 0; i < 1000; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 200, Math.random() * 200, 5, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${Math.random() * 360}, 50%, 50%)`;
            ctx.fill();
        }
        benchmark.tests.canvasRendering = performance.now() - canvasStart;
        
        return benchmark;
    }
    
    destroy() {
        this.fallbackMode();
        this.performanceMonitor.stop();
        this.isInitialized = false;
    }
}

/**
 * Performance Monitor
 * 성능 모니터링 및 최적화 클래스
 */
class PerformanceMonitor {
    constructor() {
        this.fps = 60;
        this.frameCount = 0;
        this.lastTime = 0;
        this.isRunning = false;
        this.memoryUsage = 0;
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        this.measure();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    measure() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        this.frameCount++;
        
        // FPS 계산 (1초마다)
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // 메모리 사용량 체크 (가능한 경우)
            if (performance.memory) {
                this.memoryUsage = Math.round(
                    (performance.memory.usedJSHeapSize / performance.memory.totalJSHeapSize) * 100
                );
            }
        }
        
        requestAnimationFrame(() => this.measure());
    }
    
    getCurrentFPS() {
        return this.fps;
    }
    
    getMemoryUsage() {
        return this.memoryUsage;
    }
}

// DOM 로드 완료시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 약간의 지연으로 다른 스크립트들이 로드된 후 실행
    setTimeout(() => {
        window.premiumEffectsManager = new PremiumEffectsManager();
    }, 100);
});

// 개발자 도구용 전역 접근
window.PremiumEffectsManager = PremiumEffectsManager;

// 개발자 콘솔 유틸리티 함수들
window.checkPremiumEffects = () => {
    if (window.premiumEffectsManager) {
        console.group('🎨 Premium Effects 상태');
        console.log('📊 성능 통계:', window.premiumEffectsManager.getPerformanceStats());
        console.log('♿ 접근성 검증:', window.premiumEffectsManager.validateAccessibility());
        console.groupEnd();
    } else {
        console.warn('Premium Effects Manager가 초기화되지 않았습니다.');
    }
};

window.runEffectsBenchmark = async () => {
    if (window.premiumEffectsManager) {
        console.log('🚀 성능 벤치마크 실행 중...');
        const results = await window.premiumEffectsManager.runPerformanceBenchmark();
        console.group('📈 벤치마크 결과');
        console.table(results.tests);
        console.groupEnd();
        return results;
    } else {
        console.warn('Premium Effects Manager가 초기화되지 않았습니다.');
    }
};

window.togglePremiumEffects = (effectName) => {
    if (window.premiumEffectsManager) {
        if (effectName) {
            window.premiumEffectsManager.toggleEffect(effectName);
            console.log(`🎛️ ${effectName} 효과 토글됨`);
        } else {
            console.log('사용 가능한 효과:', Array.from(window.premiumEffectsManager.effects.keys()));
        }
    }
};

// 초기화 완료 후 개발자 가이드 출력
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.premiumEffectsManager?.isInitialized) {
            console.group('🎨 Premium Effects - 개발자 가이드');
            console.log('사용 가능한 콘솔 명령어:');
            console.log('• checkPremiumEffects() - 현재 상태 확인');
            console.log('• runEffectsBenchmark() - 성능 벤치마크 실행');
            console.log('• togglePremiumEffects(name) - 특정 효과 토글');
            console.log('• togglePremiumEffects() - 사용 가능한 효과 목록');
            console.groupEnd();
        }
    }, 2000);
});
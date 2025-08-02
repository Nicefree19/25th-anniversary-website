/**
 * Premium Typography Animation System
 * 고급 타이포그래피 애니메이션 시스템 - 국내 최고 웹디자이너 수준
 */

class TypographyAnimationSystem {
    constructor() {
        this.isEnabled = this.shouldEnable();
        this.animatedElements = new Map();
        this.settings = this.getOptimalSettings();
        
        if (this.isEnabled) {
            this.init();
        }
    }
    
    shouldEnable() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return !prefersReducedMotion;
    }
    
    getOptimalSettings() {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        return {
            characterDelay: 50,
            wordDelay: 150,
            lineDelay: 300,
            typingSpeed: 80,
            glitchIntensity: isDarkMode ? 0.3 : 0.2,
            colors: {
                primary: isDarkMode ? '#F97316' : '#D2691E',
                secondary: isDarkMode ? '#FBBF24' : '#F4A460',
                accent: isDarkMode ? '#10B981' : '#8FBC8F',
                glow: isDarkMode ? 'rgba(249, 115, 22, 0.8)' : 'rgba(210, 105, 30, 0.6)'
            }
        };
    }
    
    init() {
        this.setupAnimations();
        this.setupObservers();
        
        // 다크모드 변경 감지
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                this.settings = this.getOptimalSettings();
                this.updateColors();
            });
        
        console.log('✨ Typography Animations 활성화');
    }
    
    setupAnimations() {
        // 메인 타이틀 특별 효과
        this.animateMainTitle();
        
        // 서브타이틀 타이핑 효과
        this.animateSubtitle();
        
        // 섹션 타이틀들 순차 등장
        this.animateSectionTitles();
        
        // 카드 타이틀들 글리치 호버 효과
        this.setupHoverEffects();
        
        // 카운트다운 숫자 애니메이션
        this.animateCountdown();
    }
    
    animateMainTitle() {
        const titleElement = document.querySelector('.hero__title');
        if (!titleElement) return;
        
        const text = titleElement.textContent;
        titleElement.innerHTML = '';
        
        // 각 글자를 span으로 감싸기
        const chars = text.split('').map((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.className = 'title-char';
            span.style.cssText = `
                display: inline-block;
                opacity: 0;
                transform: translateY(50px) rotateX(-90deg);
                animation-delay: ${index * this.settings.characterDelay}ms;
                position: relative;
            `;
            return span;
        });
        
        chars.forEach(char => titleElement.appendChild(char));
        
        // CSS 애니메이션 정의
        this.addTitleStyles();
        
        // Intersection Observer로 뷰포트 진입시 애니메이션 시작
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.startTitleAnimation(titleElement);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(titleElement);
    }
    
    addTitleStyles() {
        const styles = `
            .title-char {
                animation: titleCharAppear 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
                filter: drop-shadow(0 0 10px ${this.settings.colors.glow});
            }
            
            .title-char:hover {
                animation: titleCharHover 0.3s ease-in-out;
                color: ${this.settings.colors.accent};
            }
            
            @keyframes titleCharAppear {
                to {
                    opacity: 1;
                    transform: translateY(0) rotateX(0deg);
                }
            }
            
            @keyframes titleCharHover {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1) translateY(-5px); }
            }
            
            .title-glow {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, 
                    ${this.settings.colors.primary}, 
                    ${this.settings.colors.secondary});
                background-size: 200% 200%;
                background-clip: text;
                -webkit-background-clip: text;
                color: transparent;
                animation: titleGlow 3s ease-in-out infinite;
            }
            
            @keyframes titleGlow {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            }
        `;
        
        this.addStyleSheet('title-animations', styles);
    }
    
    startTitleAnimation(titleElement) {
        const chars = titleElement.querySelectorAll('.title-char');
        
        // 순차적으로 애니메이션 시작
        chars.forEach((char, index) => {
            setTimeout(() => {
                char.style.animationPlayState = 'running';
                
                // 특별한 글자들에 추가 효과
                if (char.textContent === '2' || char.textContent === '5') {
                    this.addSpecialNumberEffect(char);
                }
            }, index * this.settings.characterDelay);
        });
        
        // 전체 애니메이션 완료 후 글로우 효과 추가
        setTimeout(() => {
            this.addTitleGlowEffect(titleElement);
        }, chars.length * this.settings.characterDelay + 500);
    }
    
    addSpecialNumberEffect(char) {
        const glowDiv = document.createElement('div');
        glowDiv.className = 'title-glow';
        glowDiv.textContent = char.textContent;
        char.style.position = 'relative';
        char.appendChild(glowDiv);
    }
    
    addTitleGlowEffect(titleElement) {
        titleElement.style.textShadow = `
            0 0 10px ${this.settings.colors.primary},
            0 0 20px ${this.settings.colors.primary},
            0 0 30px ${this.settings.colors.primary}
        `;
        
        // 펄스 효과
        titleElement.style.animation = 'titlePulse 4s ease-in-out infinite';
        
        const pulseStyle = `
            @keyframes titlePulse {
                0%, 100% { 
                    text-shadow: 
                        0 0 10px ${this.settings.colors.primary},
                        0 0 20px ${this.settings.colors.primary},
                        0 0 30px ${this.settings.colors.primary};
                }
                50% { 
                    text-shadow: 
                        0 0 20px ${this.settings.colors.primary},
                        0 0 30px ${this.settings.colors.primary},
                        0 0 40px ${this.settings.colors.primary};
                }
            }
        `;
        this.addStyleSheet('title-pulse', pulseStyle);
    }
    
    animateSubtitle() {
        const subtitleElement = document.querySelector('.hero__subtitle');
        if (!subtitleElement) return;
        
        const text = subtitleElement.textContent;
        subtitleElement.innerHTML = '';
        
        // 타이핑 효과 준비
        let currentIndex = 0;
        const typewriter = () => {
            if (currentIndex < text.length) {
                subtitleElement.textContent += text[currentIndex];
                currentIndex++;
                setTimeout(typewriter, this.settings.typingSpeed);
            } else {
                // 타이핑 완료 후 커서 깜박임
                this.addTypingCursor(subtitleElement);
            }
        };
        
        // 뷰포트 진입시 시작
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typewriter, 1000); // 메인 타이틀 후 시작
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(subtitleElement);
    }
    
    addTypingCursor(element) {
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        cursor.textContent = '|';
        cursor.style.cssText = `
            animation: cursorBlink 1s infinite;
            color: ${this.settings.colors.primary};
            font-weight: bold;
        `;
        element.appendChild(cursor);
        
        const cursorStyle = `
            @keyframes cursorBlink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        this.addStyleSheet('typing-cursor', cursorStyle);
        
        // 3초 후 커서 제거
        setTimeout(() => {
            if (cursor.parentNode) {
                cursor.remove();
            }
        }, 3000);
    }
    
    animateSectionTitles() {
        const sectionTitles = document.querySelectorAll('.section__title');
        
        sectionTitles.forEach((title, index) => {
            // 단어별 분할
            const words = title.textContent.split(' ');
            title.innerHTML = '';
            
            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'section-title-word';
                wordSpan.textContent = word;
                wordSpan.style.cssText = `
                    display: inline-block;
                    opacity: 0;
                    transform: translateY(30px);
                    margin-right: 0.25em;
                `;
                title.appendChild(wordSpan);
            });
            
            // Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateWordsSequentially(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.7 });
            
            observer.observe(title);
        });
        
        // 섹션 타이틀 애니메이션 스타일
        const sectionTitleStyle = `
            .section-title-word {
                transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            }
            
            .section-title-word.animate {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        this.addStyleSheet('section-titles', sectionTitleStyle);
    }
    
    animateWordsSequentially(titleElement) {
        const words = titleElement.querySelectorAll('.section-title-word');
        
        words.forEach((word, index) => {
            setTimeout(() => {
                word.classList.add('animate');
            }, index * this.settings.wordDelay);
        });
    }
    
    setupHoverEffects() {
        const cardTitles = document.querySelectorAll(
            '.event-info__title, .feature-card__title, .game-card__title'
        );
        
        cardTitles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                this.createGlitchEffect(title);
            });
        });
    }
    
    createGlitchEffect(element) {
        const text = element.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let iterations = 0;
        const maxIterations = 10;
        
        const glitch = () => {
            if (iterations < maxIterations) {
                element.textContent = text
                    .split('')
                    .map(char => {
                        if (Math.random() < this.settings.glitchIntensity) {
                            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        }
                        return char;
                    })
                    .join('');
                
                iterations++;
                setTimeout(glitch, 50);
            } else {
                element.textContent = text;
            }
        };
        
        glitch();
    }
    
    animateCountdown() {
        const countdownValues = document.querySelectorAll('.countdown__value');
        
        countdownValues.forEach(value => {
            value.style.fontFeatureSettings = '"tnum"'; // Tabular numbers
            value.style.transition = 'transform 0.3s ease, color 0.3s ease';
            
            // 숫자 변경시 애니메이션
            const observer = new MutationObserver(() => {
                value.style.transform = 'scale(1.1)';
                value.style.color = this.settings.colors.primary;
                
                setTimeout(() => {
                    value.style.transform = 'scale(1)';
                    value.style.color = '';
                }, 200);
            });
            
            observer.observe(value, { childList: true, characterData: true });
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
    
    updateColors() {
        // 다크모드 변경시 색상 업데이트
        this.addTitleStyles();
        
        // 기존 애니메이션 요소들 색상 업데이트
        const titleChars = document.querySelectorAll('.title-char');
        titleChars.forEach(char => {
            char.style.filter = `drop-shadow(0 0 10px ${this.settings.colors.glow})`;
        });
    }
    
    // 외부에서 사용할 수 있는 메서드들
    animateElement(element, type = 'fadeInUp') {
        if (!this.isEnabled) return;
        
        switch (type) {
            case 'fadeInUp':
                this.fadeInUpAnimation(element);
                break;
            case 'typewriter':
                this.typewriterAnimation(element);
                break;
            case 'glitch':
                this.createGlitchEffect(element);
                break;
        }
    }
    
    fadeInUpAnimation(element) {
        element.style.cssText = `
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        `;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }
    
    typewriterAnimation(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let index = 0;
        const type = () => {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(type, this.settings.typingSpeed);
            }
        };
        type();
    }
    
    destroy() {
        // 모든 애니메이션 정리
        const styleSheets = document.querySelectorAll(
            '#title-animations, #title-pulse, #typing-cursor, #section-titles'
        );
        styleSheets.forEach(sheet => sheet.remove());
        
        this.animatedElements.clear();
        
        console.log('✨ Typography Animations 비활성화');
    }
}

// 전역 접근을 위한 내보내기
window.TypographyAnimationSystem = TypographyAnimationSystem;
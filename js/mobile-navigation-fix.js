/**
 * Enhanced Mobile Navigation System
 * 모바일 환경 완전 호환 네비게이션 시스템
 */

class EnhancedMobileNavigation {
    constructor() {
        this.isInitialized = false;
        this.mobileNavOpen = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.settings = {
            enableSwipeGestures: true,
            enableTouchFeedback: true,
            adaptToScreenSize: true,
            debugMode: false
        };
        
        this.init();
    }
    
    init() {
        if (this.isInitialized) return;
        
        this.detectCurrentPage();
        this.enhanceMobileNavigation();
        this.setupTouchEvents();
        this.setupAccessibility();
        this.setupResponsiveHandling();
        
        this.isInitialized = true;
        
        if (this.settings.debugMode) {
            console.log('📱 Enhanced Mobile Navigation 초기화 완료');
        }
    }
    
    detectCurrentPage() {
        // 현재 페이지 경로 감지
        const path = window.location.pathname;
        const isSubPage = path.includes('/pages/');
        
        this.pathConfig = {
            isSubPage,
            basePath: isSubPage ? '../' : './',
            currentPage: path.split('/').pop() || 'index.html'
        };
        
        if (this.settings.debugMode) {
            console.log('🗂️ Page Detection:', this.pathConfig);
        }
    }
    
    enhanceMobileNavigation() {
        // 기존 모바일 네비게이션 개선
        this.fixMobileMenuLinks();
        this.enhanceMenuButton();
        this.addTouchFeedback();
        this.improveClosingMechanisms();
    }
    
    fixMobileMenuLinks() {
        const mobileLinks = document.querySelectorAll('.mobile-nav__link');
        
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // 상대 경로로 수정
            let newHref;
            if (href === '/' || href === './index.html') {
                newHref = this.pathConfig.basePath + 'index.html';
            } else if (href.startsWith('/pages/')) {
                const pageName = href.replace('/pages/', '');
                newHref = this.pathConfig.isSubPage ? pageName : 'pages/' + pageName;
            } else if (href.startsWith('./pages/')) {
                const pageName = href.replace('./pages/', '');
                newHref = this.pathConfig.isSubPage ? pageName : 'pages/' + pageName;
            } else {
                newHref = href;
            }
            
            link.setAttribute('href', newHref);
            
            // 활성 상태 설정
            this.setActiveLinkState(link, newHref);
            
            // 클릭 이벤트 향상
            this.enhanceLinkClick(link);
        });
    }
    
    setActiveLinkState(link, href) {
        const currentPage = this.pathConfig.currentPage;
        
        // 현재 페이지와 링크 비교
        if (
            (currentPage === 'index.html' && (href.includes('index.html') || href === './')) ||
            (currentPage !== 'index.html' && href.includes(currentPage))
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    }
    
    enhanceLinkClick(link) {
        link.addEventListener('click', (e) => {
            // 터치 피드백
            if (this.settings.enableTouchFeedback) {
                this.addClickFeedback(link);
            }
            
            // 모바일 메뉴 자동 닫기
            setTimeout(() => {
                this.closeMobileNav();
            }, 150);
        });
        
        // 터치 이벤트 최적화
        link.addEventListener('touchstart', (e) => {
            link.classList.add('mobile-nav__link--touched');
        }, { passive: true });
        
        link.addEventListener('touchend', (e) => {
            setTimeout(() => {
                link.classList.remove('mobile-nav__link--touched');
            }, 200);
        }, { passive: true });
    }
    
    enhanceMenuButton() {
        const menuButton = document.getElementById('mobileMenuBtn');
        if (!menuButton) return;
        
        // 터치 영역 확장
        menuButton.style.cssText += `
            min-width: 44px;
            min-height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            touch-action: manipulation;
        `;
        
        // 더 나은 터치 피드백
        menuButton.addEventListener('touchstart', (e) => {
            menuButton.style.transform = 'scale(0.95)';
            menuButton.style.opacity = '0.8';
        }, { passive: true });
        
        menuButton.addEventListener('touchend', (e) => {
            setTimeout(() => {
                menuButton.style.transform = '';
                menuButton.style.opacity = '';
            }, 150);
        }, { passive: true });
    }
    
    addTouchFeedback() {
        const styles = `
            <style id="mobile-nav-touch-feedback">
                .mobile-nav__link--touched {
                    background-color: rgba(249, 115, 22, 0.1) !important;
                    transform: scale(0.98) !important;
                    transition: all 0.1s ease !important;
                }
                
                .mobile-nav__link {
                    -webkit-tap-highlight-color: transparent;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                }
                
                .mobile-menu-btn {
                    -webkit-tap-highlight-color: transparent;
                    touch-action: manipulation;
                }
                
                @media (max-width: 768px) {
                    .mobile-nav__link {
                        min-height: 48px;
                        display: flex;
                        align-items: center;
                        font-size: 16px;
                    }
                    
                    .mobile-nav__close {
                        min-width: 48px;
                        min-height: 48px;
                    }
                }
            </style>
        `;
        
        if (!document.getElementById('mobile-nav-touch-feedback')) {
            document.head.insertAdjacentHTML('beforeend', styles);
        }
    }
    
    addClickFeedback(element) {
        element.style.transform = 'scale(0.95)';
        element.style.opacity = '0.7';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.opacity = '';
        }, 100);
    }
    
    setupTouchEvents() {
        if (!this.settings.enableSwipeGestures) return;
        
        const mobileNav = document.getElementById('mobileNav');
        if (!mobileNav) return;
        
        // 스와이프로 메뉴 닫기
        mobileNav.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });
        
        mobileNav.addEventListener('touchmove', (e) => {
            // 가로 스와이프 방지 (세로 스크롤 허용)
            const currentX = e.touches[0].clientX;
            const diffX = Math.abs(currentX - this.touchStartX);
            
            if (diffX > 30) {
                e.preventDefault();
            }
        }, { passive: false });
        
        mobileNav.addEventListener('touchend', (e) => {
            this.touchEndY = e.changedTouches[0].clientY;
            this.touchEndX = e.changedTouches[0].clientX;
            
            const diffX = this.touchEndX - this.touchStartX;
            const diffY = Math.abs(this.touchEndY - this.touchStartY);
            
            // 오른쪽으로 스와이프시 메뉴 닫기
            if (diffX > 100 && diffY < 50) {
                this.closeMobileNav();
            }
        }, { passive: true });
    }
    
    improveClosingMechanisms() {
        const mobileNav = document.getElementById('mobileNav');
        const mobileNavClose = document.getElementById('mobileNavClose');
        
        if (mobileNav) {
            // 백드롭 클릭으로 닫기 개선
            mobileNav.addEventListener('click', (e) => {
                if (e.target === mobileNav || e.target.classList.contains('mobile-nav__backdrop')) {
                    this.closeMobileNav();
                }
            });
        }
        
        if (mobileNavClose) {
            // 닫기 버튼 터치 개선
            mobileNavClose.addEventListener('touchstart', (e) => {
                mobileNavClose.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
            }, { passive: true });
            
            mobileNavClose.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    mobileNavClose.style.backgroundColor = '';
                }, 150);
            }, { passive: true });
        }
    }
    
    setupAccessibility() {
        // 키보드 네비게이션 개선
        const mobileLinks = document.querySelectorAll('.mobile-nav__link');
        
        mobileLinks.forEach((link, index) => {
            // tabindex 설정
            link.setAttribute('tabindex', index + 1);
            
            // 키보드 이벤트
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });
        });
        
        // ESC 키로 메뉴 닫기 개선
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mobileNavOpen) {
                this.closeMobileNav();
                document.getElementById('mobileMenuBtn')?.focus();
            }
        });
    }
    
    setupResponsiveHandling() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
        
        // 방향 변경 감지
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 500);
        });
    }
    
    handleResize() {
        // 데스크톱 크기로 변경시 모바일 메뉴 자동 닫기
        if (window.innerWidth >= 1024 && this.mobileNavOpen) {
            this.closeMobileNav();
        }
        
        // 모바일 메뉴 크기 조정
        this.adjustMobileNavSize();
    }
    
    handleOrientationChange() {
        if (this.mobileNavOpen) {
            // 방향 변경시 메뉴 크기 재조정
            this.adjustMobileNavSize();
        }
    }
    
    adjustMobileNavSize() {
        const mobileNavContent = document.querySelector('.mobile-nav__content');
        if (!mobileNavContent) return;
        
        const screenWidth = window.innerWidth;
        const maxWidth = Math.min(screenWidth * 0.85, 320);
        
        mobileNavContent.style.width = maxWidth + 'px';
    }
    
    openMobileNav() {
        this.mobileNavOpen = true;
        const mobileNav = document.getElementById('mobileNav');
        const body = document.body;
        
        if (mobileNav) {
            mobileNav.classList.add('mobile-nav--open');
            
            // 애니메이션 개선
            mobileNav.style.display = 'block';
            requestAnimationFrame(() => {
                mobileNav.classList.add('mobile-nav--visible');
            });
        }
        
        if (body) {
            body.classList.add('mobile-nav-open');
            body.style.overflow = 'hidden';
        }
        
        // 포커스 관리
        const firstLink = document.querySelector('.mobile-nav__link');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 300);
        }
    }
    
    closeMobileNav() {
        this.mobileNavOpen = false;
        const mobileNav = document.getElementById('mobileNav');
        const body = document.body;
        
        if (mobileNav) {
            mobileNav.classList.remove('mobile-nav--visible');
            
            setTimeout(() => {
                mobileNav.classList.remove('mobile-nav--open');
                mobileNav.style.display = 'none';
            }, 300);
        }
        
        if (body) {
            body.classList.remove('mobile-nav-open');
            body.style.overflow = '';
        }
    }
    
    // 디버깅용 메서드
    debugInfo() {
        return {
            isInitialized: this.isInitialized,
            pathConfig: this.pathConfig,
            mobileNavOpen: this.mobileNavOpen,
            touchSupport: 'ontouchstart' in window,
            screenSize: `${window.innerWidth}x${window.innerHeight}`,
            userAgent: navigator.userAgent
        };
    }
    
    // 외부에서 호출 가능한 메서드들
    toggleMobileNav() {
        if (this.mobileNavOpen) {
            this.closeMobileNav();
        } else {
            this.openMobileNav();
        }
    }
    
    enableDebugMode() {
        this.settings.debugMode = true;
        console.log('🔧 Debug Mode 활성화');
        console.log('📱 Mobile Nav Debug Info:', this.debugInfo());
    }
    
    destroy() {
        // 모든 이벤트 리스너 제거 및 정리
        this.isInitialized = false;
        console.log('📱 Enhanced Mobile Navigation 정리 완료');
    }
}

// 기존 Navigation 시스템과 통합
document.addEventListener('DOMContentLoaded', () => {
    // 약간의 지연을 두고 초기화 (다른 스크립트들과의 충돌 방지)
    setTimeout(() => {
        window.enhancedMobileNav = new EnhancedMobileNavigation();
        
        // 기존 모바일 메뉴 버튼에 이벤트 연결
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                window.enhancedMobileNav.toggleMobileNav();
            });
        }
        
        // 기존 모바일 메뉴 닫기 버튼에 이벤트 연결
        const mobileNavClose = document.getElementById('mobileNavClose');
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', () => {
                window.enhancedMobileNav.closeMobileNav();
            });
        }
    }, 100);
});

// 개발자 도구용 전역 접근
window.EnhancedMobileNavigation = EnhancedMobileNavigation;
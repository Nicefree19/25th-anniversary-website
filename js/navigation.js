/**
 * Navigation JavaScript
 * 어린이도서연구회 은평지회 25주년 기념 웹사이트
 */

// Navigation Module
const Navigation = (function() {
    'use strict';
    
    // DOM Elements
    let mobileMenuBtn;
    let mobileNav;
    let mobileNavClose;
    let navLinks;
    let body;
    
    /**
     * Initialize Navigation
     */
    function init() {
        // Cache DOM elements
        mobileMenuBtn = document.getElementById('mobileMenuBtn');
        mobileNav = document.getElementById('mobileNav');
        mobileNavClose = document.getElementById('mobileNavClose');
        navLinks = document.querySelectorAll('.nav__link, .mobile-nav__link');
        body = document.body;
        
        // Set up event listeners
        setupEventListeners();
        
        // Set active navigation
        setActiveNavigation();
        
        // Initialize mobile navigation
        initializeMobileNav();
    }
    
    /**
     * Setup Event Listeners
     */
    function setupEventListeners() {
        // Mobile menu button click
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', openMobileNav);
        }
        
        // Mobile nav close button
        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeMobileNav);
        }
        
        // Mobile nav backdrop click
        if (mobileNav) {
            mobileNav.addEventListener('click', function(e) {
                if (e.target === mobileNav) {
                    closeMobileNav();
                }
            });
        }
        
        // ESC key to close mobile nav
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('open')) {
                closeMobileNav();
            }
        });
        
        // Window resize
        window.addEventListener('resize', debounce(handleResize, 250));
    }
    
    /**
     * Open Mobile Navigation
     */
    function openMobileNav() {
        if (!mobileNav || !body) return;
        
        mobileNav.classList.add('open');
        body.classList.add('mobile-nav-open');
        
        // Animate menu icon
        animateMenuIcon(true);
        
        // Focus management
        mobileNavClose.focus();
        
        // Trap focus
        trapFocus(mobileNav);
    }
    
    /**
     * Close Mobile Navigation
     */
    function closeMobileNav() {
        if (!mobileNav || !body) return;
        
        mobileNav.classList.remove('open');
        body.classList.remove('mobile-nav-open');
        
        // Animate menu icon
        animateMenuIcon(false);
        
        // Return focus to menu button
        mobileMenuBtn.focus();
        
        // Release focus trap
        releaseFocusTrap();
    }
    
    /**
     * Animate Menu Icon
     */
    function animateMenuIcon(isOpen) {
        if (!mobileMenuBtn) return;
        
        const icon = mobileMenuBtn.querySelector('svg');
        if (!icon) return;
        
        if (isOpen) {
            icon.innerHTML = `
                <line x1="18" y1="6" x2="6" y2="18" class="animate-fade-in"/>
                <line x1="6" y1="6" x2="18" y2="18" class="animate-fade-in"/>
            `;
        } else {
            icon.innerHTML = `
                <line x1="3" y1="6" x2="21" y2="6" class="animate-fade-in"/>
                <line x1="3" y1="12" x2="21" y2="12" class="animate-fade-in"/>
                <line x1="3" y1="18" x2="21" y2="18" class="animate-fade-in"/>
            `;
        }
    }
    
    /**
     * Set Active Navigation
     */
    function setActiveNavigation() {
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
            } else if (currentPath.includes(href) && href !== '/') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Initialize Mobile Navigation
     */
    function initializeMobileNav() {
        if (!mobileNav) return;
        
        // Create mobile nav if it doesn't exist
        if (!document.querySelector('.mobile-nav')) {
            createMobileNav();
        }
        
        // Add styles
        addMobileNavStyles();
    }
    
    /**
     * Create Mobile Navigation
     */
    function createMobileNav() {
        const mobileNavHTML = `
            <nav class="mobile-nav" id="mobileNav">
                <div class="mobile-nav__backdrop"></div>
                <div class="mobile-nav__content">
                    <div class="mobile-nav__header">
                        <span class="mobile-nav__title">메뉴</span>
                        <button class="mobile-nav__close" id="mobileNavClose" aria-label="메뉴 닫기">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>
                    <div class="mobile-nav__body">
                        <a href="/" class="mobile-nav__link">홈</a>
                        <a href="/pages/about.html" class="mobile-nav__link">소개</a>
                        <a href="/pages/history.html" class="mobile-nav__link">25년 역사</a>
                        <a href="/pages/event.html" class="mobile-nav__link">행사 안내</a>
                        <a href="/pages/program.html" class="mobile-nav__link">프로그램</a>
                        <a href="/pages/gallery.html" class="mobile-nav__link">갤러리</a>
                        <a href="/pages/register.html" class="mobile-nav__link">참가 신청</a>
                    </div>
                </div>
            </nav>
        `;
        
        document.body.insertAdjacentHTML('beforeend', mobileNavHTML);
        
        // Re-cache elements
        mobileNav = document.getElementById('mobileNav');
        mobileNavClose = document.getElementById('mobileNavClose');
    }
    
    /**
     * Add Mobile Navigation Styles
     */
    function addMobileNavStyles() {
        if (document.getElementById('mobile-nav-styles')) return;
        
        const styles = `
            <style id="mobile-nav-styles">
                .mobile-nav {
                    display: none;
                    position: fixed;
                    inset: 0;
                    z-index: var(--z-modal, 50);
                }
                
                .mobile-nav.open {
                    display: block;
                }
                
                .mobile-nav__backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    animation: fade-in 0.3s ease-out;
                }
                
                .mobile-nav__content {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    width: 80%;
                    max-width: 320px;
                    background: white;
                    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
                    animation: slide-left 0.3s ease-out;
                    display: flex;
                    flex-direction: column;
                }
                
                .mobile-nav__header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1.5rem;
                    border-bottom: 1px solid #e1e8ed;
                }
                
                .mobile-nav__title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #2c3e50;
                }
                
                .mobile-nav__close {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    transition: background-color 0.3s ease;
                }
                
                .mobile-nav__close:hover {
                    background-color: #f8f9fa;
                }
                
                .mobile-nav__body {
                    flex: 1;
                    padding: 1.5rem;
                    overflow-y: auto;
                }
                
                .mobile-nav__link {
                    display: block;
                    padding: 1rem;
                    color: #5a6c7d;
                    text-decoration: none;
                    font-weight: 500;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    margin-bottom: 0.5rem;
                }
                
                .mobile-nav__link:hover {
                    background-color: #f8f9fa;
                    color: #ff6b6b;
                    transform: translateX(4px);
                }
                
                .mobile-nav__link.active {
                    background-color: #ffe5e5;
                    color: #ff6b6b;
                }
                
                body.mobile-nav-open {
                    overflow: hidden;
                }
                
                @keyframes slide-left {
                    from {
                        transform: translateX(100%);
                    }
                    to {
                        transform: translateX(0);
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    /**
     * Handle Window Resize
     */
    function handleResize() {
        // Close mobile nav on desktop
        if (window.innerWidth >= 1024 && mobileNav && mobileNav.classList.contains('open')) {
            closeMobileNav();
        }
    }
    
    /**
     * Focus Trap
     */
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;
    
    function trapFocus(container) {
        focusableElements = container.querySelectorAll(
            'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
        
        container.addEventListener('keydown', handleFocusTrap);
    }
    
    function handleFocusTrap(e) {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    }
    
    function releaseFocusTrap() {
        if (mobileNav) {
            mobileNav.removeEventListener('keydown', handleFocusTrap);
        }
    }
    
    /**
     * Utility: Debounce
     */
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
    
    // Public API
    return {
        init: init,
        openMobileNav: openMobileNav,
        closeMobileNav: closeMobileNav
    };
})();

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', Navigation.init);
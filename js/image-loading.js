/**
 * 이미지 자동 로딩 시스템
 * AOS 애니메이션과 호환되는 이미지 로딩 처리
 */

(function() {
    'use strict';
    
    function initImageLoading() {
        const images = document.querySelectorAll('img');
        let loadedCount = 0;
        const totalImages = images.length;
        
        if (totalImages === 0) {
            // 이미지가 없으면 바로 완료 처리
            document.documentElement.classList.add('images-loaded');
            return;
        }
        
        function imageLoaded() {
            loadedCount++;
            if (loadedCount === totalImages) {
                document.documentElement.classList.add('images-loaded');
            }
        }
        
        images.forEach(img => {
            if (img.complete && img.naturalHeight !== 0) {
                // 이미 로드된 이미지
                img.classList.add('loaded');
                imageLoaded();
            } else {
                // 로드 완료 시 loaded 클래스 추가
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                    imageLoaded();
                });
                
                img.addEventListener('error', function() {
                    this.classList.add('loaded'); // 에러 시에도 표시
                    imageLoaded();
                });
                
                // 타임아웃 처리 (5초 후 강제 로드 처리)
                setTimeout(() => {
                    if (!img.classList.contains('loaded')) {
                        img.classList.add('loaded');
                        imageLoaded();
                    }
                }, 5000);
            }
        });
    }
    
    // DOM 준비되면 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageLoading);
    } else {
        initImageLoading();
    }
})();
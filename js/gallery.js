// 갤러리 페이지 기능
document.addEventListener('DOMContentLoaded', function() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    let currentCategory = 'all';
    let currentSubcategory = 'all';
    let displayedImages = 0;
    const imagesPerLoad = 24;
    
    // 갤러리 아이템 HTML 생성
    function createGalleryItem(image) {
        return `
            <div class="gallery-item" data-category="${image.category}" data-subcategory="${image.subcategory}" data-year="${image.year}">
                <img src="${image.thumbnail}" alt="${image.title}" loading="lazy">
                <div class="gallery-item__overlay">
                    <h3>${image.title}</h3>
                    <p>${image.description}</p>
                    <button class="gallery-item__zoom" data-image="${image.fullsize}" data-title="${image.title}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/>
                            <path d="m21 21-4.35-4.35"/>
                            <line x1="11" y1="8" x2="11" y2="14"/>
                            <line x1="8" y1="11" x2="14" y2="11"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
    
    // 이미지 필터링
    function filterImages() {
        let filteredImages = galleryImages;
        
        if (currentCategory !== 'all') {
            filteredImages = filteredImages.filter(img => img.category === currentCategory);
        }
        
        if (currentSubcategory !== 'all') {
            filteredImages = filteredImages.filter(img => img.subcategory === currentSubcategory);
        }
        
        return filteredImages;
    }
    
    // 갤러리 표시
    function displayGallery(reset = false) {
        if (reset) {
            galleryGrid.innerHTML = '';
            displayedImages = 0;
        }
        
        const filteredImages = filterImages();
        const imagesToShow = filteredImages.slice(displayedImages, displayedImages + imagesPerLoad);
        
        imagesToShow.forEach((image, index) => {
            const galleryItem = createGalleryItem(image);
            galleryGrid.insertAdjacentHTML('beforeend', galleryItem);
            
            // AOS 애니메이션 재적용
            const newItem = galleryGrid.lastElementChild;
            newItem.setAttribute('data-aos', 'fade-up');
            newItem.setAttribute('data-aos-delay', (index * 50) % 400);
        });
        
        displayedImages += imagesToShow.length;
        
        // Load More 버튼 표시/숨김
        if (displayedImages >= filteredImages.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
        
        // AOS 새로고침
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        
        // 갤러리 아이템 클릭 이벤트 추가
        attachGalleryEvents();
    }
    
    // 서브카테고리 필터 표시
    function updateSubcategoryFilters(category) {
        const subcategoryGroups = document.querySelectorAll('.subcategory-group');
        subcategoryGroups.forEach(group => {
            if (group.dataset.category === category) {
                group.style.display = 'flex';
            } else {
                group.style.display = 'none';
            }
        });
    }
    
    // 필터 버튼 이벤트
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 활성 버튼 업데이트
            filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
            btn.classList.add('filter-btn--active');
            
            // 카테고리 업데이트
            currentCategory = btn.dataset.filter;
            currentSubcategory = 'all';
            
            // 서브카테고리 필터 업데이트
            if (currentCategory !== 'all') {
                updateSubcategoryFilters(currentCategory);
            } else {
                document.querySelectorAll('.subcategory-group').forEach(group => {
                    group.style.display = 'none';
                });
            }
            
            // 서브카테고리 버튼 초기화
            document.querySelectorAll('.subfilter-btn').forEach(subBtn => {
                if (subBtn.dataset.subfilter === 'all') {
                    subBtn.classList.add('subfilter-btn--active');
                } else {
                    subBtn.classList.remove('subfilter-btn--active');
                }
            });
            
            // 갤러리 재표시
            displayGallery(true);
        });
    });
    
    // 서브카테고리 필터 이벤트
    document.querySelectorAll('.subfilter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // 같은 카테고리 그룹 내의 버튼들만 처리
            const group = btn.closest('.subcategory-group');
            group.querySelectorAll('.subfilter-btn').forEach(b => {
                b.classList.remove('subfilter-btn--active');
            });
            btn.classList.add('subfilter-btn--active');
            
            // 서브카테고리 업데이트
            currentSubcategory = btn.dataset.subfilter;
            
            // 갤러리 재표시
            displayGallery(true);
        });
    });
    
    // 갤러리 이벤트 연결
    function attachGalleryEvents() {
        const zoomBtns = galleryGrid.querySelectorAll('.gallery-item__zoom');
        const galleryItems = galleryGrid.querySelectorAll('.gallery-item');
        
        // 줌 버튼 클릭
        zoomBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const imageUrl = btn.dataset.image;
                const imageTitle = btn.dataset.title;
                lightboxImage.src = imageUrl;
                lightboxImage.alt = imageTitle;
                lightbox.classList.add('lightbox--active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // 갤러리 아이템 클릭
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const zoomBtn = item.querySelector('.gallery-item__zoom');
                if (zoomBtn) {
                    zoomBtn.click();
                }
            });
        });
    }
    
    // 라이트박스 닫기
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // ESC 키로 라이트박스 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('lightbox--active')) {
            closeLightbox();
        }
    });
    
    function closeLightbox() {
        lightbox.classList.remove('lightbox--active');
        document.body.style.overflow = '';
        lightboxImage.src = '';
    }
    
    // Load More 버튼
    loadMoreBtn.addEventListener('click', () => {
        displayGallery();
    });
    
    // 초기 갤러리 표시
    displayGallery(true);
});
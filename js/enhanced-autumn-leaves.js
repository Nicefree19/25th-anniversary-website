/**
 * Enhanced Autumn Leaves Animation System
 * 향상된 가을 낙엽 애니메이션 시스템 - 프리미엄 품질
 */

class EnhancedAutumnLeaves {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.leaves = [];
        this.isActive = false;
        this.animationId = null;
        this.lastTime = 0;
        this.settings = this.getOptimizedSettings();
        
        // 가을 낙엽 색상 팔레트 (더 풍부하고 자연스러운 색상)
        this.leafColors = [
            // 따뜻한 빨간색 계열
            '#8B0000', '#DC143C', '#B22222', '#CD5C5C', '#F08080',
            // 주황색 계열
            '#FF8C00', '#FF7F50', '#FF6347', '#FF4500', '#FFA500',
            // 노란색 계열
            '#FFD700', '#FFFF00', '#FFFFE0', '#F0E68C', '#BDB76B',
            // 갈색 계열
            '#8B4513', '#A0522D', '#CD853F', '#D2691E', '#DEB887',
            // 녹색 계열 (늦가을)
            '#9ACD32', '#32CD32', '#228B22', '#008000', '#006400'
        ];
        
        // 낙엽 모양 템플릿
        this.leafShapes = ['maple', 'oak', 'birch', 'elm'];
        
        this.init();
    }
    
    getOptimizedSettings() {
        const isMobile = window.innerWidth <= 768;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        
        if (prefersReducedMotion) {
            return { particleCount: 0, enabled: false };
        }
        
        return {
            enabled: true,
            particleCount: isMobile ? (isLowEnd ? 8 : 12) : (isLowEnd ? 15 : 25),
            maxParticles: isMobile ? 15 : 35,
            spawnRate: isMobile ? 0.2 : 0.4,
            windVariation: isMobile ? 0.3 : 0.5,
            performance: isMobile || isLowEnd ? 'low' : 'high',
            isMobile,
            isLowEnd
        };
    }
    
    init() {
        if (!this.settings.enabled) return;
        
        this.createCanvas();
        this.setupEventListeners();
        this.start();
    }
    
    createCanvas() {
        // 기존 캔버스 제거
        const existingCanvas = document.getElementById('autumn-leaves-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        // 새 캔버스 생성
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'autumn-leaves-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: 0.8;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // 최대 2x로 제한
        
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // 마우스 움직임에 따른 바람 효과
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            if (this.settings.isMobile) return;
            
            const deltaX = e.clientX - mouseX;
            const deltaY = e.clientY - mouseY;
            
            this.windForce = {
                x: deltaX * 0.01,
                y: deltaY * 0.005
            };
            
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // 바람 효과 감쇠
            setTimeout(() => {
                if (this.windForce) {
                    this.windForce.x *= 0.9;
                    this.windForce.y *= 0.9;
                }
            }, 100);
        });
    }
    
    createLeaf() {
        const color = this.leafColors[Math.floor(Math.random() * this.leafColors.length)];
        const shape = this.leafShapes[Math.floor(Math.random() * this.leafShapes.length)];
        const size = Math.random() * 20 + 10; // 10-30px
        
        return {
            x: Math.random() * (this.width + 200) - 100, // 화면 밖에서 시작
            y: -size - Math.random() * 100,
            vx: (Math.random() - 0.5) * 1.5, // 좌우 속도
            vy: Math.random() * 1.5 + 0.5, // 아래로 떨어지는 속도
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.08,
            size: size,
            color: color,
            shape: shape,
            opacity: Math.random() * 0.6 + 0.4, // 0.4-1.0
            swayAmplitude: Math.random() * 30 + 10, // 좌우 흔들림 크기
            swaySpeed: Math.random() * 0.02 + 0.01, // 흔들림 속도
            swayOffset: Math.random() * Math.PI * 2, // 흔들림 위상
            life: 0, // 생존 시간
            wind: {
                sensitivity: Math.random() * 0.5 + 0.3, // 바람 민감도
                resistance: Math.random() * 0.1 + 0.05 // 공기 저항
            }
        };
    }
    
    drawLeaf(leaf) {
        this.ctx.save();
        
        // 잎의 중심으로 이동
        this.ctx.translate(leaf.x + leaf.size/2, leaf.y + leaf.size/2);
        this.ctx.rotate(leaf.rotation);
        
        // 투명도 설정
        this.ctx.globalAlpha = leaf.opacity;
        
        // 잎 모양에 따른 그리기
        switch(leaf.shape) {
            case 'maple':
                this.drawMapleLeaf(leaf);
                break;
            case 'oak':
                this.drawOakLeaf(leaf);
                break;
            case 'birch':
                this.drawBirchLeaf(leaf);
                break;
            case 'elm':
                this.drawElmLeaf(leaf);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawMapleLeaf(leaf) {
        const size = leaf.size;
        const halfSize = size / 2;
        
        this.ctx.fillStyle = leaf.color;
        this.ctx.beginPath();
        
        // 단풍잎 모양 그리기 (5개 돌출부)
        this.ctx.moveTo(0, -halfSize);
        this.ctx.quadraticCurveTo(halfSize * 0.3, -halfSize * 0.7, halfSize * 0.8, -halfSize * 0.3);
        this.ctx.quadraticCurveTo(halfSize, 0, halfSize * 0.6, halfSize * 0.4);
        this.ctx.quadraticCurveTo(halfSize * 0.3, halfSize * 0.8, 0, halfSize);
        this.ctx.quadraticCurveTo(-halfSize * 0.3, halfSize * 0.8, -halfSize * 0.6, halfSize * 0.4);
        this.ctx.quadraticCurveTo(-halfSize, 0, -halfSize * 0.8, -halfSize * 0.3);
        this.ctx.quadraticCurveTo(-halfSize * 0.3, -halfSize * 0.7, 0, -halfSize);
        
        this.ctx.fill();
        
        // 잎맥 그리기
        this.ctx.strokeStyle = this.darkenColor(leaf.color, 0.3);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -halfSize);
        this.ctx.lineTo(0, halfSize);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(halfSize * 0.6, -halfSize * 0.4);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-halfSize * 0.6, -halfSize * 0.4);
        this.ctx.stroke();
    }
    
    drawOakLeaf(leaf) {
        const size = leaf.size;
        const halfSize = size / 2;
        
        this.ctx.fillStyle = leaf.color;
        this.ctx.beginPath();
        
        // 떡갈나무 잎 모양 (둥근 돌출부들)
        this.ctx.moveTo(0, -halfSize);
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
            const radius = halfSize * (0.7 + 0.3 * Math.sin(i * 1.5));
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
        
        // 중앙 잎맥
        this.ctx.strokeStyle = this.darkenColor(leaf.color, 0.3);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -halfSize);
        this.ctx.lineTo(0, halfSize);
        this.ctx.stroke();
    }
    
    drawBirchLeaf(leaf) {
        const size = leaf.size;
        const halfSize = size / 2;
        
        this.ctx.fillStyle = leaf.color;
        this.ctx.beginPath();
        
        // 자작나무 잎 (타원형)
        this.ctx.ellipse(0, 0, halfSize * 0.6, halfSize, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 잎맥
        this.ctx.strokeStyle = this.darkenColor(leaf.color, 0.3);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -halfSize);
        this.ctx.lineTo(0, halfSize);
        // 좌우 잎맥
        for (let i = -3; i <= 3; i++) {
            if (i !== 0) {
                const y = (i / 3) * halfSize * 0.6;
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(halfSize * 0.4 * Math.sign(i), y);
            }
        }
        this.ctx.stroke();
    }
    
    drawElmLeaf(leaf) {
        const size = leaf.size;
        const halfSize = size / 2;
        
        this.ctx.fillStyle = leaf.color;
        this.ctx.beginPath();
        
        // 느릅나무 잎 (길쭉한 타원)
        this.ctx.ellipse(0, 0, halfSize * 0.5, halfSize, 0, 0, Math.PI * 2);
        this.ctx.fill();
        
        // 톱니 모양 테두리 효과
        this.ctx.strokeStyle = this.darkenColor(leaf.color, 0.4);
        this.ctx.lineWidth = 0.5;
        this.ctx.setLineDash([2, 1]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // 중앙 잎맥
        this.ctx.strokeStyle = this.darkenColor(leaf.color, 0.3);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -halfSize);
        this.ctx.lineTo(0, halfSize);
        this.ctx.stroke();
    }
    
    darkenColor(color, factor) {
        // 색상을 어둡게 만드는 함수
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
        
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    updateLeaf(leaf, deltaTime) {
        // 생존 시간 증가
        leaf.life += deltaTime;
        
        // 자연스러운 좌우 흔들림 (사인파)
        const sway = Math.sin(leaf.life * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude * 0.01;
        leaf.vx += sway;
        
        // 바람 효과 적용
        if (this.windForce) {
            leaf.vx += this.windForce.x * leaf.wind.sensitivity;
            leaf.vy += this.windForce.y * leaf.wind.sensitivity;
        }
        
        // 공기 저항
        leaf.vx *= (1 - leaf.wind.resistance);
        leaf.vy *= (1 - leaf.wind.resistance * 0.1); // 수직 저항은 적게
        
        // 중력 효과
        leaf.vy += 0.02;
        
        // 최대 속도 제한
        const maxSpeed = 3;
        const speed = Math.sqrt(leaf.vx * leaf.vx + leaf.vy * leaf.vy);
        if (speed > maxSpeed) {
            leaf.vx = (leaf.vx / speed) * maxSpeed;
            leaf.vy = (leaf.vy / speed) * maxSpeed;
        }
        
        // 위치 업데이트
        leaf.x += leaf.vx;
        leaf.y += leaf.vy;
        
        // 회전 업데이트
        leaf.rotation += leaf.rotationSpeed;
        
        // 투명도 점진적 감소 (화면 하단 근처에서)
        if (leaf.y > this.height * 0.8) {
            leaf.opacity *= 0.995;
        }
        
        // 화면 밖으로 나가면 제거
        return leaf.y < this.height + 100 && 
               leaf.x > -100 && 
               leaf.x < this.width + 100 && 
               leaf.opacity > 0.1;
    }
    
    animate(currentTime) {
        if (!this.isActive) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 캔버스 클리어
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 새 낙엽 생성
        while (this.leaves.length < this.settings.maxParticles && Math.random() < this.settings.spawnRate * 0.01) {
            this.leaves.push(this.createLeaf());
        }
        
        // 낙엽 업데이트 및 그리기
        this.leaves = this.leaves.filter(leaf => {
            const isAlive = this.updateLeaf(leaf, deltaTime);
            if (isAlive) {
                this.drawLeaf(leaf);
            }
            return isAlive;
        });
        
        this.animationId = requestAnimationFrame((time) => this.animate(time));
    }
    
    start() {
        if (this.isActive || !this.settings.enabled) return;
        
        this.isActive = true;
        this.windForce = { x: 0, y: 0 };
        
        // 초기 낙엽들 생성
        for (let i = 0; i < this.settings.particleCount; i++) {
            const leaf = this.createLeaf();
            // 초기 낙엽들을 화면에 분산
            leaf.y = Math.random() * this.height;
            this.leaves.push(leaf);
        }
        
        this.animationId = requestAnimationFrame((time) => {
            this.lastTime = time;
            this.animate(time);
        });
    }
    
    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    destroy() {
        this.stop();
        if (this.canvas) {
            this.canvas.remove();
            this.canvas = null;
        }
        this.leaves = [];
    }
    
    // 계절이나 테마에 따른 색상 팔레트 변경
    setColorTheme(theme) {
        switch(theme) {
            case 'autumn':
                this.leafColors = [
                    '#8B0000', '#DC143C', '#B22222', '#CD5C5C',
                    '#FF8C00', '#FF7F50', '#FF6347', '#FF4500',
                    '#FFD700', '#FFFF00', '#F0E68C', '#BDB76B',
                    '#8B4513', '#A0522D', '#CD853F', '#D2691E'
                ];
                break;
            case 'late-autumn':
                this.leafColors = [
                    '#8B4513', '#A0522D', '#CD853F', '#D2691E',
                    '#DEB887', '#F4A460', '#DAA520', '#B8860B',
                    '#654321', '#8B7355', '#A0522D'
                ];
                break;
            case 'golden':
                this.leafColors = [
                    '#FFD700', '#FFA500', '#FF8C00',
                    '#DAA520', '#B8860B', '#CD853F',
                    '#DEB887', '#F4A460', '#FFFFE0'
                ];
                break;
        }
    }
}

// 전역 인스턴스
let autumnLeavesSystem = null;

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 페이지 로드 후 약간의 지연을 두고 시작
    setTimeout(() => {
        if (!autumnLeavesSystem) {
            autumnLeavesSystem = new EnhancedAutumnLeaves();
        }
    }, 1000);
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (autumnLeavesSystem) {
        autumnLeavesSystem.destroy();
        autumnLeavesSystem = null;
    }
});

// 전역 제어 함수들
window.AutumnLeaves = {
    start: () => autumnLeavesSystem?.start(),
    stop: () => autumnLeavesSystem?.stop(),
    setTheme: (theme) => autumnLeavesSystem?.setColorTheme(theme),
    isRunning: () => autumnLeavesSystem?.isActive || false
};
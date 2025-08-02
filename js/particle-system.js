/**
 * Premium Autumn Leaf Particle System
 * 고급 낙엽 파티클 시스템 - 국내 최고 웹디자이너 수준
 */

class AutumnLeafParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isRunning = false;
        this.lastTime = 0;
        this.windStrength = 0;
        this.windDirection = 0;
        this.settings = this.getDeviceOptimizedSettings();
        
        // 가을 색상 팔레트
        this.leafColors = {
            light: [
                '#D2691E', '#CD853F', '#DEB887', '#F4A460',
                '#FF8C00', '#FF7F50', '#DAA520', '#B8860B',
                '#8FBC8F', '#9ACD32', '#ADFF2F'
            ],
            dark: [
                '#F97316', '#FB923C', '#FBBF24', '#FCD34D',
                '#F59E0B', '#EAB308', '#CA8A04', '#A16207',
                '#10B981', '#34D399', '#6EE7B7'
            ]
        };
        
        this.init();
    }
    
    getDeviceOptimizedSettings() {
        const isMobile = window.innerWidth <= 768;
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return {
            particleCount: prefersReducedMotion ? 0 : (isMobile ? 15 : 35),
            maxParticles: isMobile ? 20 : 50,
            spawnRate: isMobile ? 0.3 : 0.7,
            performance: isMobile ? 'low' : 'high',
            isDarkMode,
            prefersReducedMotion
        };
    }
    
    init() {
        this.resizeCanvas();
        this.createInitialParticles();
        
        // 이벤트 리스너
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 다크모드 변경 감지
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', (e) => {
                this.settings.isDarkMode = e.matches;
                this.updateParticleColors();
            });
            
        // 성능 모니터링
        this.fpsCounter = 0;
        this.lastFpsTime = 0;
        this.currentFps = 60;
    }
    
    resizeCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        this.width = rect.width;
        this.height = rect.height;
    }
    
    createInitialParticles() {
        for (let i = 0; i < this.settings.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        const colors = this.settings.isDarkMode ? this.leafColors.dark : this.leafColors.light;
        
        return {
            x: Math.random() * this.width,
            y: -50,
            vx: (Math.random() - 0.5) * 2,
            vy: Math.random() * 2 + 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            size: Math.random() * 15 + 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.8 + 0.2,
            type: Math.floor(Math.random() * 3), // 0: 단풍잎, 1: 은행잎, 2: 참나무잎
            life: 1.0,
            decay: Math.random() * 0.005 + 0.002,
            swayAmplitude: Math.random() * 30 + 10,
            swayFrequency: Math.random() * 0.02 + 0.01,
            time: 0
        };
    }
    
    updateParticleColors() {
        const colors = this.settings.isDarkMode ? this.leafColors.dark : this.leafColors.light;
        this.particles.forEach(particle => {
            particle.color = colors[Math.floor(Math.random() * colors.length)];
        });
    }
    
    updateWindForce() {
        // 자연스러운 바람 패턴
        this.windStrength = Math.sin(Date.now() * 0.001) * 0.5 + 0.5;
        this.windDirection = Math.sin(Date.now() * 0.0007) * 0.3;
    }
    
    updateParticle(particle, deltaTime) {
        particle.time += deltaTime;
        
        // 중력 효과
        particle.vy += 0.05 * deltaTime;
        
        // 바람 효과
        particle.vx += this.windDirection * this.windStrength * 0.1 * deltaTime;
        
        // 좌우 흔들림 (자연스러운 낙하)
        const sway = Math.sin(particle.time * particle.swayFrequency) * particle.swayAmplitude * 0.01;
        particle.vx += sway * deltaTime;
        
        // 위치 업데이트
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        
        // 회전 업데이트
        particle.rotation += particle.rotationSpeed * deltaTime;
        
        // 생명력 감소
        particle.life -= particle.decay * deltaTime;
        particle.opacity = particle.life;
        
        // 속도 저항
        particle.vx *= 0.999;
        particle.vy *= 0.999;
        
        // 화면 경계 처리
        if (particle.x < -50) particle.x = this.width + 50;
        if (particle.x > this.width + 50) particle.x = -50;
        
        return particle.y < this.height + 50 && particle.life > 0;
    }
    
    drawLeaf(particle) {
        this.ctx.save();
        
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);
        this.ctx.globalAlpha = particle.opacity;
        
        const size = particle.size;
        this.ctx.fillStyle = particle.color;
        
        // 그림자 효과 (다크모드에서 글로우)
        if (this.settings.isDarkMode) {
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowOffsetX = 0;
            this.ctx.shadowOffsetY = 0;
        } else {
            this.ctx.shadowColor = 'rgba(0,0,0,0.3)';
            this.ctx.shadowBlur = 3;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        
        // 잎사귀 타입별 그리기
        switch (particle.type) {
            case 0: // 단풍잎
                this.drawMapleLeaf(size);
                break;
            case 1: // 은행잎
                this.drawGinkgoLeaf(size);
                break;
            case 2: // 참나무잎
                this.drawOakLeaf(size);
                break;
        }
        
        this.ctx.restore();
    }
    
    drawMapleLeaf(size) {
        this.ctx.beginPath();
        
        // 단풍잎 모양 (5각형 기반)
        const points = 5;
        const outerRadius = size;
        const innerRadius = size * 0.4;
        
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / points - Math.PI / 2;
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
    }
    
    drawGinkgoLeaf(size) {
        this.ctx.beginPath();
        
        // 은행잎 모양 (부채꼴)
        this.ctx.arc(0, size * 0.3, size, -Math.PI * 0.7, -Math.PI * 0.3);
        this.ctx.lineTo(0, size * 0.8);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawOakLeaf(size) {
        this.ctx.beginPath();
        
        // 참나무잎 모양 (둥근 톱니)
        const segments = 6;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 2 - Math.PI / 2;
            const radius = size * (0.7 + Math.sin(t * Math.PI * 4) * 0.3);
            const x = Math.cos(angle) * radius * 0.8;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    spawnNewParticles(deltaTime) {
        if (this.particles.length < this.settings.maxParticles) {
            const spawnChance = this.settings.spawnRate * deltaTime * 0.1;
            if (Math.random() < spawnChance) {
                this.particles.push(this.createParticle());
            }
        }
    }
    
    animate(currentTime) {
        if (!this.isRunning) return;
        
        if (this.settings.prefersReducedMotion) {
            requestAnimationFrame((time) => this.animate(time));
            return;
        }
        
        const deltaTime = Math.min(currentTime - this.lastTime, 16.67); // 60fps 제한
        this.lastTime = currentTime;
        
        // FPS 모니터링
        this.fpsCounter++;
        if (currentTime - this.lastFpsTime >= 1000) {
            this.currentFps = this.fpsCounter;
            this.fpsCounter = 0;
            this.lastFpsTime = currentTime;
            
            // 성능 최적화: FPS가 낮으면 파티클 수 감소
            if (this.currentFps < 30 && this.settings.particleCount > 10) {
                this.settings.particleCount = Math.max(10, this.settings.particleCount - 2);
            }
        }
        
        // 배경 클리어
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 바람 업데이트
        this.updateWindForce();
        
        // 새 파티클 생성
        this.spawnNewParticles(deltaTime);
        
        // 파티클 업데이트 및 렌더링
        this.particles = this.particles.filter(particle => {
            const alive = this.updateParticle(particle, deltaTime);
            if (alive) {
                this.drawLeaf(particle);
            }
            return alive;
        });
        
        requestAnimationFrame((time) => this.animate(time));
    }
    
    start() {
        if (!this.isRunning && !this.settings.prefersReducedMotion) {
            this.isRunning = true;
            this.lastTime = performance.now();
            requestAnimationFrame((time) => this.animate(time));
        }
    }
    
    stop() {
        this.isRunning = false;
    }
    
    destroy() {
        this.stop();
        this.particles = [];
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// 전역 접근을 위한 내보내기
window.AutumnLeafParticleSystem = AutumnLeafParticleSystem;
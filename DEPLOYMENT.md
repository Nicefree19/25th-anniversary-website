# 배포 가이드

어린이도서연구회 은평지회 25주년 기념 웹사이트 배포 방법을 안내합니다.

## 📋 배포 전 체크리스트

- [ ] 모든 기능이 정상 작동하는지 확인
- [ ] 이미지가 모두 표시되는지 확인
- [ ] 반응형 디자인이 모바일에서 잘 작동하는지 확인
- [ ] 콘솔에 에러가 없는지 확인
- [ ] 외부 링크가 모두 작동하는지 확인

## 🚀 배포 방법

### 방법 1: GitHub Pages (추천)

1. **GitHub 저장소 생성**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/25th-anniversary-website.git
   git push -u origin main
   ```

2. **자동 배포 설정**
   - 저장소의 Settings → Pages로 이동
   - Source: GitHub Actions 선택
   - 이미 설정된 `.github/workflows/deploy.yml`이 자동으로 실행됨

3. **수동 배포**
   ```bash
   npm run deploy
   ```

4. **배포 확인**
   - https://YOUR_USERNAME.github.io/25th-anniversary-website/

### 방법 2: Netlify

1. **Netlify 계정 생성**
   - https://www.netlify.com 에서 가입

2. **GitHub 연동**
   - New site from Git 클릭
   - GitHub 저장소 선택
   - 설정은 `netlify.toml` 파일이 자동으로 처리

3. **커스텀 도메인 설정 (선택사항)**
   - Site settings → Domain management
   - Add custom domain 클릭

### 방법 3: Vercel

1. **Vercel 계정 생성**
   - https://vercel.com 에서 가입

2. **프로젝트 import**
   - Import Git Repository
   - GitHub 저장소 선택
   - 설정은 `vercel.json` 파일이 자동으로 처리

### 방법 4: 전통적인 웹 호스팅

1. **빌드 실행**
   ```bash
   npm run build
   ```

2. **FTP/SFTP로 업로드**
   - `dist` 폴더의 모든 내용을 웹 서버에 업로드

## 🔧 빌드 명령어

```bash
# 개발 서버 실행
npm start

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# GitHub Pages 배포
npm run deploy
```

## 📝 환경 변수 설정

현재 프로젝트는 환경 변수를 사용하지 않지만, 필요한 경우:

1. `.env` 파일 생성
2. 필요한 변수 추가
3. `.gitignore`에 `.env` 포함 확인

## 🌐 도메인 설정

### GitHub Pages 커스텀 도메인

1. 저장소 루트에 `CNAME` 파일 생성
2. 도메인 입력 (예: `25th.eunpyeong.org`)
3. DNS 설정:
   ```
   A 레코드:
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   
   또는 CNAME 레코드:
   YOUR_USERNAME.github.io
   ```

## 🔍 배포 후 확인사항

1. **성능 테스트**
   - Google PageSpeed Insights
   - GTmetrix

2. **SEO 확인**
   - meta 태그 확인
   - sitemap.xml 생성 (필요시)
   - robots.txt 설정

3. **보안 헤더**
   - HTTPS 활성화
   - CSP 헤더 설정

## 🆘 문제 해결

### 빌드 실패
```bash
# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
```

### 404 에러
- GitHub Pages: 저장소 Settings에서 Pages 설정 확인
- 경로 문제: 상대 경로를 절대 경로로 변경

### 이미지 표시 안됨
- 경로 확인: `/assets/images/` 형태로 시작
- 대소문자 확인: 파일명과 코드의 대소문자 일치

## 📊 배포 상태 모니터링

- GitHub Actions: Actions 탭에서 배포 상태 확인
- Netlify: 대시보드에서 실시간 로그 확인
- Vercel: 대시보드에서 빌드 로그 확인

## 💡 팁

1. **캐시 관리**
   - 빌드 시 파일명에 해시 추가로 캐시 무효화
   - CloudFlare 등 CDN 사용 시 캐시 퍼지

2. **성능 최적화**
   - 이미지 lazy loading 확인
   - CSS/JS 번들 크기 확인

3. **백업**
   - 정기적인 git 커밋
   - 중요 변경사항 전 브랜치 생성

---

배포 관련 추가 문의사항은 이슈로 등록해주세요.
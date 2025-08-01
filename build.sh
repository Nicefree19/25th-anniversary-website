#!/bin/bash

# 어린이도서연구회 은평지회 25주년 웹사이트 빌드 스크립트

echo "🎉 어린이도서연구회 은평지회 25주년 웹사이트 빌드 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 빌드 디렉토리 정리
echo -e "${YELLOW}1. 기존 빌드 디렉토리 정리 중...${NC}"
rm -rf dist
mkdir -p dist

# 파일 복사
echo -e "${YELLOW}2. 파일 복사 중...${NC}"
cp -r index.html pages css js assets dist/

# CSS 파일 병합 및 최소화
echo -e "${YELLOW}3. CSS 파일 최적화 중...${NC}"
if [ -x "$(command -v cleancss)" ]; then
    # CSS 파일들을 하나로 병합
    cat dist/css/variables.css \
        dist/css/reset.css \
        dist/css/components.css \
        dist/css/animations.css \
        dist/css/utilities.css \
        dist/css/performance.css \
        dist/css/responsive.css \
        dist/css/main.css > dist/css/combined.css
    
    # 최소화
    cleancss -o dist/css/main.min.css dist/css/combined.css
    
    # 개별 CSS 파일 삭제
    rm dist/css/*.css
    mv dist/css/main.min.css dist/css/main.css
else
    echo -e "${RED}clean-css-cli가 설치되지 않았습니다. CSS 최소화를 건너뜁니다.${NC}"
fi

# JavaScript 파일 최소화
echo -e "${YELLOW}4. JavaScript 파일 최적화 중...${NC}"
if [ -x "$(command -v terser)" ]; then
    # 각 JS 파일 최소화
    for file in dist/js/*.js; do
        if [ -f "$file" ]; then
            terser "$file" -c -m -o "${file%.js}.min.js"
            rm "$file"
            mv "${file%.js}.min.js" "$file"
        fi
    done
else
    echo -e "${RED}terser가 설치되지 않았습니다. JavaScript 최소화를 건너뜁니다.${NC}"
fi

# HTML 파일의 CSS/JS 경로 업데이트
echo -e "${YELLOW}5. HTML 파일 업데이트 중...${NC}"
# main.css import 문들을 제거하고 main.css만 로드하도록 수정
find dist -name "*.html" -type f -exec sed -i 's/<link rel="stylesheet" href="[^"]*\/css\/main\.css">/<link rel="stylesheet" href="\/css\/main.css">/g' {} \;

# 이미지 최적화
echo -e "${YELLOW}6. 이미지 최적화 중...${NC}"
if [ -x "$(command -v imagemin)" ]; then
    imagemin dist/assets/images/* --out-dir=dist/assets/images
else
    echo -e "${RED}imagemin-cli가 설치되지 않았습니다. 이미지 최적화를 건너뜁니다.${NC}"
fi

# 빌드 정보 파일 생성
echo -e "${YELLOW}7. 빌드 정보 생성 중...${NC}"
BUILD_DATE=$(date +"%Y-%m-%d %H:%M:%S")
BUILD_VERSION=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

cat > dist/build-info.json << EOF
{
  "version": "1.0.0",
  "buildDate": "$BUILD_DATE",
  "gitCommit": "$BUILD_VERSION",
  "project": "어린이도서연구회 은평지회 25주년 기념 웹사이트"
}
EOF

# 빌드 완료
echo -e "${GREEN}✅ 빌드가 완료되었습니다!${NC}"
echo -e "${GREEN}📁 빌드 결과: ./dist${NC}"
echo -e "${GREEN}🚀 미리보기: npm run preview${NC}"

# 빌드 사이즈 정보
echo -e "\n${YELLOW}📊 빌드 사이즈 정보:${NC}"
du -sh dist/
du -sh dist/*/
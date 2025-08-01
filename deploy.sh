#!/bin/bash

# 어린이도서연구회 은평지회 25주년 웹사이트 배포 스크립트

echo "🚀 어린이도서연구회 은평지회 25주년 웹사이트 배포 시작..."

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
if [ -z "$CURRENT_BRANCH" ]; then
    echo -e "${RED}❌ Git 저장소가 아닙니다. 먼저 git init을 실행하세요.${NC}"
    exit 1
fi

echo -e "${BLUE}현재 브랜치: $CURRENT_BRANCH${NC}"

# 변경사항 확인
if [[ $(git status --porcelain) ]]; then
    echo -e "${YELLOW}⚠️  커밋되지 않은 변경사항이 있습니다.${NC}"
    echo "변경사항을 커밋하거나 stash 하시겠습니까? (commit/stash/skip)"
    read -r CHOICE
    
    case $CHOICE in
        commit)
            git add .
            echo "커밋 메시지를 입력하세요:"
            read -r COMMIT_MSG
            git commit -m "$COMMIT_MSG"
            ;;
        stash)
            git stash
            ;;
        skip)
            echo -e "${YELLOW}변경사항을 무시하고 계속 진행합니다.${NC}"
            ;;
        *)
            echo -e "${RED}배포를 취소합니다.${NC}"
            exit 1
            ;;
    esac
fi

# 빌드 실행
echo -e "${YELLOW}1. 프로덕션 빌드 실행 중...${NC}"
./build.sh

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 빌드 실패. 배포를 중단합니다.${NC}"
    exit 1
fi

# gh-pages 브랜치 확인
echo -e "${YELLOW}2. gh-pages 브랜치 설정 확인 중...${NC}"
if ! git show-ref --verify --quiet refs/heads/gh-pages; then
    echo -e "${YELLOW}gh-pages 브랜치가 없습니다. 생성합니다...${NC}"
    git checkout --orphan gh-pages
    git rm -rf .
    git commit --allow-empty -m "Initial gh-pages commit"
    git checkout "$CURRENT_BRANCH"
fi

# GitHub Pages 배포
echo -e "${YELLOW}3. GitHub Pages로 배포 중...${NC}"

# gh-pages npm 패키지 사용
if [ -x "$(command -v gh-pages)" ]; then
    gh-pages -d dist -m "Deploy: $(date +"%Y-%m-%d %H:%M:%S")"
else
    echo -e "${YELLOW}gh-pages가 설치되지 않았습니다. 수동으로 배포합니다...${NC}"
    
    # 임시 디렉토리 생성
    TEMP_DIR=$(mktemp -d)
    cp -r dist/* "$TEMP_DIR/"
    
    # gh-pages 브랜치로 전환
    git checkout gh-pages
    
    # 기존 파일 삭제
    git rm -rf .
    
    # 새 파일 복사
    cp -r "$TEMP_DIR"/* .
    
    # .nojekyll 파일 추가 (Jekyll 처리 비활성화)
    touch .nojekyll
    
    # 커밋 및 푸시
    git add .
    git commit -m "Deploy: $(date +"%Y-%m-%d %H:%M:%S")"
    git push origin gh-pages --force
    
    # 원래 브랜치로 돌아가기
    git checkout "$CURRENT_BRANCH"
    
    # 임시 디렉토리 삭제
    rm -rf "$TEMP_DIR"
fi

# 배포 정보 출력
echo -e "\n${GREEN}✅ 배포가 완료되었습니다!${NC}"
echo -e "${GREEN}📁 배포된 브랜치: gh-pages${NC}"
echo -e "${GREEN}🌐 웹사이트 URL: https://[your-username].github.io/25th-anniversary-website/${NC}"
echo -e "${YELLOW}   (GitHub 설정에서 Pages가 활성화되어 있는지 확인하세요)${NC}"

# GitHub Pages 설정 안내
echo -e "\n${BLUE}📌 GitHub Pages 설정 방법:${NC}"
echo "1. GitHub 저장소로 이동"
echo "2. Settings → Pages 메뉴 선택"
echo "3. Source: Deploy from a branch 선택"
echo "4. Branch: gh-pages 선택, 폴더: / (root) 선택"
echo "5. Save 버튼 클릭"
echo -e "\n${YELLOW}⏱️  배포 후 사이트가 활성화되기까지 몇 분이 소요될 수 있습니다.${NC}"
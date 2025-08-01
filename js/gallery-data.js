// 어린이도서연구회 은평지회 갤러리 데이터
const galleryData = {
    categories: {
        events: {
            name: "행사 사진",
            count: 60,
            subcategories: {
                "autumn-sports": {
                    name: "가을 운동회",
                    count: 30,
                    years: ["2002", "2005", "2008", "2010", "2012", "2015", "2018", "2019", "2020", "2021", "2022", "2023", "2024"]
                },
                "regular-meetings": {
                    name: "정기모임",
                    count: 25,
                    years: ["1999", "2005", "2010", "2015", "2020", "2024", "2025"],
                    highlights: ["5월 은평한옥마을 봄나들이", "전통놀이 활동"]
                },
                "special-events": {
                    name: "특별행사",
                    count: 15,
                    years: ["2000", "2010", "2019", "2025"],
                    highlights: ["25주년 영상 제작", "봄봄축제 참가", "서대문지회 연합활동"]
                }
            }
        },
        activities: {
            name: "활동 사진",
            count: 45,
            subcategories: {
                "volunteer": {
                    name: "봉사활동",
                    count: 20,
                    years: ["2000", "2005", "2010", "2015", "2020", "2024"]
                },
                "reading": {
                    name: "독서모임",
                    count: 15,
                    years: ["1999", "2010", "2020", "2024"]
                },
                "author-meetings": {
                    name: "작가와의 만남",
                    count: 10,
                    years: ["2005", "2015", "2023", "2024"]
                }
            }
        },
        history: {
            name: "역사적 순간",
            count: 25,
            subcategories: {
                "founding": {
                    name: "창립",
                    count: 5,
                    year: "1999"
                },
                "anniversaries": {
                    name: "주년 기념",
                    count: 15,
                    years: ["2009", "2019", "2024"]
                },
                "milestones": {
                    name: "주요 이벤트",
                    count: 5,
                    years: ["2008", "2012", "2015", "2018", "2020"]
                }
            }
        },
        members: {
            name: "회원 활동",
            count: 20,
            subcategories: {
                "workshops": {
                    name: "워크샵",
                    count: 10,
                    years: ["2005", "2015", "2023", "2024"]
                },
                "exhibitions": {
                    name: "전시회",
                    count: 5,
                    years: ["2010", "2020", "2024"]
                },
                "gatherings": {
                    name: "모임",
                    count: 5,
                    years: ["1999", "2010", "2020", "2024"]
                }
            }
        }
    },
    
    // 샘플 이미지 데이터 생성 함수
    generateImages: function() {
        const images = [];
        let imageId = 1;
        
        // 각 카테고리별로 이미지 생성
        Object.entries(this.categories).forEach(([categoryKey, category]) => {
            Object.entries(category.subcategories).forEach(([subKey, subcategory]) => {
                const imageCount = subcategory.count;
                const categoryPath = `${categoryKey}/${subKey}`;
                
                // 각 서브카테고리별로 지정된 수만큼 이미지 생성
                for (let i = 0; i < imageCount; i++) {
                    let year;
                    if (subcategory.year) {
                        year = subcategory.year;
                    } else if (subcategory.years) {
                        year = subcategory.years[Math.floor(i * subcategory.years.length / imageCount)];
                    }
                    
                    const image = {
                        id: `img_${imageId}`,
                        category: categoryKey,
                        subcategory: subKey,
                        title: `${year}년 ${subcategory.name}`,
                        description: this.getDescription(categoryKey, subKey, year),
                        year: year,
                        thumbnail: `https://via.placeholder.com/400x300/${this.getColor(categoryKey)}?text=${encodeURIComponent(year + ' ' + subcategory.name)}`,
                        fullsize: `https://via.placeholder.com/1200x900/${this.getColor(categoryKey)}?text=${encodeURIComponent(year + ' ' + subcategory.name)}`,
                        tags: this.getTags(categoryKey, subKey),
                        location: this.getLocation(categoryKey, subKey)
                    };
                    
                    images.push(image);
                    imageId++;
                }
            });
        });
        
        return images;
    },
    
    // 카테고리별 색상 지정
    getColor: function(category) {
        const colors = {
            events: "FFB6C1/FF69B4",
            activities: "87CEEB/4682B4",
            history: "F0E68C/DAA520",
            members: "98FB98/32CD32"
        };
        return colors[category] || "E0E0E0/808080";
    },
    
    // 설명 생성
    getDescription: function(category, subcategory, year) {
        const descriptions = {
            events: {
                "autumn-sports": `${year}년 가을, 팀수양관에서 온 가족이 함께한 즐거운 운동회`,
                "regular-meetings": `${year}년 정기 모임에서 나눈 책 이야기와 친목의 시간`,
                "special-events": `${year}년에 개최된 특별한 행사와 축제의 순간들`
            },
            activities: {
                "volunteer": `${year}년 지역사회를 위한 책읽어주기 봉사활동`,
                "reading": `${year}년 독서모임에서 함께 나눈 깊이 있는 책 이야기`,
                "author-meetings": `${year}년 작가와의 특별한 만남과 강연`
            },
            history: {
                "founding": "1999년 은평지회 창립의 역사적인 순간",
                "anniversaries": `${year}년 주년 기념행사의 감동적인 순간들`,
                "milestones": `${year}년 은평지회의 중요한 이정표`
            },
            members: {
                "workshops": `${year}년 회원들을 위한 독서 교육 워크샵`,
                "exhibitions": `${year}년 그림책 원화 전시회와 독서 전시`,
                "gatherings": `${year}년 회원들의 따뜻한 친목 모임`
            }
        };
        
        return descriptions[category]?.[subcategory] || "은평지회의 소중한 순간";
    },
    
    // 태그 생성
    getTags: function(category, subcategory) {
        const tags = {
            events: {
                "autumn-sports": ["가을운동회", "팀수양관", "가족행사", "운동회"],
                "regular-meetings": ["정기모임", "월례모임", "독서모임", "화요일모임"],
                "special-events": ["특별행사", "기념행사", "축제", "이벤트"]
            },
            activities: {
                "volunteer": ["봉사활동", "책읽어주기", "도서관", "지역사회"],
                "reading": ["독서모임", "책읽기", "독서활동", "토론"],
                "author-meetings": ["작가", "작가와의만남", "작가초청", "강연"]
            },
            history: {
                "founding": ["창립", "1999", "초대회원", "시작"],
                "anniversaries": ["주년", "기념", "10주년", "20주년", "25주년"],
                "milestones": ["이정표", "성과", "주요사건", "역사"]
            },
            members: {
                "workshops": ["워크샵", "교육", "강의", "독서교육"],
                "exhibitions": ["전시회", "전시", "원화", "그림책"],
                "gatherings": ["모임", "친목", "회식", "송년회"]
            }
        };
        
        return tags[category]?.[subcategory] || [];
    },
    
    // 장소 생성
    getLocation: function(category, subcategory) {
        const locations = {
            events: {
                "autumn-sports": "팀수양관",
                "regular-meetings": "서울시 50+ 서부캠퍼스",
                "special-events": "은평구 문화시설"
            },
            activities: {
                "volunteer": "은평구립도서관",
                "reading": "은평구 도서관",
                "author-meetings": "은평문화예술회관"
            },
            history: {
                "founding": "은평구",
                "anniversaries": "은평구 문화시설",
                "milestones": "은평구"
            },
            members: {
                "workshops": "은평구립도서관",
                "exhibitions": "은평문화예술회관",
                "gatherings": "은평구"
            }
        };
        
        return locations[category]?.[subcategory] || "은평구";
    }
};

// 갤러리 이미지 생성
const galleryImages = galleryData.generateImages();
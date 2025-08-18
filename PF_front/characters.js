document.addEventListener('DOMContentLoaded', () => {

    // 13개 직무에 대한 데이터
    // 이미지 경로는 실제 파일 위치에 맞게 수정해주세요.
    const characterData = [
        { id: 'ai-engineer', name: '똑똑한 부엉이', job: 'AI 엔지니어', img: 'images/owl.png', traits: ['데이터로 모델 학습', '미래 예측 알고리즘', '인공지능 서비스 구현', '문제 해결사'] },
        { id: 'digital-marketer', name: '영리한 여우', job: '디지털 마케터', img: 'images/fox.png', traits: ['트렌드 캐처', '데이터 기반 전략가', '콘텐츠 크리에이터', '고객 심리 분석가'] },
        { id: 'software-engineer', name: '차분한 코알라', job: '소프트웨어 엔지니어', img: 'images/koala.png', traits: ['논리적인 코드 설계', '복잡한 문제 해결', '소프트웨어 아키텍처 구축', '팀 플레이어'] },
        { id: 'backend-developer', name: '든든한 곰', job: '백엔드 개발자', img: 'images/bear.png', traits: ['고성능 서버 구축', '보안 전문가', '데이터베이스 최적화', '시스템 아키텍처 설계', '버그 헌터'] },
        { id: 'frontend-developer', name: '창의적인 고양이', job: '프론트엔드 개발자', img: 'images/cat.png', traits: ['사용자 경험(UX) 설계', '인터랙티브 웹 구현', '디자인 시스템 구축', '웹 성능 최적화'] },
        { id: 'cyber-security', name: '용감한 사자', job: '사이버 보안 엔지니어', img: 'images/lion.png', traits: ['시스템 취약점 분석', '해킹 시도 탐지 및 대응', '데이터 암호화 및 보호', '네트워크 보안 전문가'] },
        { id: 'data-engineer', name: '기억력 좋은 코끼리', job: '데이터 엔지니어', img: 'images/elephant.png', traits: ['데이터 파이프라인 구축', '데이터 수집, 정제, 가공', '안정적인 인프라 설계', '데이터 처리 자동화'] },
        { id: 'cloud-architect', name: '높이 나는 독수리', job: '클라우드 솔루션 아키텍트', img: 'images/eagle.png', traits: ['클라우드 시스템 설계', '최적의 IT 청사진 제시', '비용 효율적인 인프라 구축', '기술 컨설턴트'] },
        { id: 'data-scientist', name: '분석가 펭귄', job: '데이터 과학자', img: 'images/penguin.png', traits: ['데이터 속 인사이트 발굴', '통계 및 머신러닝 모델링', '데이터 시각화 전문가', '비즈니스 문제 해결사'] },
        { id: 'iot-architect', name: '바쁜 다람쥐', job: 'IoT 아키텍트', img: 'images/squirrel.png', traits: ['사물과 인터넷 연결', '실시간 데이터 처리', '수많은 기기들의 통신 설계', 'IoT 보안 전문가'] },
        { id: 'robotics-engineer', name: '손재주 좋은 너구리', job: '로봇 엔지니어', img: 'images/racoon.png', traits: ['로봇 하드웨어 설계', '로봇의 움직임 제어', '소프트웨어 프로그래밍', '센서를 활용한 환경 인식'] },
        { id: 'self-driving', name: '빠른 말', job: '자율주행차 엔지니어', img: 'images/horse.png', traits: ['자동차의 눈(인지) 개발', '자동차의 뇌(판단) 설계', '안전한 주행 경로 탐색', '센서 퓨전 전문가'] },
        { id: 'computer-vision', name: '예리한 사슴', job: '컴퓨터 비전 엔지니어', img: 'images/deer.png', traits: ['컴퓨터에게 보는 법 교육', '이미지/영상 데이터 분석', '객체 탐지 및 얼굴 인식', '딥러닝 모델링 전문가'] }
    ];

    const grid = document.querySelector('.character-grid');
    const detailView = document.getElementById('character-detail');

    // 1. 캐릭터 카드 생성 및 그리드에 추가
    characterData.forEach(char => {
        const card = document.createElement('button');
        card.className = 'character-card';
        card.dataset.id = char.id; // 각 카드에 고유 id 부여
        
        card.innerHTML = `
            <img src="${char.img}" alt="${char.name}">
            <div class="character-name">${char.name}</div>
            <div class="job-title">${char.job} 역</div>
        `;
        
        grid.appendChild(card);
    });
    
    // 2. 캐릭터 카드 클릭 이벤트 처리
    const cards = document.querySelectorAll('.character-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const charId = card.dataset.id;
            const selectedChar = characterData.find(c => c.id === charId);
            
            updateDetailView(selectedChar);
            
            grid.classList.add('dimmed'); // 그리드 흐리게
            grid.style.pointerEvents = 'none'; // 그리드 내 다른 카드 클릭 방지
            detailView.classList.remove('hidden');
        });
    });

    // 3. 상세 정보 창 업데이트 함수
    function updateDetailView(char) {
        document.getElementById('detail-img').src = char.img;
        document.getElementById('detail-character-name').innerText = char.name;
        document.getElementById('detail-job-tag').innerText = char.job;
        
        const traitsList = document.getElementById('detail-characteristics');
        traitsList.innerHTML = ''; // 기존 목록 초기화
        char.traits.forEach(trait => {
            const li = document.createElement('li');
            li.innerText = trait;
            traitsList.appendChild(li);
        });
    }

    // 4. '모험 시작하기' 버튼 이벤트
    document.getElementById('start-adventure').addEventListener('click', () => {
        // 선택된 캐릭터의 직무 이름을 기반으로 다음 페이지로 이동 (예시)
        const jobTitle = document.getElementById('detail-job-tag').innerText;
        alert(`'${jobTitle}' 직무 체험을 시작합니다! (다음 페이지로 이동)`);
        // window.location.href = `quest.html?job=${jobTitle}`;
    });
});
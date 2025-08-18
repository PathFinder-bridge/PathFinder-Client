document.addEventListener('DOMContentLoaded', () => {

    const resultsContainer = document.getElementById('results-container');
    const roadmapButton = document.getElementById('go-to-roadmap');

    // 각 직무에 대한 설명 데이터 (백엔드에서 보내주지 않아도 되도록 프론트에 저장)
    const jobDescriptions = {
        'AI 엔지니어': '인공지능 모델을 설계, 개발, 배포하며, 머신러닝, 딥러닝 기술을 활용하여 다양한 문제 해결에 기여합니다.',
        '백엔드 개발자': '서버, 데이터베이스, 애플리케이션 로직 등 사용자에게 보이지 않는 시스템 뒷단을 개발하고 관리합니다.',
        '데이터 과학자': '다양한 데이터를 분석하여 비즈니스 인사이트를 도출하고, 통계 및 머신러닝 기법을 활용하여 예측 모델을 만듭니다.',
        // ... 나머지 13개 직무에 대한 설명을 모두 추가 ...
        '소프트웨어 엔지니어': '소프트웨어 개발의 전 과정을 담당하며, 코딩, 디버깅, 시스템 아키텍처 설계 등을 수행합니다.',
        '데이터 엔지니어': '대규모 데이터를 수집, 처리, 저장하는 데이터 파이프라인을 구축하고 운영하여 데이터 분석을 지원합니다.'
    };
    
    // API 호출 시뮬레이션 함수
    async function fetchRecommendations() {
        // 1. 이전 페이지들에서 localStorage에 저장된 사용자 데이터를 가져온다고 가정
        const userSkills = "Python, SQL, 데이터 분석"; // JSON.parse(localStorage.getItem('userSkills'));
        const quizAnswers = [2, 0, 1, 2, 2, -1, 0, 1, 2, 1, 2, 1]; // JSON.parse(localStorage.getItem('quizAnswers'));
        const interestedJob = "데이터 과학자"; // localStorage.getItem('interestedJob');
        
        const userData = {
            skills: userSkills,
            quiz_answers: quizAnswers,
            interested_job: interestedJob
        };

        console.log("서버로 전송할 데이터:", userData);
        
        // 2. 실제로는 fetch API를 사용하여 백엔드에 요청을 보냅니다.
        // const response = await fetch('http://<내 서버 IP>:5000/recommend', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(userData)
        // });
        // const recommendations = await response.json();

        // 3. 지금은 하드코딩된 '가짜' 응답 데이터로 시뮬레이션합니다.
        const mockRecommendations = [
            { "JobTitle_ko_norm": "AI 엔지니어", "final_score": 0.66 },
            { "JobTitle_ko_norm": "백엔드 개발자", "final_score": 0.50 },
            { "JobTitle_ko_norm": "데이터 과학자", "final_score": 0.43 }
        ];

        // 1.5초 딜레이를 주어 로딩 효과를 시뮬레이션
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockRecommendations);
            }, 1500);
        });
    }

    // 추천 결과를 받아 화면에 카드를 그리는 함수
    function renderResults(recommendations) {
        // 로딩 메시지 제거
        resultsContainer.innerHTML = '';

        recommendations.forEach(job => {
            const jobTitle = job.JobTitle_ko_norm;
            // 점수(0~1)를 퍼센트(0~100)로 변환
            const percentage = Math.round(job.final_score * 100); 
            const description = jobDescriptions[jobTitle] || "직무에 대한 설명이 준비중입니다.";

            const card = document.createElement('div');
            card.className = 'result-card';
            card.innerHTML = `
                <h3>${jobTitle}</h3>
                <div class="percentage">${percentage}% 일치</div>
                <p class="description">${description}</p>
            `;
            
            // 카드를 클릭하면 해당 직무의 로드맵 페이지로 이동 (예시)
            card.addEventListener('click', () => {
                window.location.href = `roadmap.html?job=${jobTitle}`;
            });

            resultsContainer.appendChild(card);
        });
    }

    // 페이지가 로드되면 추천 프로세스 시작
    fetchRecommendations().then(renderResults);

    // 하단 버튼 클릭 이벤트
    roadmapButton.addEventListener('click', () => {
        alert("전체 직무에 대한 로드맵 페이지로 이동합니다.");
        window.location.href = 'roadmap.html';
    });
});
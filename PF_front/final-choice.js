document.addEventListener('DOMContentLoaded', () => {

    // 캐릭터 데이터 (characters.js와 동일한 데이터)
    const characterData = [
        { id: 'ai-engineer', name: '똑똑한 부엉이', job: 'AI 엔지니어', img: 'images/owl.png' },
        { id: 'digital-marketer', name: '영리한 여우', job: '디지털 마케터', img: 'images/fox.png' },
        { id: 'software-engineer', name: '차분한 코알라', job: '소프트웨어 엔지니어', img: 'images/koala.png' },
        { id: 'backend-developer', name: '든든한 곰', job: '백엔드 개발자', img: 'images/bear.png' },
        { id: 'frontend-developer', name: '창의적인 고양이', job: '프론트엔드 개발자', img: 'images/cat.png' },
        { id: 'cyber-security', name: '용감한 사자', job: '사이버 보안 엔지니어', img: 'images/lion.png' },
        { id: 'data-engineer', name: '기억력 좋은 코끼리', job: '데이터 엔지니어', img: 'images/elephant.png' },
        { id: 'cloud-architect', name: '높이 나는 독수리', job: '클라우드 솔루션 아키텍트', img: 'images/eagle.png' },
        { id: 'data-scientist', name: '분석가 펭귄', job: '데이터 과학자', img: 'images/penguin.png' },
        { id: 'iot-architect', name: '바쁜 다람쥐', job: 'IoT 아키텍트', img: 'images/squirrel.png' },
        { id: 'robotics-engineer', name: '손재주 좋은 너구리', job: '로봇 엔지니어', img: 'images/racoon.png' },
        { id: 'self-driving', name: '빠른 말', job: '자율주행차 엔지니어', img: 'images/horse.png' },
        { id: 'computer-vision', name: '예리한 사슴', job: '컴퓨터 비전 엔지니어', img: 'images/deer.png' }
    ];

    const grid = document.querySelector('.character-grid');
    let selectedJob = null;

    // 1. 캐릭터 카드 동적 생성
    characterData.forEach(char => {
        const card = document.createElement('button');
        card.className = 'character-card';
        card.dataset.id = char.id;
        card.dataset.job = char.job; // 직무 이름도 데이터로 저장

        card.innerHTML = `
            <img src="${char.img}" alt="${char.name}">
            <div class="character-name">${char.name}</div>
            <div class="job-title">${char.job} 역</div>
        `;
        grid.appendChild(card);
    });

    // 2. 캐릭터 선택 로직
    grid.addEventListener('click', (event) => {
        const clickedCard = event.target.closest('.character-card');
        if (!clickedCard) return;

        // 모든 카드의 'selected' 클래스 제거
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });

        // 클릭된 카드에만 'selected' 클래스 추가
        clickedCard.classList.add('selected');
        selectedJob = clickedCard.dataset.job; // 선택된 직무 이름 저장
        console.log(`선택된 직무: ${selectedJob}`);
    });

    // 3. 제출하기 버튼 클릭 이벤트
    const submitButton = document.getElementById('submit-recommendation');
    submitButton.addEventListener('click', () => {
        if (!selectedJob) {
            alert('가장 재밌었던 직무를 선택해주세요!');
            return;
        }

        // --- 실제 서비스에서는 이전에 입력받은 모든 정보를 취합합니다 ---
        // 예시: localStorage에서 스킬과 퀴즈 답변을 가져온다고 가정
        const userSkills = "Python, 데이터 분석, 머신러닝"; // localStorage.getItem('userSkills');
        const quizAnswers = [2, -1, 2, 1, 2, 2, -2, 0, -1, 1, 2, 1]; // JSON.parse(localStorage.getItem('quizAnswers'));

        // 서버에 보낼 최종 데이터 객체
        const finalUserData = {
            skills: userSkills,
            quiz_answers: quizAnswers,
            interested_job: selectedJob
        };

        console.log('서버에 전송할 최종 데이터:', finalUserData);
        alert(`최종 선택: ${selectedJob}\n이 정보를 바탕으로 서버에 최종 추천을 요청합니다!`);

        // 이제 이 finalUserData를 가지고 fetch를 통해 백엔드 API('/recommend')에 요청을 보냅니다.
        // fetch('http://<내 서버 IP>:5000/recommend', { ... })
        //   .then(response => response.json())
        //   .then(result => {
        //      localStorage.setItem('recommendResult', JSON.stringify(result));
        //      window.location.href = 'results.html';
        //   });
        
        // 지금은 시뮬레이션으로 바로 결과 페이지로 이동합니다.
        window.location.href = 'results.html';
    });
});
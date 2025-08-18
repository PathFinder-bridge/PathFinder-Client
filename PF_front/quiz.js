document.addEventListener('DOMContentLoaded', () => {
    const quizData = [
        "마케팅과 관련된 활동에 관심이 많습니다.",
        "AI 기술과 관련된 뉴스나 개발 소식에 관심이 많습니다.",
        "웹사이트나 앱을 볼 때, ‘더 예쁘게 만들거나 더 편리하게 바꿀 수 있겠다’는 생각을 자주 합니다.",
        "눈에 보이는 결과물보다는, 보이지 않는 곳에서 시스템이 착착 돌아가도록 논리적인 규칙을 만드는 것을 더 좋아합니다.",
        "레고 블록을 조립하듯, 여러 부품을 합쳐 하나의 큰 구조나 계획을 설계하는 것을 즐깁니다.",
        "어질러진 데이터를 깔끔하게 정리하고, 필요할 때 바로 꺼내 쓸 수 있도록 효율적인 저장 시스템을 구축하는 것에 흥미를 느낍니다.",
        "데이터 속에서 의미 있는 정보나 패턴을 발견하고 그 이유를 파헤치는 것을 좋아합니다.",
        "시스템의 허점을 미리 찾아내고 외부의 공격을 막는 전략을 세우는 것에 매력을 느낍니다.",
        "일상 속 사물들을 인터넷으로 연결해서 원격으로 제어하는 기술이 재미있을 것 같습니다.",
        "정교한 기계나 로봇이 부드럽게 움직이도록 만드는 원리가 궁금합니다.",
        "컴퓨터가 사진이나 동영상을 보고 그 안의 사물이나 사람을 알아보게 하는 기술에 관심이 많습니다.",
        "자율주행 자동차가 어떻게 세상을 ‘보고’ 스스로 판단하여 안전하게 움직이는지 그 원리가 매우 궁금합니다."
    ];
    const totalQuestions = quizData.length;
    const userAnswers = new Array(totalQuestions).fill(null);
    let answeredCount = 0;

    const quizContainer = document.getElementById('quiz-container');
    const progressIndicator = document.getElementById('progress-indicator');
    const submitButton = document.getElementById('submit-quiz-btn');

    // 1. 모든 질문 카드를 동적으로 생성
    quizData.forEach((question, index) => {
        const card = document.createElement('div');
        card.className = 'quiz-card-new';
        card.id = `question-card-${index}`;
        card.innerHTML = `
            <div class="card-header">
                <div class="bot-info">
                    <img src="images/bot-icon.png" alt="Path봇">
                    <p>${question}</p>
                </div>
                <span class="question-num">Q${index + 1}</span>
            </div>
            <div class="likert-scale">
                <span>동의하지 않음</span>
                <div class="options" data-question-index="${index}">
                    <button class="option" data-value="-2"></button>
                    <button class="option" data-value="-1"></button>
                    <button class="option" data-value="0"></button>
                    <button class="option" data-value="1"></button>
                    <button class="option" data-value="2"></button>
                </div>
                <span>동의함</span>
            </div>
            <div class="selection-status"></div>
        `;
        quizContainer.appendChild(card);
    });

    // 2. 답변 버튼에 이벤트 리스너 추가 (이벤트 위임)
    quizContainer.addEventListener('click', (event) => {
        if (!event.target.classList.contains('option')) return;

        const button = event.target;
        const optionsDiv = button.parentElement;
        const questionIndex = parseInt(optionsDiv.dataset.questionIndex);
        const answerValue = parseInt(button.dataset.value);

        // 이전에 답변하지 않았을 때만 카운트 증가
        if (userAnswers[questionIndex] === null) {
            answeredCount++;
        }
        userAnswers[questionIndex] = answerValue;

        // UI 업데이트
        updateCardUI(questionIndex, button);
        updateProgress();
        moveToNextQuestion(questionIndex);
    });

    // 3. 카드 UI 업데이트 함수
    function updateCardUI(index, selectedButton) {
        const card = document.getElementById(`question-card-${index}`);
        // 선택 초기화
        card.querySelectorAll('.option').forEach(btn => btn.classList.remove('selected'));
        // 현재 선택 하이라이트
        selectedButton.classList.add('selected');
        
        const selectionText = ['매우 동의하지 않음', '동의하지 않음', '보통', '동의함', '매우 동의함'][parseInt(selectedButton.dataset.value) + 2];
        card.querySelector('.selection-status').textContent = `선택: ${selectionText}`;
    }

    // 4. 진행 상태 업데이트 함수
    function updateProgress() {
        progressIndicator.textContent = `(${answeredCount}/${totalQuestions})`;
        if (answeredCount === totalQuestions) {
            submitButton.classList.remove('hidden');
        }
    }

    // 5. 다음 질문으로 스크롤하는 함수
    function moveToNextQuestion(currentIndex) {
        const currentCard = document.getElementById(`question-card-${currentIndex}`);
        currentCard.classList.remove('next-question');

        if (currentIndex + 1 < totalQuestions) {
            const nextCard = document.getElementById(`question-card-${currentIndex + 1}`);
            nextCard.classList.add('next-question');
            // 0.5초 후 스크롤
            setTimeout(() => {
                nextCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }

    // 6. 제출 버튼 이벤트
    submitButton.addEventListener('click', () => {
        console.log("최종 답변:", userAnswers);
        alert("모든 질문에 답변했습니다. 스킬 선택 단계로 이동합니다.");
        
        // localStorage에 답변 저장 후 다음 페이지로 이동
        // localStorage.setItem('quizAnswers', JSON.stringify(userAnswers));
        window.location.href = 'skills.html';
    });

    // 초기 설정: 첫 번째 질문에 하이라이트
    document.getElementById('question-card-0').classList.add('next-question');
    progressIndicator.textContent = `(0/${totalQuestions})`;
});
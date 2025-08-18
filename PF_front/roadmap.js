document.addEventListener('DOMContentLoaded', () => {
    const jobSidebar = document.getElementById('job-sidebar');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');

    // --- 데이터 (이전 페이지들로부터 가져왔다고 가정) ---
    // 실제로는 localStorage에서 가져옵니다.
    const mockResults = [
        { "JobTitle_ko_norm": "데이터 과학자", "final_score": 0.85 },
        { "JobTitle_ko_norm": "AI 엔지니어", "final_score": 0.78 },
        { "JobTitle_ko_norm": "데이터 엔지니어", "final_score": 0.65 }
    ];
    const jobDescriptions = {
        '데이터 과학자': '다양한 데이터를 분석하여 비즈니스 인사이트를 도출하고, 통계 및 머신러닝 기법을 활용하여 예측 모델을 만듭니다.',
        'AI 엔지니어': '인공지능 모델을 설계, 개발, 배포하며, 머신러닝, 딥러닝 기술을 활용하여 다양한 문제 해결에 기여합니다.',
        '데이터 엔지니어': '대규모 데이터를 수집, 처리, 저장하는 데이터 파이프라인을 구축하고 운영하여 데이터 분석을 지원합니다.'
    };

    // 1. 사이드바에 추천 직무 카드 생성
    function populateSidebar() {
        mockResults.forEach(job => {
            const card = document.createElement('div');
            card.className = 'sidebar-card';
            card.innerHTML = `
                <h4>${job.JobTitle_ko_norm}</h4>
                <div class="percentage">${Math.round(job.final_score * 100)}% 일치</div>
                <p>${jobDescriptions[job.JobTitle_ko_norm]}</p>
            `;
            jobSidebar.appendChild(card);
        });
    }

    // 2. 챗봇에 메시지 추가하는 함수
    function displayMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="bot-profile">
                    <img src="images/bot-icon.png" alt="Path봇">
                    <span>Path봇</span>
                </div>
                <div class="message-content">${text}</div>
            `;
        } else {
            messageDiv.innerHTML = `<div class="message-content">${text}</div>`;
        }
        chatWindow.appendChild(messageDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight; // 항상 마지막 메시지가 보이도록 스크롤
    }

    // 3. ChatGPT API 호출 시뮬레이션
    async function getBotResponse(userInput) {
        displayMessage("생각 중...", "bot"); // '입력 중' 인디케이터

        // --- ❗ 실제 ChatGPT API 연동 지점 ---
        // 실제 서비스에서는 이 부분에서 백엔드 API(/api/chat)에 userInput을 보내고 응답을 받습니다.
        // const response = await fetch('/api/chat', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ message: userInput })
        // });
        // const data = await response.json();
        // const botReply = data.reply;
        
        // 지금은 시뮬레이션으로 1.5초 후 가짜 응답을 생성합니다.
        await new Promise(resolve => setTimeout(resolve, 1500));

        let botReply = "흥미로운 질문이네요! 하지만 지금은 답변을 준비하지 못했어요. 다른 질문을 해주시겠어요?";
        if (userInput.includes("로드맵")) {
            const job = userInput.split(" ").find(word => jobDescriptions.hasOwnProperty(word)) || "AI 엔지니어";
            botReply = `
                <p>네, <strong>${job}</strong>의 3개월 단기 로드맵을 안내해 드릴게요.</p>
                <ul>
                    <li><strong>1개월차:</strong> 프로그래밍 기초(Python) 및 핵심 라이브러리 학습</li>
                    <li><strong>2개월차:</strong> 직무 관련 심화 기술 및 미니 프로젝트 진행</li>
                    <li><strong>3개월차:</strong> 포트폴리오용 개인 프로젝트 완성 및 배포</li>
                </ul>
                <p>더 자세한 정보가 필요하시면 말씀해주세요!</p>
            `;
        }
        
        // '생각 중...' 메시지를 실제 답변으로 교체
        chatWindow.lastChild.querySelector('.message-content').innerHTML = botReply;
    }

    // 4. 전송 버튼 및 Enter 키 이벤트 처리
    function handleSend() {
        const userInput = chatInput.value.trim();
        if (userInput) {
            displayMessage(userInput, 'user');
            getBotResponse(userInput);
            chatInput.value = '';
        }
    }
    
    sendButton.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleSend();
        }
    });

    // --- 페이지 초기화 ---
    populateSidebar();
});
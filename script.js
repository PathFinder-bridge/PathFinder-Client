const questions = [
    "마케팅과 관련된 활동에 관심이 많습니다.",
    "AI 기술과 관련된 뉴스나 개발 소식에 관심이 많습니다.",
    "소프트웨어 개발이나 프로그래밍에 흥미가 있습니다.",
    "데이터를 수집하고 정제하는 과정에 흥미가 있습니다.",
    "데이터를 분석하여 인사이트를 도출하는 일에 관심이 많습니다.",
    "자연어 처리나 언어학에 관심이 많습니다.",
    "IoT 기술이나 사물인터넷에 관심이 많습니다.",
    "클라우드 기술이나 인프라 구축에 관심이 많습니다.",
    "머신러닝 알고리즘과 AI 모델 개발에 관심이 많습니다.",
    "보안과 관련된 뉴스나 이슈에 관심이 많습니다.",
    "자율주행차나 자동화 기술에 관심이 많습니다.",
    "로봇이나 하드웨어 제어에 관심이 많습니다.",
    "서버나 백엔드 시스템 개발에 관심이 많습니다."
];

const jobTypes = [
    "마케팅 매니저", "AI 엔지니어", "소프트웨어 엔지니어", "데이터 엔지니어", 
    "데이터 과학자", "NLP 엔지니어", "IoT 아키텍트", "클라우드 솔루션 아키텍트",
    "머신 러닝 엔지니어", "사이버 보안 엔지니어", "자율주행차 엔지니어", 
    "로봇 엔지니어", "백엔드 개발자"
];

// 직무별 가중치 매트릭스 (unchanged)
const jobWeights = [
    [0.3, 0.0409, 0.0409, 0.0409, 0.25, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409],
    [0.025, 0.3, 0.025, 0.025, 0.025, 0.2, 0.025, 0.025, 0.25, 0.025, 0.025, 0.025, 0.025],
    [0.0409, 0.0409, 0.3, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.25],
    [0.0409, 0.25, 0.0409, 0.3, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409, 0.0409],
    [0.025, 0.25, 0.025, 0.025, 0.3, 0.025, 0.025, 0.025, 0.2, 0.025, 0.025, 0.025, 0.025],
    [0.025, 0.2, 0.025, 0.025, 0.25, 0.3, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025],
    [0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.3, 0.025, 0.025, 0.025, 0.2, 0.25, 0.025],
    [0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.3, 0.025, 0.2, 0.025, 0.025, 0.25],
    [0.025, 0.25, 0.025, 0.025, 0.2, 0.025, 0.025, 0.025, 0.3, 0.025, 0.025, 0.025, 0.025],
    [0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.25, 0.025, 0.3, 0.025, 0.025, 0.2],
    [0.025, 0.2, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.3, 0.25, 0.025],
    [0.025, 0.025, 0.025, 0.025, 0.025, 0.025, 0.25, 0.025, 0.025, 0.025, 0.2, 0.3, 0.025],
    [0.025, 0.025, 0.2, 0.025, 0.025, 0.025, 0.025, 0.25, 0.025, 0.025, 0.025, 0.025, 0.3]
];

// New skills list
const skills = [
    'Python', '데이터 분석', '머신러닝', '클라우드 컴퓨팅', '디지털 마케팅',
    '팀 리더십', '딥러닝', '프로젝트 관리', '자연어 처리', '컴퓨터 비전',
    'C++', '팀 관리', 'Java', '텐서플로우', '소셜 미디어 마케팅',
    '애자일 방법론', 'DevOps', 'SQL', '커뮤니케이션', 'R'
];

let currentQuestion = 0;
let answers = [];
let selectedValue = null;
let selectedSkills = []; // To store selected skills

// DOM 요소들
const quizCount = document.getElementById('quiz-count');
const progressFill = document.getElementById('progress-fill');
const chatContainer = document.getElementById('chat-container');
const quizSection = document.getElementById('quiz-section');
const skillSelectionSection = document.getElementById('skill-selection-section'); // New
const skillGrid = document.getElementById('skill-grid'); // New
const skillConfirmButton = document.getElementById('skill-confirm-button'); // New
const resultsSection = document.getElementById('results-section');
const jobRecommendations = document.getElementById('job-recommendations');
const roadmapSection = document.getElementById('roadmap-section');
const roadmapContainer = document.getElementById('roadmap-container'); // New

// 네비게이션 로드맵 메뉴 클릭 시 챗봇 UI만 보이기
const navRoadmap = document.getElementById('nav-roadmap');
const mainContainer = document.querySelector('main.container');
// resultsSection, roadmapSection, chatbotSection, roadmapContainer는 이미 상단에서 선언됨

if (navRoadmap) {
    navRoadmap.addEventListener('click', function(e) {
        e.preventDefault();
        // 모든 주요 섹션 숨김
        const allSections = [
            document.getElementById('quiz-section'),
            document.getElementById('skill-selection-section'),
            document.getElementById('results-section'),
            document.getElementById('roadmap-section'),
            document.querySelector('main.container')
        ];
        allSections.forEach(sec => { if (sec) sec.style.display = 'none'; });
        // 챗봇만 보이기
        if (chatbotSection) chatbotSection.style.display = 'block';
        showRoadmapChatbotStandalone();
    });
}

// 단독 챗봇 로드맵 페이지용 함수
function showRoadmapChatbotStandalone() {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    chatbotMessages.innerHTML = '';
    chatbotInput.value = '';
    addChatbotMessage('bot', '안녕하세요! 궁금한 직무명을 입력하시면 1년/6개월/3개월 로드맵을 안내해드릴게요.\n예시: AI 엔지니어, 데이터 과학자, 백엔드 개발자 등');
    chatbotSend.onclick = handleStandaloneChatbotInput;
    chatbotInput.onkeypress = function(e) {
        if (e.key === 'Enter') handleStandaloneChatbotInput();
    };
    function handleStandaloneChatbotInput() {
        const msg = chatbotInput.value.trim();
        if (!msg) return;
        addChatbotMessage('user', msg);
        chatbotInput.value = '';
        // 직무명 입력 시 로드맵 안내
        const roadmap = getJobRoadmap(msg);
        if (roadmap && Array.isArray(roadmap)) {
            roadmap.forEach(period => {
                let text = `<b>${period.title}</b> (${period.subtitle})<br/>`;
                period.items.forEach(item => {
                    text += `- <b>${item.title}</b>: ${item.description}<br/>`;
                });
                addChatbotMessage('bot', text);
            });
            addChatbotMessage('bot', '로드맵에 대해 더 궁금한 점이 있으면 질문해 주세요! 예: "3개월 과정에서 중요한 건?"');
        } else {
            setTimeout(() => {
                addChatbotMessage('bot', '죄송해요, 해당 직무에 대한 로드맵 정보를 찾을 수 없습니다. 다른 직무명을 입력해 주세요!');
            }, 700);
        }
    }
}

// 초기화
function init() {
    updateQuizCount();
    updateProgressBar();
    showCurrentQuestion();
}

// 퀴즈 카운트 업데이트
function updateQuizCount() {
    quizCount.textContent = `(${currentQuestion + 1}/${questions.length})`;
}

// 프로그레스 바 업데이트
function updateProgressBar() {
    // Progress bar for the first 13 questions
    if (currentQuestion < questions.length) {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    } else {
        // Once questions are done, you might want to show full or a different progress
        progressFill.style.width = '100%'; 
    }
}

// 현재 질문 표시
function showCurrentQuestion() {
    const questionDiv = document.createElement('div');
    questionDiv.className = 'chat-message current';
    questionDiv.innerHTML = `
        <div class="question-header">
            <div class="question-icon">🤖</div>
            <div class="question-text">${questions[currentQuestion]}</div>
            <div class="question-number">Q${currentQuestion + 1}</div>
        </div>
        <div class="rating-scale">
            <span class="scale-label">동의하지 않음</span>
            <div class="scale-options">
                <div class="scale-option disagree" data-value="1"></div>
                <div class="scale-option disagree" data-value="2"></div>
                <div class="scale-option neutral" data-value="3"></div>
                <div class="scale-option agree" data-value="4"></div>
                <div class="scale-option agree" data-value="5"></div>
            </div>
            <span class="scale-label">동의함</span>
        </div>
    `;
    
    chatContainer.appendChild(questionDiv);
    
    // 스크롤을 아래로
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // 선택지 이벤트 리스너 추가
    const scaleOptions = questionDiv.querySelectorAll('.scale-option');
    scaleOptions.forEach(option => {
        option.addEventListener('click', function() {
            selectAnswer(this, scaleOptions, questionDiv);
        });
    });
}

// 답변 선택
function selectAnswer(selectedOption, allOptions, questionDiv) {
    selectedValue = parseInt(selectedOption.dataset.value);
    
    // 모든 선택지 초기화
    allOptions.forEach(opt => opt.classList.remove('selected'));
    
    // 선택된 옵션 표시
    selectedOption.classList.add('selected');
    
    // 답변 저장
    answers.push(selectedValue);
    
    // 답변된 질문 표시 업데이트
    questionDiv.classList.remove('current');
    questionDiv.classList.add('answered');
    
    // 선택된 답변 표시
    const answerText = getAnswerText(selectedValue);
    const answerDiv = document.createElement('div');
    answerDiv.className = 'selected-answer';
    answerDiv.textContent = `선택: ${answerText}`;
    questionDiv.appendChild(answerDiv);
    
    // 다음 질문으로 이동 or Show Skill Selection
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            updateQuizCount();
            updateProgressBar();
            showCurrentQuestion();
        } else {
            // All 13 initial questions are answered, now show skill selection
            showSkillSelection();
        }
    }, 800);
}

// 답변 텍스트 반환
function getAnswerText(value) {
    const answerTexts = {
        1: "전혀 동의하지 않음",
        2: "동의하지 않음",
        3: "보통",
        4: "동의함",
        5: "매우 동의함"
    };
    return answerTexts[value];
}

// New: Show Skill Selection Section
function showSkillSelection() {
    quizSection.style.display = 'none';
    skillSelectionSection.classList.add('active');

    // Dynamically create skill buttons
    skillGrid.innerHTML = ''; // Clear previous buttons
    skills.forEach(skill => {
        const button = document.createElement('button');
        button.className = 'skill-button';
        button.textContent = skill;
        button.addEventListener('click', () => {
            button.classList.toggle('selected');
            updateSelectedSkills(skill);
        });
        skillGrid.appendChild(button);
    });

    // Event listener for the confirm button
    skillConfirmButton.onclick = () => {
        // Now that skills are selected, proceed to show job recommendations
        showResults();
    };
}

// New: Update selected skills array
function updateSelectedSkills(skill) {
    const index = selectedSkills.indexOf(skill);
    if (index > -1) {
        // Skill was already selected, remove it
        selectedSkills.splice(index, 1);
    } else {
        // Skill was not selected, add it
        selectedSkills.push(skill);
    }
    console.log("Selected Skills:", selectedSkills); // For debugging
}


// Result display (called after skills are selected)
function showResults() {
    // Hide skill selection and show results
    skillSelectionSection.style.display = 'none';
    resultsSection.classList.add('active');
    
    // AI 모델 API 호출 (now includes selectedSkills)
    callAIModelAPI(answers, selectedSkills);
}


// AI 모델 API 호출 (modified to accept skills)
async function callAIModelAPI(answers, selectedSkills) {
    try {
        const response = await fetch('http://localhost:8080/api/quiz-recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Send both answers and selectedSkills
            body: JSON.stringify({ answers: answers, skills: selectedSkills })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            displayAIRecommendations(data);
        } else {
            // API 호출 실패 시 기존 로직 사용
            console.error('AI 모델 API 호출 실패:', data.error);
            const recommendations = calculateJobRecommendations(answers); // This fallback does not use skills
            displayRecommendations(recommendations);
        }
    } catch (error) {
        console.error('API 호출 중 오류:', error);
        // 오류 발생 시 기존 로직 사용
        const recommendations = calculateJobRecommendations(answers); // This fallback does not use skills
        displayRecommendations(recommendations);
    }
}

// AI 모델 기반 추천 결과 표시 (상위 3개만)
function displayAIRecommendations(data) {
    jobRecommendations.innerHTML = '';
    // AI 예측 결과 카드는 그대로
    const aiPredictionCard = document.createElement('div');
    aiPredictionCard.className = 'job-card ai-prediction';
    aiPredictionCard.style.animationDelay = '0s';
    aiPredictionCard.innerHTML = `
        <div class="ai-badge">🤖 AI 예측</div>
        <h3 class="job-title">${data.predicted_job}</h3>
        <p class="job-match" style="color: #10b981">${(data.confidence * 100).toFixed(1)}% 신뢰도</p>
        <p class="job-description">
            ${getJobDescription(data.predicted_job)}
        </p>
        <p class="skills-used"><strong>분석된 스킬:</strong> ${data.skills_used || 'N/A'}</p>
    `;
    jobRecommendations.appendChild(aiPredictionCard);
    // 상위 3개만 사용
    const top3 = data.recommendations.slice(0, 3);
    top3.forEach((rec, index) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.style.animationDelay = `${(index + 1) * 0.2}s`;
        const matchColor = rec.similarity_score >= 0.8 ? '#10b981' : 
                             rec.similarity_score >= 0.6 ? '#f59e0b' : '#6b7280';
        jobCard.innerHTML = `
            <h3 class="job-title">${rec.job_title}</h3>
            <p class="job-match" style="color: ${matchColor}">${(rec.similarity_score * 100).toFixed(1)}% 유사도</p>
            <p class="job-description">
                ${getJobDescription(rec.job_title)}
            </p>
            <p class="skills-required"><strong>필요 스킬:</strong> ${rec.skills || 'N/A'}</p>
        `;
        jobRecommendations.appendChild(jobCard);
    });
    setTimeout(() => {
        showRoadmapSection(top3);
    }, 2000);
}

function getJobDescription(jobTitle) {
    const descriptions = {
        "마케팅 매니저": "제품이나 서비스의 시장 분석, 전략 수립, 홍보 및 판매 촉진 활동을 기획하고 실행합니다.",
        "AI 엔지니어": "인공지능 모델을 설계, 개발, 배포하며, 머신러닝, 딥러닝 기술을 활용하여 다양한 문제 해결에 기여합니다.",
        "소프트웨어 엔지니어": "다양한 소프트웨어 애플리케이션 및 시스템을 설계, 개발, 테스트, 배포하고 유지보수합니다.",
        "데이터 엔지니어": "대규모 데이터를 수집, 저장, 처리, 관리하는 데이터 파이프라인을 구축하고 최적화하는 전문가입니다.",
        "데이터 과학자": "다양한 데이터를 분석하여 비즈니스 인사이트를 도출하고, 통계 및 머신러닝 기법을 활용하여 예측 모델을 만듭니다.",
        "NLP 엔지니어": "자연어 처리(NLP) 기술을 연구하고 개발하여 텍스트 데이터 분석, 음성 인식, 번역 시스템 등을 구축합니다.",
        "IoT 아키텍트": "사물 인터넷(IoT) 솔루션의 전체 아키텍처를 설계하고, 디바이스, 네트워크, 클라우드 플랫폼 간의 통합을 담당합니다.",
        "클라우드 솔루션 아키텍트": "클라우드 기반의 솔루션을 설계하고 구축하며, 클라우드 컴퓨팅 환경에서 최적의 아키텍처를 제공합니다.",
        "머신 러닝 엔지니어": "머신러닝 모델을 개발하고 최적화하며, 대규모 데이터를 기반으로 예측 및 분석 시스템을 구축합니다.",
        "사이버 보안 엔지니어": "네트워크, 시스템, 데이터를 외부 위협으로부터 보호하기 위한 보안 시스템을 설계하고 구현합니다.",
        "자율주행차 엔지니어": "자율주행 시스템의 핵심 기술인 인지, 판단, 제어 알고리즘을 개발하고 차량에 통합하는 역할을 수행합니다.",
        "로봇 엔지니어": "로봇의 설계, 개발, 제어 시스템 구축 및 유지보수를 담당하며, 인공지능과 자동화 기술을 활용합니다.",
        "백엔드 개발자": "서버, 데이터베이스, 애플리케이션 로직 등 사용자에게 보이지 않는 시스템 뒷단을 개발하고 관리합니다."
    };
    return descriptions[jobTitle] || "직무에 대한 설명이 없습니다.";
}

// 기존 로직 (백업용) - remains unchanged, will be used if API fails
function calculateJobRecommendations(answers) {
    const jobScores = [];
    
    // 각 직무별 점수 계산
    for (let jobIndex = 0; jobIndex < jobTypes.length; jobIndex++) {
        let score = 0;
        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
            // Ensure jobWeights has enough columns for all jobTypes
            if (jobWeights[questionIndex] && jobWeights[questionIndex][jobIndex] !== undefined) {
                score += answers[questionIndex] * jobWeights[questionIndex][jobIndex];
            } else {
                console.warn(`Job weight not found for question ${questionIndex} and job ${jobTypes[jobIndex]}. Using default 0.025.`);
                score += answers[questionIndex] * 0.025; // Fallback value
            }
        }
        jobScores.push({
            job: jobTypes[jobIndex],
            score: score,
            percentage: Math.round((score / 5) * 100)
        });
    }
    
    // 점수 순으로 정렬하여 상위 5개 반환
    return jobScores.sort((a, b) => b.score - a.score).slice(0, 3);
}

// 기존 추천 결과 표시 (상위 3개만)
function displayRecommendations(recommendations) {
    jobRecommendations.innerHTML = '';
    // 상위 3개만 사용
    const top3 = recommendations.slice(0, 3);
    top3.forEach((job, index) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'job-card';
        jobCard.style.animationDelay = `${index * 0.2}s`;
        const matchColor = job.percentage >= 80 ? '#10b981' : 
                             job.percentage >= 60 ? '#f59e0b' : '#6b7280';
        jobCard.innerHTML = `
            <h3 class="job-title">${job.job}</h3>
            <p class="job-match" style="color: ${matchColor}">${job.percentage}% 일치</p>
            <p class="job-description">
                ${getJobDescription(job.job)}
            </p>
        `;
        jobRecommendations.appendChild(jobCard);
    });
    setTimeout(() => {
        showRoadmapSection(top3);
    }, 2000);
}

// New: Show Roadmap Section
function showRoadmapSection(recommendations) {
    // 기존 로드맵 UI 숨김
    roadmapSection.classList.remove('active');
    roadmapContainer.innerHTML = '';

    // 챗봇 UI 표시
    const chatbotSection = document.getElementById('chatbot-section');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    chatbotSection.style.display = 'block';
    chatbotMessages.innerHTML = '';
    chatbotInput.value = '';

    // 추천 직무 리스트 안내
    const jobs = recommendations.map(rec => rec.job_title || rec.job);
    addChatbotMessage('bot', `추천 직무는 <b>${jobs.join(', ')}</b> 입니다.\n\n궁금한 직무명을 입력하면 1년/6개월/3개월 로드맵을 안내해드릴게요!\n예시: <b>${jobs[0]}</b>`);

    // 입력 이벤트
    chatbotSend.onclick = handleChatbotInput;
    chatbotInput.onkeypress = function(e) {
        if (e.key === 'Enter') handleChatbotInput();
    };

    function handleChatbotInput() {
        const msg = chatbotInput.value.trim();
        if (!msg) return;
        addChatbotMessage('user', msg);
        chatbotInput.value = '';
        // 직무명 입력 시 로드맵 안내
        if (jobs.some(j => msg.replace(/\s/g, '') === j.replace(/\s/g, ''))) {
            const roadmap = getJobRoadmap(msg);
            roadmap.forEach(period => {
                let text = `<b>${period.title}</b> (${period.subtitle})<br/>`;
                period.items.forEach(item => {
                    text += `- <b>${item.title}</b>: ${item.description}<br/>`;
                });
                addChatbotMessage('bot', text);
            });
            addChatbotMessage('bot', '로드맵에 대해 더 궁금한 점이 있으면 질문해 주세요! 예: "3개월 과정에서 중요한 건?"');
        } else {
            // 추가 질문 응답
            setTimeout(() => {
                addChatbotMessage('bot', generateChatbotResponse(msg, jobs[0]));
            }, 700);
        }
    }
}

function addChatbotMessage(who, text) {
    const chatbotMessages = document.getElementById('chatbot-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chatbot-message ' + who;
    msgDiv.innerHTML = `
        <div class="chatbot-avatar ${who}">${who === 'bot' ? '🤖' : '👤'}</div>
        <div class="chatbot-bubble">${text}</div>
    `;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// New: Get AI response (placeholder)
function getAIResponse(userMessage, selectedJob) {
    const lowerCaseMessage = userMessage.toLowerCase();
    const lowerCaseJob = selectedJob.toLowerCase();

    if (lowerCaseMessage.includes('중요한 것은') || lowerCaseMessage.includes('가장 중요한 것은')) {
        return `3개월 과정에서 가장 중요한 것은 바로 ${selectedJob} 기본 개념을 탄탄히 이해하는 것입니다. 
                이를 위해 온라인 강의, 책, 문서 등을 통해 기본 지식을 쌓아야 합니다. 
                그 다음 실무 프로젝트에서 이 개념들을 직접 적용해보면서 실력을 키워야 합니다.`;
    } else if (lowerCaseMessage.includes('실무 프로젝트') || lowerCaseMessage.includes('프로젝트는')) {
        return `${selectedJob} 실무 프로젝트를 준비하기 위해서는 먼저 해당 직무의 기본 요구사항을 파악하는 것이 중요합니다. 
                이를 위해 구직 사이트, 채용 공고, 기업 웹사이트 등을 확인하고, 
                필요한 기술 스택과 경험을 명확히 해야 합니다. 
                그 다음 실제 프로젝트 경험을 위해 개인 프로젝트나 오픈소스 프로젝트에 참여해보는 것이 좋습니다.`;
    } else if (lowerCaseMessage.includes('전문가가 되기') || lowerCaseMessage.includes('전문가가 되려면')) {
        return `${selectedJob} 전문가가 되기 위해서는 기본 지식 외에도 실무 경험과 전문 지식이 필요합니다. 
                이를 위해 해당 분야의 최신 트렌드와 기술을 따라가며, 
                전문가들의 경험을 배우고 네트워크를 구축하는 것이 중요합니다. 
                또한 커뮤니티나 오픈소스 프로젝트에 기여하면서 경력을 쌓아가는 것이 핵심입니다.`;
    } else {
        return `아직 이 질문에 대한 답변을 학습하지 못했습니다. 
                다른 질문을 해보시거나, 로드맵 챗봇에 대해 더 자세히 알고 싶으시다면 말씀해주세요!`;
    }
}

// New: Get job roadmap (placeholder)
function getJobRoadmap(jobTitle) {
    const lowerCaseJob = jobTitle.toLowerCase();
    if (lowerCaseJob.includes('마케팅')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "기본 마케팅 개념 학습",
                items: [
                    { icon: "📚", title: "마케팅 기본 개념 학습", description: "마케팅의 기본 개념, 목표, 원칙 등 이해" },
                    { icon: "📚", title: "디지털 마케팅 기본 지식", description: "소셜 미디어, 검색 엔진 마케팅, 콘텐츠 마케팅 등 기본 지식" },
                    { icon: "📚", title: "데이터 분석 기초", description: "데이터 수집, 정제, 분석 방법 배우기" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 마케팅 전략 수립 및 실행" },
                    { icon: "📊", title: "데이터 기반 마케팅", description: "데이터를 활용한 마케팅 전략 수립 및 평가" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "마케팅 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('ai')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "기본 머신러닝 및 딥러닝 학습",
                items: [
                    { icon: "📚", title: "머신러닝 기초", description: "회귀, 분류, 군집화 등 기본 알고리즘 학습" },
                    { icon: "📚", title: "딥러닝 기초", description: "신경망, 자동 인코더, 오토인코더 등 기본 개념 학습" },
                    { icon: "📚", title: "데이터 처리 및 전처리", description: "데이터 수집, 정제, 전처리 방법 배우기" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 머신러닝 모델 개발 및 배포" },
                    { icon: "📊", title: "데이터 분석 및 예측", description: "데이터를 활용한 분석 및 예측 모델 개발" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "AI 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('소프트웨어')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "기본 프로그래밍 및 소프트웨어 개발 학습",
                items: [
                    { icon: "📚", title: "프로그래밍 언어 학습", description: "Python, Java, C++ 등 프로그래밍 언어 기초 배우기" },
                    { icon: "📚", title: "소프트웨어 개발 환경", description: "IDE, 버전 관리 시스템, 디버깅 도구 등 환경 설정" },
                    { icon: "📚", title: "데이터 구조 및 알고리즘", description: "배열, 링크드 리스트, 스택, 큐, 트리, 그래프 등 기본 자료구조 및 알고리즘" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 소프트웨어 개발 및 테스트" },
                    { icon: "📊", title: "소프트웨어 테스트 및 품질 관리", description: "단위 테스트, 통합 테스트, 품질 보증, 코드 리뷰 등 테스트 및 품질 관리" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "소프트웨어 개발 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('데이터')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "데이터 수집 및 정제 학습",
                items: [
                    { icon: "📚", title: "데이터 수집 방법", description: "웹 스크래핑, API 활용, 데이터베이스 연동 등 데이터 수집 방법" },
                    { icon: "📚", title: "데이터 정제 및 전처리", description: "데이터 정제, 결측치 처리, 데이터 표준화 등 전처리 방법" },
                    { icon: "📚", title: "데이터 분석 기초", description: "통계, 머신러닝 기초 개념 및 방법 학습" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 데이터 분석 및 모델 개발" },
                    { icon: "📊", title: "데이터 시각화 및 보고서 작성", description: "데이터를 활용한 시각화 및 보고서 작성" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "데이터 분석 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('iot')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "IoT 기본 개념 및 프로토타입 개발",
                items: [
                    { icon: "📚", title: "IoT 기본 개념", description: "IoT, 사물인터넷, 디바이스 통신 등 기본 개념 학습" },
                    { icon: "📚", title: "프로토타입 개발", description: "Arduino, Raspberry Pi 등 기본 디바이스 프로토타입 개발" },
                    { icon: "📚", title: "네트워크 기초", description: "Wi-Fi, Bluetooth, 라즈베리파이 네트워크 설정 및 통신" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 IoT 시스템 개발 및 디바이스 연동" },
                    { icon: "📊", title: "데이터 수집 및 분석", description: "디바이스에서 수집한 데이터 분석 및 시각화" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "IoT 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('보안')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "보안 기본 개념 및 기초 지식",
                items: [
                    { icon: "📚", title: "보안 기본 개념", description: "보안, 해킹, 방화벽, 암호화 등 기본 개념 학습" },
                    { icon: "📚", title: "네트워크 보안", description: "OSI 7계층, 포트, 프로토콜 등 네트워크 보안 기초" },
                    { icon: "📚", title: "데이터베이스 보안", description: "SQL 인젝션, XSS, CSRF 등 데이터베이스 보안 기초" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 보안 시스템 개발 및 보안 테스트" },
                    { icon: "📊", title: "취약점 분석 및 보안 강화", description: "취약점 분석 및 보안 강화 방안 제시" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "보안 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('자율주행')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "자율주행 기본 개념 및 인지 알고리즘",
                items: [
                    { icon: "📚", title: "자율주행 기본 개념", description: "자율주행, 인지, 판단, 제어 등 기본 개념 학습" },
                    { icon: "📚", title: "인지 알고리즘", description: "카메라, 레이더, 라이다 등 센서 데이터 처리 및 인지 알고리즘" },
                    { icon: "📚", title: "데이터 분석 및 예측", description: "센서 데이터를 활용한 예측 모델 개발" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 자율주행 시스템 개발 및 테스트" },
                    { icon: "📊", title: "차량 통합 및 실험", description: "자율주행 시스템을 차량에 통합하여 실험 및 평가" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "자율주행 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('로봇')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "로봇 개발 기본 개념 및 하드웨어",
                items: [
                    { icon: "📚", title: "로봇 개발 기본 개념", description: "로봇 개발, 제어, 센서 등 기본 개념 학습" },
                    { icon: "📚", title: "로봇 하드웨어", description: "Arduino, Raspberry Pi, 라즈베리파이 등 로봇 제어용 하드웨어 사용" },
                    { icon: "📚", title: "로봇 제어 기초", description: "로봇 제어 시스템, 모터 드라이버, 센서 연동 등 기본 제어" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 로봇 제어 시스템 개발 및 테스트" },
                    { icon: "📊", title: "로봇 센서 및 센서 네트워크", description: "로봇에 센서 연동 및 센서 네트워크 구축" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "로봇 개발 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else if (lowerCaseJob.includes('백엔드')) {
        return [
            {
                title: "3개월 과정",
                subtitle: "백엔드 개발 기본 개념 및 프레임워크",
                items: [
                    { icon: "📚", title: "백엔드 개발 기본 개념", description: "서버, 데이터베이스, 애플리케이션 로직 등 기본 개념 학습" },
                    { icon: "📚", title: "프레임워크 학습", description: "Spring, Django, Express.js 등 프레임워크 학습" },
                    { icon: "📚", title: "데이터베이스 및 네트워크", description: "SQL, NoSQL, 네트워크 프로그래밍 등 데이터베이스 및 네트워크 기초" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 백엔드 개발 및 테스트" },
                    { icon: "📊", title: "데이터베이스 설계 및 최적화", description: "데이터베이스 설계, 최적화, 튜닝 등" },
                    { icon: "🎯", title: "캠페인 기획 및 실행", description: "실제 캠페인 기획 및 실행 경험" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "백엔드 개발 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    } else {
        return [
            {
                title: "3개월 과정",
                subtitle: "기본 지식 학습",
                items: [
                    { icon: "📚", title: "기본 지식 학습", description: "해당 직무의 기본 개념, 트렌드, 기술 등 학습" }
                ]
            },
            {
                title: "6개월 과정",
                subtitle: "실무 경험 쌓기",
                items: [
                    { icon: "💼", title: "프로젝트 참여", description: "실제 프로젝트에 참여하여 핵심 역량 키우기" }
                ]
            },
            {
                title: "1년 과정",
                subtitle: "전문 분야 탐색 및 네트워크 구축",
                items: [
                    { icon: "👔", title: "전문 분야 탐색", description: "해당 분야 내 다양한 전문가와 네트워크 형성" },
                    { icon: "🌐", title: "온라인 커뮤니티 활용", description: "블로그, 커뮤니티, 오픈소스 프로젝트 등 다양한 커뮤니티 활용" },
                    { icon: "🎓", title: "전문 교육 참여", description: "전문 교육 프로그램, 컨퍼런스, 세미나 등 참여" }
                ]
            }
        ];
    }
}

// 초기화 함수 호출
init();
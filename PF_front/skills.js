document.addEventListener('DOMContentLoaded', () => {

    // 20개 스킬과 그에 대한 정의 데이터
    const skillDefinitions = {
        'Python': '배우기 쉽고 다양한 분야(웹, 데이터 분석, AI 등)에서 활용되는 인기 프로그래밍 언어입니다.',
        '데이터 분석': '데이터를 수집하고 처리하여 숨겨진 의미나 패턴을 찾아내고, 비즈니스에 도움이 되는 결정을 내릴 수 있도록 돕는 과정입니다.',
        '머신러닝': '컴퓨터가 데이터를 통해 스스로 학습하고 예측하게 만드는 AI 기술입니다. 스팸 메일 필터링, 상품 추천 등에 활용됩니다.',
        '클라우드 컴퓨팅': '인터넷을 통해 서버, 스토리지, 데이터베이스 같은 IT 자원을 빌려 쓰고 사용한 만큼 비용을 내는 기술입니다. (예: AWS, GCP)',
        '디지털 마케팅': '웹사이트, 소셜 미디어, 검색 엔진 등 온라인 채널을 이용해 제품이나 서비스를 홍보하고 판매하는 모든 활동입니다.',
        '팀 리더십': '명확한 비전을 제시하고 구성원들이 잠재력을 발휘하도록 이끌어주는 영향력입니다.',
        '딥러닝': '인간의 뇌 신경망을 모방한 기술로, 더 복잡한 패턴을 학습할 수 있어 이미지 인식, 음성 인식 등에서 뛰어난 성능을 보입니다.',
        '프로젝트 관리': '정해진 기간과 예산 안에서 프로젝트 목표를 성공적으로 달성하기 위해 계획하고, 실행하고, 관리하는 능력입니다.',
        '자연어 처리': '컴퓨터가 인간의 언어(글, 말)를 이해하고 처리하게 만드는 기술입니다. 챗봇, 번역기 등에 사용됩니다.',
        '컴퓨터 비전': '컴퓨터가 사진이나 영상 등 시각적 정보를 인간처럼 인식하고 해석하게 만드는 기술입니다. 자율주행차, 얼굴 인식 등에 활용됩니다.',
        'C++': '빠른 속도가 장점이며, 게임 개발, 로봇 제어, 자율주행 등 고성능이 필요한 시스템을 만들 때 사용됩니다.',
        '팀 관리': '팀원들이 공동의 목표를 향해 나아갈 수 있도록 동기를 부여하고 성과를 이끌어내는 능력입니다.',
        'Java': '안정성이 높아 대규모 시스템이나 안드로이드 앱 개발에 널리 사용되는 객체지향 프로그래밍 언어입니다.',
        '텐서플로우': '구글이 개발한 딥러닝/머신러닝 라이브러리로, AI 모델을 쉽고 유연하게 만들 수 있도록 도와주는 도구입니다.',
        '소셜 미디어 마케팅': '페이스북, 인스타그램 등 소셜 미디어를 활용하여 고객과 소통하고 브랜드 인지도를 높이는 마케팅 전략입니다.',
        '애자일 방법론': '짧은 주기로 계획과 실행을 반복하며 변화에 민첩하게 대응하는 소프트웨어 개발 방식입니다.',
        'DevOps': '개발(Development)과 운영(Operations)을 통합하여 서비스 개발부터 배포, 운영까지의 과정을 더 빠르고 안정적으로 만드는 방법론이자 문화입니다.',
        'SQL': '데이터베이스에 저장된 데이터를 관리하고 원하는 정보를 효율적으로 찾아내기 위해 사용하는 언어입니다.',
        '커뮤니케이션': '자신의 생각과 정보를 명확하게 전달하고, 다른 사람의 의견을 경청하며 효과적으로 소통하는 능력입니다.',
        'R': '통계 분석과 데이터 시각화에 특화된 언어로, 데이터 과학자들이 많이 사용합니다.'
    };

    const skillGrid = document.querySelector('.skill-grid');
    const skillTitleElement = document.getElementById('skill-title');
    const skillDescriptionElement = document.getElementById('skill-description');
    const confirmButton = document.getElementById('confirm-skills');

    // 1. 스킬 버튼 동적 생성
    for (const skill in skillDefinitions) {
        const button = document.createElement('button');
        button.className = 'skill-btn';
        button.dataset.skill = skill;
        button.textContent = skill;
        skillGrid.appendChild(button);
    }

    const skillButtons = document.querySelectorAll('.skill-btn');
    const selectedSkills = new Set(); // 선택된 스킬들을 저장 (중복 방지)

    // 2. 스킬 버튼 클릭 이벤트 처리
    skillButtons.forEach(button => {
        button.addEventListener('click', () => {
            const skill = button.dataset.skill;

            // 스킬 선택/해제 토글
            button.classList.toggle('selected');

            if (button.classList.contains('selected')) {
                selectedSkills.add(skill);
            } else {
                selectedSkills.delete(skill);
            }

            // 설명 패널 업데이트
            skillTitleElement.textContent = `${skill}이란?`;
            skillDescriptionElement.textContent = skillDefinitions[skill];
            
            // 확인 버튼 활성화/비활성화
            updateConfirmButton();
        });
    });

    // 3. 확인 버튼 상태 업데이트 함수
    function updateConfirmButton() {
        if (selectedSkills.size > 0) {
            confirmButton.classList.add('active');
        } else {
            confirmButton.classList.remove('active');
        }
    }
    
    // 4. 확인 버튼 클릭 이벤트
    confirmButton.addEventListener('click', () => {
        if (selectedSkills.size === 0) {
            alert('하나 이상의 스킬을 선택해주세요.');
            return;
        }

        // 선택된 스킬들을 배열로 변환
        const skillsArray = Array.from(selectedSkills);
        console.log('최종 선택된 스킬:', skillsArray);
        
        // 실제 서비스에서는 이 스킬 정보를 localStorage에 저장하고 다음 페이지로 이동
        // localStorage.setItem('userSkills', JSON.stringify(skillsArray));

        alert(`${skillsArray.length}개의 스킬을 선택했습니다. 다음 단계로 이동합니다.`);
        window.location.href = 'characters.html'; // 캐릭터 선택 페이지로 이동
    });
});
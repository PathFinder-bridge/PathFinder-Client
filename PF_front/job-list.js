document.addEventListener('DOMContentLoaded', () => {

    const jobData = [
        // 소프트웨어·웹 개발 분야
        {
            field: '소프트웨어·웹 개발',
            category: '개발 직군',
            title: '프론트엔드 개발자',
            description: '사용자가 웹사이트에서 마주하는 모든 영역을 개발합니다. 웹의 시각적인 요소를 구현하고, 사용자 경험(UX)을 개선하는 역할을 담당합니다.',
            skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Vue.js'],
            salary: '4,000만원 ~ 6,500만원'
        },
        {
            field: '소프트웨어·웹 개발',
            category: '개발 직군',
            title: '백엔드 개발자',
            description: '서버, 데이터베이스, API 등 사용자 눈에 보이지 않는 서버 뒷단을 개발합니다. 서비스의 핵심 로직과 데이터 관리를 책임집니다.',
            skills: ['Java', 'Python', 'Node.js', 'Spring', 'SQL'],
            salary: '4,200만원 ~ 7,000만원'
        },
        {
            field: '소프트웨어·웹 개발',
            category: '개발 직군',
            title: '소프트웨어 엔지니어',
            description: '다양한 소프트웨어의 설계, 개발, 테스트, 유지보수 전반을 담당합니다. 문제 해결을 위한 논리적 사고와 코딩 능력이 중요합니다.',
            skills: ['Java', 'C++', 'Python', '자료구조', '알고리즘'],
            salary: '4,500만원 ~ 8,000만원'
        },
        // AI·데이터 분야
        {
            field: 'AI·데이터',
            category: 'AI·데이터 직군',
            title: 'AI 엔지니어',
            description: '인공지능 모델과 알고리즘을 개발하고 실제 서비스에 적용합니다. 머신러닝, 딥러닝 기술을 활용하여 데이터를 학습시키고 예측 모델을 만듭니다.',
            skills: ['Python', 'TensorFlow', 'PyTorch', '머신러닝'],
            salary: '4,500만원 ~ 8,500만원'
        },
        {
            field: 'AI·데이터',
            category: 'AI·데이터 직군',
            title: '데이터 과학자',
            description: '방대한 데이터 속에서 의미 있는 패턴과 인사이트를 찾아내고, 비즈니스 문제 해결을 위한 데이터 기반의 전략을 제시합니다.',
            skills: ['Python', 'R', 'SQL', '통계학', '데이터분석'],
            salary: '5,000만원 ~ 9,000만원'
        },
        {
            field: 'AI·데이터',
            category: 'AI·데이터 직군',
            title: '데이터 엔지니어',
            description: '대용량 데이터를 수집, 처리, 저장할 수 있는 안정적인 파이프라인을 설계하고 구축합니다. 데이터 과학자와 분석가를 지원합니다.',
            skills: ['SQL', 'Python', 'Spark', 'Hadoop', 'AWS/GCP'],
            salary: '5,000만원 ~ 8,500만원'
        },
        {
            field: 'AI·데이터',
            category: 'AI·데이터 직군',
            title: '컴퓨터 비전 엔지니어',
            description: '컴퓨터가 인간의 시각처럼 이미지나 영상을 이해하도록 만드는 기술을 개발합니다. 객체 탐지, 이미지 분류, 얼굴 인식 등에 적용됩니다.',
            skills: ['Python', 'C++', 'OpenCV', 'PyTorch', '딥러닝'],
            salary: '4,800만원 ~ 8,000만원'
        },
        // 인프라·운영 분야
        {
            field: '인프라·운영',
            category: '인프라 & 운영',
            title: '클라우드 솔루션 아키텍트',
            description: 'AWS, GCP 등 클라우드 환경에 최적화된 시스템 아키텍처를 설계하고 구축합니다. 비즈니스 요구사항에 맞는 안정적이고 효율적인 인프라를 제공합니다.',
            skills: ['AWS', 'GCP', 'Azure', '네트워크', '보안'],
            salary: '5,500만원 ~ 1억원'
        },
        // 보안·네트워크 분야
        {
            field: '보안·네트워크',
            category: '보안 직군',
            title: '사이버 보안 엔지니어',
            description: '해킹, 바이러스 등 외부의 사이버 위협으로부터 조직의 정보 시스템과 네트워크를 보호하는 모든 활동을 수행합니다.',
            skills: ['네트워크', '시스템', '보안', '암호학'],
            salary: '4,500만원 ~ 7,500만원'
        },
        // 하드웨어·로봇·IoT 분야
        {
            field: '하드웨어·로봇·IoT',
            category: '하드웨어 & IoT',
            title: '로봇 엔지니어',
            description: '산업용 로봇, 서비스 로봇 등 다양한 로봇의 하드웨어와 소프트웨어를 개발합니다. 기계, 전자, IT 기술을 융합하여 로봇을 제어합니다.',
            skills: ['C++', 'Python', 'ROS', '임베디드', '기구설계'],
            salary: '4,500만원 ~ 7,500만원'
        },
        {
            field: '하드웨어·로봇·IoT',
            category: '하드웨어 & IoT',
            title: 'IoT 아키텍트',
            description: '사물인터넷(IoT) 기기, 네트워크, 플랫폼을 포함하는 전체 솔루션의 구조를 설계하고 개발합니다. 스마트홈, 스마트팩토리 등에 적용됩니다.',
            skills: ['임베디드', '네트워크', 'MQTT', '클라우드'],
            salary: '5,000만원 ~ 8,000만원'
        },
        {
            field: '하드웨어·로봇·IoT',
            category: '하드웨어 & IoT',
            title: '자율주행차 엔지니어',
            description: '자동차 스스로 주변 환경을 인식하고 판단하여 주행할 수 있도록 하는 시스템을 개발합니다. 센서, 인지, 제어 기술이 핵심입니다.',
            skills: ['C++', 'Python', 'ROS', '컴퓨터 비전', '딥러닝'],
            salary: '5,500만원 ~ 1억원'
        }
    ];

    const container = document.getElementById('job-listing-container');

    // 데이터를 'field' 기준으로 그룹화
    const groupedByField = jobData.reduce((acc, job) => {
        acc[job.field] = acc[job.field] || [];
        acc[job.field].push(job);
        return acc;
    }, {});

    // 그룹화된 데이터를 기반으로 HTML 생성
    for (const fieldName in groupedByField) {
        const fieldId = `field-${fieldName.split('·')[0].toLowerCase()}`;

        // <section> 생성
        const section = document.createElement('section');
        section.className = 'job-field-section';
        section.id = fieldId;

        // 카테고리 제목 생성 (여기서는 fieldName을 그대로 사용)
        const title = document.createElement('h2');
        title.className = 'category-title';
        title.textContent = `${fieldName} 직군`;
        section.appendChild(title);

        // 직무 카드 그리드 생성
        const grid = document.createElement('div');
        grid.className = 'job-grid';
        
        groupedByField[fieldName].forEach(job => {
            const card = document.createElement('div');
            card.className = 'job-card';
            
            // skill 태그들을 HTML 문자열로 생성
            const skillTags = job.skills.map(skill => `<span class="tag">${skill}</span>`).join('');
            
            card.innerHTML = `
                <h3>${job.title}</h3>
                <p class="description">${job.description}</p>
                <div class="skill-tags">${skillTags}</div>
                <p class="salary">연봉: ${job.salary}</p>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    }
    
    // 네비게이션 링크 부드러운 스크롤 효과
    document.querySelectorAll('.field-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
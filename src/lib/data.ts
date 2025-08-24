import {Job, JobDetail, Skill, SurveyQuestion} from './types';

export const JOB_ORDER = [
    'ai-engineer', 'frontend-developer', 'backend-developer', 'software-engineer',
    'data-engineer', 'cybersecurity-engineer', 'data-scientist', 'cloud-architect',
    'iot-architect', 'robotics-engineer', 'autonomous-vehicle-engineer',
    'computer-vision-engineer', 'digital-marketer'
];

export const jobDetails: { [key: string]: JobDetail } = {
    'ai-engineer': {
        title: 'AI 엔지니어',
        description: '사람처럼 생각하고 학습하는 인공지능(AI) 모델과 서비스를 만듭니다. 챗봇, 상품 추천 시스템, 음성 비서 등 AI 기술을 실제 문제 해결에 적용하는 역할을 합니다.'
    },
    'digital-marketer': {
        title: '디지털 마케터',
        description: '소셜 미디어, 검색엔진, 유튜브 등 온라인 채널을 통해 제품이나 서비스를 홍보합니다. 데이터를 분석하여 가장 효과적인 방법으로 사람들에게 다가가는 전략을 세웁니다.'
    },
    'software-engineer': {
        title: '소프트웨어 엔지니어',
        description: '컴퓨터 프로그램, 스마트폰 앱, 웹사이트 등 우리가 사용하는 대부분의 소프트웨어를 설계하고 개발하며 테스트하는 전 과정을 책임지는 개발자입니다.'
    },
    'backend-developer': {
        title: '백엔드 개발자',
        description: '웹사이트나 앱의 보이지 않는 뒷부분(서버, 데이터베이스)을 만듭니다. 사용자가 눈으로 보는 기능들이 원활하게 작동하도록 데이터를 처리하고 관리하는 역할을 합니다.'
    },
    'frontend-developer': {
        title: '프론트엔드 개발자',
        description: '웹사이트나 앱에서 사용자에게 직접 보이는 화면(UI)을 만들고 디자인합니다. 사용자가 편리하게 서비스를 이용할 수 있도록 버튼, 레이아웃 등을 구현합니다.'
    },
    'cybersecurity-engineer': {
        title: '사이버 보안 엔지니어',
        description: '해킹이나 바이러스 같은 외부의 위협으로부터 회사의 컴퓨터 시스템과 데이터를 지키는 정보 보안 전문가입니다. 취약점을 분석하고 방어 시스템을 구축합니다.'
    },
    'data-engineer': {
        title: '데이터 엔지니어',
        description: '방대한 데이터가 잘 흐를 수 있도록 길(파이프라인)을 만들고, 데이터를 저장할 효율적인 창고(시스템)를 구축하고 관리하는 역할을 합니다.'
    },
    'cloud-architect': {
        title: '클라우드 솔루션 아키텍트',
        description: '기업이 클라우드 컴퓨팅을 효과적으로 사용할 수 있도록 전체적인 시스템을 설계하고 최적의 기술 전략을 제시하는 전문가입니다.'
    },
    'data-scientist': {
        title: '데이터 과학자',
        description: '데이터 속에서 의미 있는 패턴과 인사이트를 찾아내는 ‘데이터 탐정’입니다. 통계와 머신러닝 기술을 이용해 미래를 예측하고 비즈니스 문제 해결을 돕습니다.'
    },
    'iot-architect': {
        title: 'IoT 아키텍트',
        description: '스마트홈 기기나 스마트 팩토리처럼, 여러 사물(Things)을 인터넷으로 연결하는 전체 시스템을 설계합니다. 센서, 네트워크, 데이터 처리까지 모든 과정을 계획합니다.'
    },
    'robotics-engineer': {
        title: '로봇 엔지니어',
        description: '공장의 조립 로봇부터 수술용 로봇까지 다양한 로봇을 연구하고 설계, 제작합니다. 기계, 전자, 소프트웨어 기술을 모두 활용하여 로봇이 원하는 작업을 수행하게 만듭니다.'
    },
    'autonomous-vehicle-engineer': {
        title: '자율주행차 엔지니어',
        description: '자동차나 드론이 사람의 조작 없이 스스로 주변 환경을 인식하고 판단하여 주행할 수 있게 만드는 핵심 기술을 개발합니다.'
    },
    'computer-vision-engineer': {
        title: '컴퓨터 비전 엔지니어',
        description: '컴퓨터에 사람의 \'눈\'을 만들어주는 전문가입니다. 카메라로 들어온 이미지나 영상을 컴퓨터가 이해하고 분석하여 얼굴 인식, 사물 구별 등을 할 수 있게 하는 기술을 개발합니다.'
    },
};

export const surveyWeights: { [key: number]: number[] } = {
    1: [0.2, 0.1, 0.25, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1],
    2: [-0.1, 0.15, 0.1, -0.2, 0.25, -0.25, -0.25, -0.2, -0.15, -0.15, -0.2, -0.2, 0.15],
    3: [0.1, -0.25, 0.15, 0.25, -0.25, 0.1, 0.2, 0.2, 0, 0.1, 0, -0.1, -0.1],
    4: [0, -0.1, 0.1, 0.15, -0.1, 0.1, 0.2, 0.25, -0.1, 0.25, 0.15, 0.15, 0],
    5: [0, -0.2, 0, 0.1, -0.25, -0.1, 0.25, 0.15, -0.15, 0.1, -0.1, -0.1, -0.1],
    6: [0.15, 0.2, -0.1, -0.1, -0.2, -0.1, -0.1, -0.15, 0.25, -0.1, -0.1, 0, 0.1],
    7: [-0.1, -0.25, 0, 0.1, -0.2, 0.25, 0.05, 0.15, -0.2, 0, -0.2, -0.15, -0.2],
    8: [0, -0.15, 0, 0.1, -0.1, 0, 0.1, 0.1, -0.15, 0.25, 0.2, 0.1, 0],
    9: [0.1, -0.25, 0.05, -0.1, -0.25, -0.2, -0.15, -0.1, -0.1, 0.2, 0.25, 0.2, 0.1],
    10: [0.2, -0.15, 0, -0.15, -0.15, -0.2, -0.15, -0.15, 0.15, 0, 0.1, 0.2, 0.25],
    11: [0.25, -0.1, 0.1, 0, -0.2, -0.1, 0, -0.1, 0.2, 0.1, 0.15, 0.2, 0.2],
    12: [0.2, -0.25, 0, -0.1, -0.25, -0.15, -0.1, -0.1, 0.1, 0.1, 0.2, 0.25, 0.25],
};

export const skillJobMapping: { [key: string]: string[] } = {
    'python': ['ai-engineer', 'data-scientist', 'backend-developer', 'data-engineer'],
    'data-analysis': ['data-scientist', 'digital-marketer', 'data-engineer', 'ai-engineer'],
    'machine-learning': ['ai-engineer', 'data-scientist', 'computer-vision-engineer'],
    'cloud-computing': ['cloud-architect', 'backend-developer', 'data-engineer', 'devops'],
    'digital-marketing': ['digital-marketer'],
    'leadership': ['project-management', 'team-management', 'cloud-architect'],
    'deep-learning': ['ai-engineer', 'data-scientist', 'autonomous-vehicle-engineer', 'computer-vision-engineer'],
    'project-management': ['project-management', 'software-engineer'],
    'nlp': ['ai-engineer', 'data-scientist'],
    'computer-vision': ['computer-vision-engineer', 'ai-engineer', 'autonomous-vehicle-engineer'],
    'cpp': ['robotics-engineer', 'autonomous-vehicle-engineer', 'software-engineer'],
    'team-management': ['project-management', 'software-engineer'],
    'java': ['backend-developer', 'software-engineer'],
    'tensorflow': ['ai-engineer', 'data-scientist', 'deep-learning'],
    'social-media-marketing': ['digital-marketer'],
    'agile': ['software-engineer', 'frontend-developer', 'backend-developer', 'project-management'],
    'devops': ['backend-developer', 'cloud-architect', 'software-engineer'],
    'sql': ['data-scientist', 'data-engineer', 'backend-developer', 'digital-marketer'],
    'communication': Object.keys(jobDetails), // 모든 직무에 중요
    'r': ['data-scientist', 'data-analysis'],
};

export const jobAnimals: Job[] = [
    {
        emoji: '🦉',
        animalName: '똑똑한 부엉이',
        jobTitle: 'AI 엔지니어',
        features: ['머신러닝 모델 개발', '데이터 분석 및 처리', '알고리즘 설계', '파이프라인 구축']
    },
    {
        emoji: '🦊',
        animalName: '영리한 여우',
        jobTitle: '디자인 마케터',
        features: ['브랜드 전략 수립', '콘텐츠 디자인', '사용자 경험(UX) 설계', '마케팅 캠페인 실행']
    },
    {
        emoji: '🐨',
        animalName: '차분한 코알라',
        jobTitle: '소프트웨어 엔지니어',
        features: ['애플리케이션 설계', '효율적인 코드 작성', '테스트 및 디버깅', '팀 협업']
    },
    {
        emoji: '🐻',
        animalName: '든든한 곰',
        jobTitle: '백엔드 개발자',
        features: ['고성능 서버 구축', '보안 전문가', '데이터베이스 최적화', '시스템 아키텍처 설계', '로그 분석']
    },
    {
        emoji: '😺',
        animalName: '정의로운 고양이',
        jobTitle: '프론트엔드 개발자',
        features: ['UI/UX 구현', '웹 성능 최적화', 'API 연동', '크로스 브라우징 지원']
    },
    {emoji: '🦁', animalName: '용감한 사자', jobTitle: '사이버 보안 엔지니어', features: ['취약점 분석', '모의 해킹', '보안 솔루션 구축', '침해 사고 대응']},
    {
        emoji: '🐘',
        animalName: '기억력 좋은 코끼리',
        jobTitle: '데이터 엔지니어',
        features: ['데이터 파이프라인 설계', '대용량 데이터 처리', 'ETL/ELT 구축', '데이터 웨어하우스 관리']
    },
    {
        emoji: '🦅',
        animalName: '눈에 띄는 독수리',
        jobTitle: '쉽게 배우는 풀스택 웹 개발',
        features: ['프론트엔드 개발', '백엔드 개발', '데이터베이스 연동', '클라우드 배포']
    },
    {
        emoji: '🐧',
        animalName: '분석가 펭귄',
        jobTitle: '데이터 분석가',
        features: ['비즈니스 인사이트 도출', '데이터 시각화', '통계 분석', 'A/B 테스트 설계']
    },
    {
        emoji: '🐿️',
        animalName: '바쁜 다람쥐',
        jobTitle: 'ios 아키텍트',
        features: ['앱 아키텍처 설계', '성능 최적화', 'Swift/Objective-C', 'HIG 준수']
    },
    {emoji: '🐼', animalName: '손재주 좋은 판다', jobTitle: '모듈 엔지니어', features: ['하드웨어 모듈 설계', '펌웨어 개발', '회로 분석', '테스트 및 검증']},
    {emoji: '🦄', animalName: '빠른 유니콘', jobTitle: '자동수준차 엔지니어', features: ['제어 시스템 개발', '센서 퓨전', '경로 계획 알고리즘', '시뮬레이션']},
    {
        emoji: '🦙',
        animalName: '상냥한 라마',
        jobTitle: '컴퓨터 비전 엔지니어',
        features: ['이미지 처리 알고리즘', '객체 탐지 및 추적', '딥러닝 모델 적용', '데이터셋 구축']
    },
];

export const skillsData: Skill[] = [
    {
        id: 'python',
        name: 'Python',
        definition: '1991년 귀도 반 로섬이 발표한 고급 프로그래밍 언어로, 간결한 문법이 특징이며 데이터 분석, 웹 개발, 인공지능 등 다양한 분야에서 널리 사용됩니다.'
    },
    {
        id: 'data-analysis',
        name: '데이터 분석',
        definition: '유용한 정보를 발굴하고 결론을 도출하며 의사결정을 지원하는 것을 목표로 데이터를 정리, 변환, 모델링하는 과정입니다. 비즈니스 문제를 해결하고 전략을 수립하는 데 핵심적인 역할을 합니다.'
    },
    {
        id: 'machine-learning',
        name: '머신러닝',
        definition: '인공지능의 한 분야로, 컴퓨터가 데이터를 통해 학습하고 경험을 통해 자동으로 개선하도록 하는 알고리즘 및 기술 연구입니다. 스팸 필터링, 이미지 인식, 추천 시스템 등에 활용됩니다.'
    },
    {
        id: 'cloud-computing',
        name: '클라우드 컴퓨팅',
        definition: '인터넷을 통해 서버, 스토리지, 데이터베이스 같은 컴퓨팅 리소스를 필요할 때 바로 제공하고 사용한 만큼 비용을 지불하는 기술입니다. 직접 하드웨어를 소유하거나 관리할 필요가 없습니다.'
    },
    {
        id: 'digital-marketing',
        name: '디지털 마케팅',
        definition: '웹사이트, 소셜 미디어, 이메일, 검색 엔진 등 디지털 채널을 사용하여 제품이나 브랜드를 홍보하는 모든 마케팅 활동을 의미합니다.'
    },
    {
        id: 'leadership',
        name: '리더십',
        definition: '공동의 목표를 달성하기 위해 비전을 제시하고 구성원에게 영감을 주며 긍정적인 영향을 미치는 과정입니다. 변화를 주도하고 팀의 잠재력을 이끌어내는 능력을 포함합니다.'
    },
    {
        id: 'deep-learning',
        name: '딥러닝',
        definition: '인간의 뇌 신경망을 모방한 다층 구조의 인공신경망(ANN)을 사용하는 머신러닝의 한 분야입니다. 자율주행, 음성 인식 등 복잡한 패턴 인식 문제에 뛰어난 성능을 보입니다.'
    },
    {
        id: 'project-management',
        name: '프로젝트 관리',
        definition: '정해진 기간과 예산 내에서 특정 목표를 성공적으로 달성하기 위해 프로젝트의 시작부터 끝까지 전 과정을 계획, 실행, 통제하는 활동입니다.'
    },
    {
        id: 'nlp',
        name: '자연어 처리',
        definition: '인간이 사용하는 언어(자연어)를 컴퓨터가 이해하고, 해석하며, 생성할 수 있도록 처리하는 인공지능 기술입니다. 챗봇, 번역기, 감성 분석 등에 사용됩니다.'
    },
    {
        id: 'computer-vision',
        name: '컴퓨터 비전',
        definition: '컴퓨터가 디지털 이미지나 비디오 등 시각적 데이터를 인간처럼 보고 해석하는 능력을 갖도록 하는 인공지능 분야입니다. 객체 탐지, 얼굴 인식 기술 등이 이에 해당합니다.'
    },
    {
        id: 'cpp',
        name: 'C++',
        definition: 'C언어를 기반으로 객체 지향 프로그래밍 기능을 추가하여 개발된 프로그래밍 언어입니다. 시스템 소프트웨어, 게임 엔진 등 빠른 성능이 요구되는 분야에서 주로 사용됩니다.'
    },
    {
        id: 'team-management',
        name: '팀 관리',
        definition: '팀의 목표 달성을 위해 업무를 조직하고, 자원을 할당하며, 안정적으로 프로세스를 운영하는 활동입니다. 리더십이 방향을 정한다면, 관리는 계획에 따라 항해하는 것과 같습니다.'
    },
    {
        id: 'java',
        name: 'Java',
        definition: '1995년 썬 마이크로시스템즈에서 발표한 객체 지향 프로그래밍 언어입니다. "한 번 작성하면 어디서든 실행된다"는 특징으로 웹 애플리케이션, 안드로이드 앱 개발 등에 널리 쓰입니다.'
    },
    {
        id: 'tensorflow',
        name: '텐서플로우',
        definition: '구글에서 개발한 오픈소스 소프트웨어 라이브러리로, 주로 머신러닝과 딥러닝 모델을 쉽게 만들고 훈련시키는 데 사용되는 강력한 도구입니다.'
    },
    {
        id: 'social-media-marketing',
        name: '소셜 미디어 마케팅',
        definition: '페이스북, 인스타그램, 트위터 등 소셜 미디어 플랫폼을 활용하여 브랜드 인지도를 높이고 잠재 고객과 소통하며 제품을 홍보하는 디지털 마케팅의 한 방법입니다.'
    },
    {
        id: 'agile',
        name: '애자일 방법론',
        definition: '계획보다 유연한 대응을 중시하는 소프트웨어 개발 방식입니다. 짧은 주기의 개발 단위를 반복하여 프로토타입을 만들어내고, 고객의 피드백을 지속적으로 반영하며 개발을 진행합니다.'
    },
    {
        id: 'devops',
        name: 'DevOps',
        definition: '소프트웨어의 개발(Development)과 운영(Operations)을 결합한 말로, 개발과 운영팀이 서로 협력하고 자동화 도구를 활용하여 더 빠르고 안정적으로 소프트웨어를 배포하는 문화를 의미합니다.'
    },
    {
        id: 'sql',
        name: 'SQL',
        definition: '데이터베이스에 있는 데이터에 접근하고, 조작하며, 관리하기 위해 사용되는 표준 프로그래밍 언어입니다. 데이터를 조회하거나 새로운 데이터를 삽입, 수정, 삭제할 수 있습니다.'
    },
    {
        id: 'communication',
        name: '커뮤니케이션',
        definition: '사람들 사이에 생각, 느낌, 정보 등을 효과적으로 주고받는 과정입니다. 명확한 의사 전달, 경청, 공감 능력을 포함하며 모든 협업의 기초가 됩니다.'
    },
    {id: 'r', name: 'R', definition: '통계 분석과 데이터 시각화에 특화된 프로그래밍 언어 및 소프트웨어 환경입니다. 통계학자 및 데이터 과학자들 사이에서 널리 사용됩니다.'},
];


export const surveyQuestions: SurveyQuestion[] = [
    {id: 1, text: '새로운 지식이나 기술을 배우고 익히는 과정 자체를 즐깁니다.'},
    {id: 2, text: '웹사이트나 앱을 볼 때, ‘더 예쁘게 만들거나 더 편리하게 바꿀 수 있겠다’는 생각을 자주 합니다.'},
    {id: 3, text: '눈에 보이는 결과물보다는, 보이지 않는 곳에서 시스템이 착착 돌아가도록 논리적인 규칙을 만드는 것을 더 좋아합니다.'},
    {id: 4, text: '레고 블록을 조립하듯, 여러 부품을 합쳐 하나의 큰 구조나 계획을 설계하는 것을 즐깁니다.'},
    {id: 5, text: '어질러진 데이터를 깔끔하게 정리하고, 필요할 때 바로 꺼내 쓸 수 있도록 효율적인 창고(저장 시스템)를 구축하는 것에 흥미를 느낍니다.'},
    {id: 6, text: '숨은그림찾기처럼, 데이터 속에서 의미 있는 정보나 패턴을 발견하고 그 이유를 파헤치는 것을 좋아합니다.'},
    {id: 7, text: '체스나 바둑처럼 상대의 수를 예측하듯, 시스템의 허점을 미리 찾아내고 외부의 공격을 막는 전략을 세우는 것에 매력을 느낍니다.'},
    {id: 8, text: 'TV, 조명 같은 일상 속 사물들을 인터넷으로 연결해서 원격으로 제어하거나 자동으로 작동하게 만드는 기술이 재미있을 것 같습니다.'},
    {id: 9, text: '영화 속 ‘아이언맨 슈트’처럼, 정교한 기계나 로봇이 부드럽게 움직이도록 만드는 원리가 궁금합니다.'},
    {id: 10, text: '컴퓨터가 사람처럼 사진이나 동영상을 보고 그 안의 사물이나 사람을 알아보게 하는 기술에 관심이 많습니다.'},
    {id: 11, text: '스스로 배우고 생각하는 인공지능(AI)을 직접 만들어 문제를 해결해보고 싶습니다.'},
    {id: 12, text: '자율주행 자동차가 어떻게 세상을 ‘보고’ 스스로 판단하여 안전하게 움직이는지 그 원리가 매우 궁금합니다.'},
];
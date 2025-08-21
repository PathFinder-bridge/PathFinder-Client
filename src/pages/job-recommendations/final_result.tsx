// pages/job-recommendations/final_result.tsx

'use client';

import React, { useMemo } from 'react';
import { Layout } from '@/layout/Layout';
import { useRouter, useSearchParams } from 'next/navigation';

// ... (직무 데이터, 가중치 등 모든 상단 코드는 그대로 유지)
const jobDetails: { [key: string]: { title: string; description: string } } = {
  'ai-engineer': { title: 'AI 엔지니어', description: '사람처럼 생각하고 학습하는 인공지능(AI) 모델과 서비스를 만듭니다. 챗봇, 상품 추천 시스템, 음성 비서 등 AI 기술을 실제 문제 해결에 적용하는 역할을 합니다.' },
  'digital-marketer': { title: '디지털 마케터', description: '소셜 미디어, 검색엔진, 유튜브 등 온라인 채널을 통해 제품이나 서비스를 홍보합니다. 데이터를 분석하여 가장 효과적인 방법으로 사람들에게 다가가는 전략을 세웁니다.' },
  'software-engineer': { title: '소프트웨어 엔지니어', description: '컴퓨터 프로그램, 스마트폰 앱, 웹사이트 등 우리가 사용하는 대부분의 소프트웨어를 설계하고 개발하며 테스트하는 전 과정을 책임지는 개발자입니다.' },
  'backend-developer': { title: '백엔드 개발자', description: '웹사이트나 앱의 보이지 않는 뒷부분(서버, 데이터베이스)을 만듭니다. 사용자가 눈으로 보는 기능들이 원활하게 작동하도록 데이터를 처리하고 관리하는 역할을 합니다.' },
  'frontend-developer': { title: '프론트엔드 개발자', description: '웹사이트나 앱에서 사용자에게 직접 보이는 화면(UI)을 만들고 디자인합니다. 사용자가 편리하게 서비스를 이용할 수 있도록 버튼, 레이아웃 등을 구현합니다.' },
  'cybersecurity-engineer': { title: '사이버 보안 엔지니어', description: '해킹이나 바이러스 같은 외부의 위협으로부터 회사의 컴퓨터 시스템과 데이터를 지키는 정보 보안 전문가입니다. 취약점을 분석하고 방어 시스템을 구축합니다.' },
  'data-engineer': { title: '데이터 엔지니어', description: '방대한 데이터가 잘 흐를 수 있도록 길(파이프라인)을 만들고, 데이터를 저장할 효율적인 창고(시스템)를 구축하고 관리하는 역할을 합니다.' },
  'cloud-architect': { title: '클라우드 솔루션 아키텍트', description: '기업이 클라우드 컴퓨팅을 효과적으로 사용할 수 있도록 전체적인 시스템을 설계하고 최적의 기술 전략을 제시하는 전문가입니다.' },
  'data-scientist': { title: '데이터 과학자', description: '데이터 속에서 의미 있는 패턴과 인사이트를 찾아내는 ‘데이터 탐정’입니다. 통계와 머신러닝 기술을 이용해 미래를 예측하고 비즈니스 문제 해결을 돕습니다.' },
  'iot-architect': { title: 'IoT 아키텍트', description: '스마트홈 기기나 스마트 팩토리처럼, 여러 사물(Things)을 인터넷으로 연결하는 전체 시스템을 설계합니다. 센서, 네트워크, 데이터 처리까지 모든 과정을 계획합니다.' },
  'robotics-engineer': { title: '로봇 엔지니어', description: '공장의 조립 로봇부터 수술용 로봇까지 다양한 로봇을 연구하고 설계, 제작합니다. 기계, 전자, 소프트웨어 기술을 모두 활용하여 로봇이 원하는 작업을 수행하게 만듭니다.' },
  'autonomous-vehicle-engineer': { title: '자율주행차 엔지니어', description: '자동차나 드론이 사람의 조작 없이 스스로 주변 환경을 인식하고 판단하여 주행할 수 있게 만드는 핵심 기술을 개발합니다.' },
  'computer-vision-engineer': { title: '컴퓨터 비전 엔지니어', description: '컴퓨터에 사람의 \'눈\'을 만들어주는 전문가입니다. 카메라로 들어온 이미지나 영상을 컴퓨터가 이해하고 분석하여 얼굴 인식, 사물 구별 등을 할 수 있게 하는 기술을 개발합니다.' },
};
const JOB_ORDER = ['ai-engineer', 'frontend-developer', 'backend-developer', 'software-engineer', 'data-engineer', 'cybersecurity-engineer', 'data-scientist', 'cloud-architect', 'iot-architect', 'robotics-engineer', 'autonomous-vehicle-engineer', 'computer-vision-engineer', 'digital-marketer'];
const surveyWeights: { [key: number]: number[] } = {
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
const skillJobMapping: { [key: string]: string[] } = {
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


interface RecommendedJob {
  id: string;
  title: string;
  description: string;
  score: number;
  matchRate: number;
}

export default function FinalResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ▼▼▼ 오타 수정 ▼▼▼
  const recommendedJobs = useMemo(() => {
    const surveyAnswersParam = searchParams.get('answers');
    const selectedSkillsParam = searchParams.get('skills');

    if (!surveyAnswersParam || !selectedSkillsParam) return [];

    let surveyAnswers, selectedSkills;
    try {
      surveyAnswers = JSON.parse(surveyAnswersParam);
      selectedSkills = JSON.parse(selectedSkillsParam);
    } catch (error) {
      console.error("URL 파라미터 분석 중 오류 발생:", error);
      return [];
    }

    const scores: { [key: string]: number } = JOB_ORDER.reduce((acc, job) => ({ ...acc, [job]: 0 }), {});
    for (const questionId in surveyAnswers) {
        const userAnswer = surveyAnswers[questionId];
        const weights = surveyWeights[parseInt(questionId, 10)];
        if (weights) {
            weights.forEach((weight, index) => {
                const jobId = JOB_ORDER[index];
                scores[jobId] += userAnswer * weight;
            });
        }
    }
    const SKILL_BONUS = 1.5;
    selectedSkills.forEach((skillId: string) => {
        const relatedJobs = skillJobMapping[skillId];
        if (relatedJobs) {
            relatedJobs.forEach(jobId => {
                if (scores[jobId] !== undefined) {
                    scores[jobId] += SKILL_BONUS;
                }
            });
        }
    });
    const sortedJobs = JOB_ORDER.map(id => ({ id, score: scores[id] }))
      .sort((a, b) => b.score - a.score);
    
    const MAX_PERCENTAGE = 85;
    const MIN_PERCENTAGE = 40;
    const topScore = sortedJobs[0]?.score > 0 ? sortedJobs[0].score : 1;

    const finalJobs = sortedJobs.slice(0, 3).map((job) => {
      const calculatedRate = MIN_PERCENTAGE + (MAX_PERCENTAGE - MIN_PERCENTAGE) * (job.score / topScore);
      const matchRate = Math.round(job.score > 0 ? calculatedRate : MIN_PERCENTAGE);
      
      return {
        ...job,
        title: jobDetails[job.id].title,
        description: jobDetails[job.id].description,
        matchRate,
      };
    });

    return finalJobs;
  }, [searchParams]);

  const handleGoToRoadmap = () => {
    if (recommendedJobs.length === 0) return;
    const jobsQueryParam = encodeURIComponent(JSON.stringify(recommendedJobs));
    router.push(`/job-roadmaps?jobs=${jobsQueryParam}`);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen py-20">
        <div className="w-full max-w-5xl mx-auto px-4 text-center">
          <header className="mb-12">
            <h1 className="text-4xl font-bold text-gray-800">당신에게 추천하는 직무</h1>
            <p className="mt-4 text-lg text-gray-600">추가적으로 궁금한 직무가 있다면 카드를 클릭해보세요.</p>
          </header>

          <main className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {recommendedJobs.length > 0 ? recommendedJobs.map(job => (
              <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-8 text-left shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer">
                <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                <p className="text-lg font-bold text-orange-500 my-2">{job.matchRate}% 일치</p>
                <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
              </div>
            )) : (
              <p>추천 직무를 계산 중입니다...</p>
            )}
          </main>

          <footer className="text-center">
            <button
              onClick={handleGoToRoadmap}
              className="bg-blue-600 text-white font-bold py-4 px-10 rounded-lg text-lg hover:bg-blue-700 transition-colors duration-200"
            >
              직무 로드맵 제공받으러 가기
            </button>
          </footer>
        </div>
      </div>
    </Layout>
  );
}
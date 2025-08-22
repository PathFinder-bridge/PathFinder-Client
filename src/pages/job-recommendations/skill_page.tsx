// pages/job-recommendations/skills.tsx

'use client';

import React, { useState } from 'react';
import { Layout } from '@/layout/Layout';
// ▼▼▼ useSearchParams 추가 ▼▼▼
import { useRouter, useSearchParams } from 'next/navigation';

// 스킬 데이터 인터페이스 정의
interface Skill {
  id: string;
  name: string;
  definition: string;
}

// 제공된 텍스트를 바탕으로 스킬 데이터 정리
const skillsData: Skill[] = [
  // ... (스킬 데이터는 이전과 동일)
  { id: 'python', name: 'Python', definition: '1991년 귀도 반 로섬이 발표한 고급 프로그래밍 언어로, 간결한 문법이 특징이며 데이터 분석, 웹 개발, 인공지능 등 다양한 분야에서 널리 사용됩니다.' },
  { id: 'data-analysis', name: '데이터 분석', definition: '유용한 정보를 발굴하고 결론을 도출하며 의사결정을 지원하는 것을 목표로 데이터를 정리, 변환, 모델링하는 과정입니다. 비즈니스 문제를 해결하고 전략을 수립하는 데 핵심적인 역할을 합니다.' },
  { id: 'machine-learning', name: '머신러닝', definition: '인공지능의 한 분야로, 컴퓨터가 데이터를 통해 학습하고 경험을 통해 자동으로 개선하도록 하는 알고리즘 및 기술 연구입니다. 스팸 필터링, 이미지 인식, 추천 시스템 등에 활용됩니다.' },
  { id: 'cloud-computing', name: '클라우드 컴퓨팅', definition: '인터넷을 통해 서버, 스토리지, 데이터베이스 같은 컴퓨팅 리소스를 필요할 때 바로 제공하고 사용한 만큼 비용을 지불하는 기술입니다. 직접 하드웨어를 소유하거나 관리할 필요가 없습니다.' },
  { id: 'digital-marketing', name: '디지털 마케팅', definition: '웹사이트, 소셜 미디어, 이메일, 검색 엔진 등 디지털 채널을 사용하여 제품이나 브랜드를 홍보하는 모든 마케팅 활동을 의미합니다.' },
  { id: 'leadership', name: '리더십', definition: '공동의 목표를 달성하기 위해 비전을 제시하고 구성원에게 영감을 주며 긍정적인 영향을 미치는 과정입니다. 변화를 주도하고 팀의 잠재력을 이끌어내는 능력을 포함합니다.' },
  { id: 'deep-learning', name: '딥러닝', definition: '인간의 뇌 신경망을 모방한 다층 구조의 인공신경망(ANN)을 사용하는 머신러닝의 한 분야입니다. 자율주행, 음성 인식 등 복잡한 패턴 인식 문제에 뛰어난 성능을 보입니다.' },
  { id: 'project-management', name: '프로젝트 관리', definition: '정해진 기간과 예산 내에서 특정 목표를 성공적으로 달성하기 위해 프로젝트의 시작부터 끝까지 전 과정을 계획, 실행, 통제하는 활동입니다.' },
  { id: 'nlp', name: '자연어 처리', definition: '인간이 사용하는 언어(자연어)를 컴퓨터가 이해하고, 해석하며, 생성할 수 있도록 처리하는 인공지능 기술입니다. 챗봇, 번역기, 감성 분석 등에 사용됩니다.' },
  { id: 'computer-vision', name: '컴퓨터 비전', definition: '컴퓨터가 디지털 이미지나 비디오 등 시각적 데이터를 인간처럼 보고 해석하는 능력을 갖도록 하는 인공지능 분야입니다. 객체 탐지, 얼굴 인식 기술 등이 이에 해당합니다.' },
  { id: 'cpp', name: 'C++', definition: 'C언어를 기반으로 객체 지향 프로그래밍 기능을 추가하여 개발된 프로그래밍 언어입니다. 시스템 소프트웨어, 게임 엔진 등 빠른 성능이 요구되는 분야에서 주로 사용됩니다.' },
  { id: 'team-management', name: '팀 관리', definition: '팀의 목표 달성을 위해 업무를 조직하고, 자원을 할당하며, 안정적으로 프로세스를 운영하는 활동입니다. 리더십이 방향을 정한다면, 관리는 계획에 따라 항해하는 것과 같습니다.' },
  { id: 'java', name: 'Java', definition: '1995년 썬 마이크로시스템즈에서 발표한 객체 지향 프로그래밍 언어입니다. "한 번 작성하면 어디서든 실행된다"는 특징으로 웹 애플리케이션, 안드로이드 앱 개발 등에 널리 쓰입니다.' },
  { id: 'tensorflow', name: '텐서플로우', definition: '구글에서 개발한 오픈소스 소프트웨어 라이브러리로, 주로 머신러닝과 딥러닝 모델을 쉽게 만들고 훈련시키는 데 사용되는 강력한 도구입니다.' },
  { id: 'social-media-marketing', name: '소셜 미디어 마케팅', definition: '페이스북, 인스타그램, 트위터 등 소셜 미디어 플랫폼을 활용하여 브랜드 인지도를 높이고 잠재 고객과 소통하며 제품을 홍보하는 디지털 마케팅의 한 방법입니다.' },
  { id: 'agile', name: '애자일 방법론', definition: '계획보다 유연한 대응을 중시하는 소프트웨어 개발 방식입니다. 짧은 주기의 개발 단위를 반복하여 프로토타입을 만들어내고, 고객의 피드백을 지속적으로 반영하며 개발을 진행합니다.' },
  { id: 'devops', name: 'DevOps', definition: '소프트웨어의 개발(Development)과 운영(Operations)을 결합한 말로, 개발과 운영팀이 서로 협력하고 자동화 도구를 활용하여 더 빠르고 안정적으로 소프트웨어를 배포하는 문화를 의미합니다.' },
  { id: 'sql', name: 'SQL', definition: '데이터베이스에 있는 데이터에 접근하고, 조작하며, 관리하기 위해 사용되는 표준 프로그래밍 언어입니다. 데이터를 조회하거나 새로운 데이터를 삽입, 수정, 삭제할 수 있습니다.' },
  { id: 'communication', name: '커뮤니케이션', definition: '사람들 사이에 생각, 느낌, 정보 등을 효과적으로 주고받는 과정입니다. 명확한 의사 전달, 경청, 공감 능력을 포함하며 모든 협업의 기초가 됩니다.' },
  { id: 'r', name: 'R', definition: '통계 분석과 데이터 시각화에 특화된 프로그래밍 언어 및 소프트웨어 환경입니다. 통계학자 및 데이터 과학자들 사이에서 널리 사용됩니다.' },
];

export default function SkillSelectionPage() {
  const router = useRouter();
  // ▼▼▼ useSearchParams 선언 ▼▼▼
  const searchParams = useSearchParams();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const [activeSkill, setActiveSkill] = useState<Skill | null>(
    skillsData.find(s => s.id === 'machine-learning') || null
  );

  const handleSkillClick = (skill: Skill) => {
    setActiveSkill(skill);
    setSelectedSkills(prev => 
      prev.includes(skill.id)
        ? prev.filter(s => s !== skill.id)
        : [...prev, skill.id]
    );
  };

  // ▼▼▼ handleSubmit 함수 수정 ▼▼▼
  const handleSubmit = () => {
    if (selectedSkills.length === 0) {
      alert('관심 있는 스킬을 하나 이상 선택해주세요.');
      return;
    }

    // Survey 페이지에서 전달받은 answers 데이터를 가져옵니다.
    const surveyAnswers = searchParams.get('answers');

    alert('선택이 완료되었습니다. 최종 추천 결과를 보여드릴게요.');

    // URL 쿼리 파라미터로 두 데이터를 모두 전달하며 final_result 페이지로 이동합니다.
    router.push(`/job-recommendations/final_result?answers=${surveyAnswers}&skills=${JSON.stringify(selectedSkills)}`);
  };

  return (
    <Layout>
      <div className="bg-white min-h-screen">
        <div className="w-full max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800">경험해봤거나 관심이 있는 스킬을 선택해주세요</h1>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* 왼쪽: 스킬 선택 패널 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-xl">🤖</div>
                <span className="text-lg font-semibold text-blue-800">패파봇</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                {skillsData.map(skill => (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillClick(skill)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${selectedSkills.includes(skill.id)
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                      }
                    `}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="bg-blue-500 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  확인
                </button>
              </div>
            </div>

            {/* 오른쪽: 스킬 설명 패널 */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
              {activeSkill ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{activeSkill.name}이란?</h2>
                  <p className="text-gray-600 leading-relaxed">{activeSkill.definition}</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">왼쪽에서 스킬을 선택하면 설명을 볼 수 있습니다.</p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* 하단 진행률 표시 바 */}
        <footer className="w-full mt-10">
            <div className="bg-blue-600 h-2.5 w-full" />
        </footer>
      </div>
    </Layout>
  );
}
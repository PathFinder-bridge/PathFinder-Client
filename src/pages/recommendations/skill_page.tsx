'use client';

import React, { useState, useMemo } from 'react';
import { Layout } from '@/layout/Layout';
import { useRouter, useSearchParams } from 'next/navigation';
import { skillsData } from '@/lib/data';
import { Skill } from '@/lib/types';

export default function SkillSelectionPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [activeSkill, setActiveSkill] = useState<Skill | null>(
        skillsData.find(s => s.id === 'machine-learning') || null
    );

    const categorizedSkills = useMemo(() => {
        const categories = {
            '프로그래밍 언어': ['python', 'java', 'cpp', 'r', 'sql'],
            '데이터 & AI': ['data-analysis', 'machine-learning', 'deep-learning', 'nlp', 'computer-vision', 'tensorflow'],
            '개발 & 인프라': ['cloud-computing', 'devops', 'agile'],
            '마케팅 & 소프트스킬': ['digital-marketing', 'social-media-marketing', 'leadership', 'team-management', 'project-management', 'communication']
        };

        return Object.entries(categories).map(([categoryName, skillIds]) => ({
            name: categoryName,
            skills: skillsData.filter(skill => skillIds.includes(skill.id))
        }));
    }, []);

    const handleSkillToggle = (skill: Skill) => {
        setActiveSkill(skill);
        setSelectedSkills(prev =>
            prev.includes(skill.id)
                ? prev.filter(s => s !== skill.id)
                : [...prev, skill.id]
        );
    };

    const handleSubmit = () => {
        if (selectedSkills.length === 0) {
            alert('관심 있는 스킬을 하나 이상 선택해주세요.');
            return;
        }

        const surveyAnswers = searchParams.get('answers');
        if (!surveyAnswers) {
            alert('설문 데이터가 없습니다. 다시 시도해주세요.');
            router.push('/recommendations/surveypage');
            return;
        }

        router.push(`/recommendations/final_result?answers=${surveyAnswers}&skills=${JSON.stringify(selectedSkills)}`);
    };

    return (
        <Layout>
            <div className="bg-white min-h-screen">
                <div className="w-full max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <header className="mb-10">
                        <h1 className="text-3xl font-bold text-gray-800">경험해봤거나 관심이 있는 스킬을 선택해주세요</h1>
                        <p className="mt-2 text-gray-600">선택한 스킬: {selectedSkills.length}개</p>
                    </header>

                    <main className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* 왼쪽: 스킬 선택 패널 */}
                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-xl">🤖</div>
                                <span className="text-lg font-semibold text-blue-800">패파봇</span>
                            </div>

                            {categorizedSkills.map(category => (
                                <SkillCategory
                                    key={category.name}
                                    name={category.name}
                                    skills={category.skills}
                                    selectedSkills={selectedSkills}
                                    onSkillToggle={handleSkillToggle}
                                />
                            ))}

                            <div className="text-center mt-8">
                                <button
                                    onClick={handleSubmit}
                                    className="bg-blue-500 text-white font-bold py-3 px-10 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                >
                                    확인 ({selectedSkills.length}개 선택됨)
                                </button>
                            </div>
                        </div>

                        {/* 오른쪽: 스킬 설명 패널 */}
                        <SkillDescriptionPanel activeSkill={activeSkill} />
                    </main>
                </div>

                {/* 하단 진행률 표시 바 */}
                <footer className="w-full mt-10">
                    <div className="bg-blue-600 h-2.5 w-full"/>
                </footer>
            </div>
        </Layout>
    );
}

interface SkillCategoryProps {
    name: string;
    skills: Skill[];
    selectedSkills: string[];
    onSkillToggle: (skill: Skill) => void;
}

function SkillCategory({ name, skills, selectedSkills, onSkillToggle }: SkillCategoryProps) {
    return (
        <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{name}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {skills.map(skill => (
                    <button
                        key={skill.id}
                        onClick={() => onSkillToggle(skill)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                            selectedSkills.includes(skill.id)
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                        }`}
                    >
                        {skill.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface SkillDescriptionPanelProps {
    activeSkill: Skill | null;
}

function SkillDescriptionPanel({ activeSkill }: SkillDescriptionPanelProps) {
    return (
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
    );
}
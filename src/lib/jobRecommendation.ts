import { SurveyAnswers, RecommendedJob } from './types';
import { JOB_ORDER, jobDetails, surveyWeights, skillJobMapping } from './data';

const SKILL_BONUS = 1.5;
const MAX_PERCENTAGE = 85;
const MIN_PERCENTAGE = 40;

export class JobRecommendationEngine {

    /**
     * 설문 답변과 선택된 스킬을 기반으로 직무를 추천합니다.
     */
    static calculateRecommendations(
        surveyAnswers: SurveyAnswers,
        selectedSkills: string[]
    ): RecommendedJob[] {
        const scores = this.calculateJobScores(surveyAnswers, selectedSkills);
        return this.formatRecommendations(scores);
    }

    /**
     * 각 직무별 점수를 계산합니다.
     */
    private static calculateJobScores(
        surveyAnswers: SurveyAnswers,
        selectedSkills: string[]
    ): { [key: string]: number } {
        // 초기 점수 설정
        const scores: { [key: string]: number } = JOB_ORDER.reduce(
            (acc, job) => ({ ...acc, [job]: 0 }),
            {}
        );

        // 설문 답변 점수 계산
        this.applySurveyWeights(scores, surveyAnswers);

        // 스킬 보너스 적용
        this.applySkillBonus(scores, selectedSkills);

        return scores;
    }

    /**
     * 설문 답변에 따른 가중치를 적용합니다.
     */
    private static applySurveyWeights(
        scores: { [key: string]: number },
        surveyAnswers: SurveyAnswers
    ): void {
        for (const questionId in surveyAnswers) {
            const userAnswer = surveyAnswers[questionId];
            const weights = surveyWeights[parseInt(questionId, 10)];

            if (weights) {
                weights.forEach((weight, index) => {
                    const jobId = JOB_ORDER[index];
                    if (scores[jobId] !== undefined) {
                        scores[jobId] += userAnswer * weight;
                    }
                });
            }
        }
    }

    /**
     * 선택된 스킬에 따른 보너스 점수를 적용합니다.
     */
    private static applySkillBonus(
        scores: { [key: string]: number },
        selectedSkills: string[]
    ): void {
        selectedSkills.forEach((skillId) => {
            const relatedJobs = skillJobMapping[skillId];
            if (relatedJobs) {
                relatedJobs.forEach(jobId => {
                    if (scores[jobId] !== undefined) {
                        scores[jobId] += SKILL_BONUS;
                    }
                });
            }
        });
    }

    /**
     * 점수를 기반으로 추천 결과를 포맷팅합니다.
     */
    private static formatRecommendations(
        scores: { [key: string]: number }
    ): RecommendedJob[] {
        const sortedJobs = JOB_ORDER
            .map(id => ({ id, score: scores[id] }))
            .sort((a, b) => b.score - a.score);

        const topScore = sortedJobs[0]?.score > 0 ? sortedJobs[0].score : 1;

        return sortedJobs.slice(0, 3).map((job) => {
            const calculatedRate = MIN_PERCENTAGE +
                (MAX_PERCENTAGE - MIN_PERCENTAGE) * (job.score / topScore);
            const matchRate = Math.round(job.score > 0 ? calculatedRate : MIN_PERCENTAGE);

            return {
                id: job.id,
                score: job.score,
                title: jobDetails[job.id].title,
                description: jobDetails[job.id].description,
                matchRate,
            };
        });
    }

    /**
     * URL 파라미터에서 데이터를 안전하게 파싱합니다.
     */
    static parseUrlParams(answersParam: string | null, skillsParam: string | null): {
        surveyAnswers: SurveyAnswers | null;
        selectedSkills: string[] | null;
    } {
        if (!answersParam || !skillsParam) {
            return { surveyAnswers: null, selectedSkills: null };
        }

        try {
            const surveyAnswers = JSON.parse(answersParam);
            const selectedSkills = JSON.parse(skillsParam);
            return { surveyAnswers, selectedSkills };
        } catch (error) {
            console.error("URL 파라미터 분석 중 오류 발생:", error);
            return { surveyAnswers: null, selectedSkills: null };
        }
    }
}
export interface Job {
    emoji: string;
    animalName: string;
    jobTitle: string;
    features: string[];
}

export interface JobDetail {
    title: string;
    description: string;
}

export interface Skill {
    id: string;
    name: string;
    definition: string;
}

export interface SurveyQuestion {
    id: number;
    text: string;
}

export interface RecommendedJob {
    id: string;
    title: string;
    description: string;
    matchRate: number;
    score: number;
}

export interface SurveyAnswers {
    [key: number]: number;
}
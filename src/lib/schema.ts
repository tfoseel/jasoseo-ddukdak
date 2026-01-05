export type ProjectType = "실무" | "연구/과제" | "개인프로젝트" | "대외활동/동아리" | "대회/공모전";

export interface ProjectEntry {
    id: string;
    name: string;
    type: ProjectType;
    period?: string;
    keyword?: string;
}

export interface DeepDiveAnswer {
    projectId: string;
    problem: string;
    obstacleType: string;
    obstacleDetail: string;
    actionFirst: string;
    actionReal: string;
    roleType: string;
    roleDetail: string;
    techStack: string;
    result: string;
    learning: string;
}

export interface InterviewData {
    basicInfo: {
        company: string;
        role: string;
        email?: string;
        questions: string[];
    };
    projects: ProjectEntry[];
    deepDiveAnswers: DeepDiveAnswer[];
    tone: {
        selectedTone: string;
        usagePurpose: string;
        bannedWords: string[];
    };
}

export const INTERVIEW_STEPS = [
    { id: "basic", title: "기본 정보" },
    { id: "projects", title: "경험 선택" },
    { id: "deep_dive", title: "상세 인터뷰" },
    { id: "tone", title: "마무리" }
];

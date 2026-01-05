export type ProjectType = "실무" | "연구/과제" | "개인프로젝트" | "대외활동/동아리" | "대회/공모전";

export interface ProjectEntry {
    id: string;
    name: string;
    type: ProjectType;
    period?: string;
    keyword?: string;
    appealPoints?: string[];
}


export const COMPETENCIES = [
    { id: "expertise", label: "직무 전문성", desc: "해당 분야의 기술력이나 지식" },
    { id: "communication", label: "협업 및 소통", desc: "팀워크와 원활한 협력 능력" },
    { id: "problem_solving", label: "문제 해결", desc: "논리적으로 장애물을 극복한 경험" },
    { id: "challenge", label: "도전 및 성취", desc: "높은 목표를 달성하거나 실패를 극복" },
    { id: "leadership", label: "리더십", desc: "조직을 이끌고 방향을 제시한 경험" },
    { id: "creative", label: "창의적 사고", desc: "새로운 관점으로 개선을 시도" },
];


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
    period: string;
    teamSize: string;
    result: string;
    learning: string;
}


export interface InterviewData {
    basicInfo: {
        company: string;
        department: string;
        team: string;
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
    generatedDrafts?: string[];
}


export const INTERVIEW_STEPS = [
    { id: "basic", title: "기본 정보" },
    { id: "projects", title: "경험 선택" },
    { id: "deep_dive", title: "상세 인터뷰" },
    { id: "tone", title: "마무리" }
];

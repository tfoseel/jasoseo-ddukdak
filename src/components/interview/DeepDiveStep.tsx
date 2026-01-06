"use client";

import { useState, useEffect } from "react";
import { useInterviewStore } from "@/lib/store";
import { DeepDiveAnswer } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, HelpCircle, AlertCircle, CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- Topic Metadata Structures ---
interface SubQuestion {
    label: string;
    options?: string[]; // Multi-select allowed
    placeholder?: string;
}

interface Topic {
    id: string;
    title: string;
    description: string;
    subQuestions: SubQuestion[];
}

const SITUATION_TOPICS: Topic[] = [
    {
        id: "time_resource",
        title: "일정 및 리소스가 부족했나요?",
        description: "마감 기한이 매우 촉박했거나 인력/예산/장비 등 자원이 제한적이었던 상황",
        subQuestions: [
            { label: "얼마나 부족했나요?", options: ["기한 50% 단축", "팀원 2명 중도 이탈", "예산 30% 감축", "장비 수급 지연"] },
            { label: "그로 인한 구체적인 위기는?", placeholder: "예: 마케팅 캠페인이 일주일 앞으로 다가왔으나, 디자인 외주 업체와의 계약 파기로 소재 제작이 아예 중단된 상황" }
        ]
    },
    {
        id: "new_challenge",
        title: "새로운 방식/도구/환경에 도전했나요?",
        description: "낯선 업무 프로세스, 새로운 툴 도입 또는 처음 시도하는 프로젝트",
        subQuestions: [
            { label: "어떤 새로운 시도였나요?", placeholder: "예: 10년 넘게 유지된 수기 장부 관리 방식을 클라우드 전산 시스템으로 전면 전환 시도" },
            { label: "가장 어려웠던 점은?", options: ["기존 데이터 호환 문제", "사용 방법 숙지(러닝커브)", "기존 인력의 반대", "검증되지 않은 도구의 리스크"] }
        ]
    },
    {
        id: "unexpected_issue",
        title: "예상치 못한 돌발 변수나 문제가 발생했나요?",
        description: "진행 도중 발생한 예외 상황이나 결과물의 퀄리티 저하 사례",
        subQuestions: [
            { label: "문제의 유형은?", options: ["갑작스러운 법규/정책 변경", "핵심 데이터 유실/오류", "메인 서버/시스템 마비", "협력사 파산/계약 위반"] },
            { label: "원인은 무엇이었나요?", placeholder: "예: 행사 당일 폭우로 인해 야외 무대 설치가 불가능해졌으나, 우천 시 대책(Plan B)이 수립되지 않았던 관리 미흡" }
        ]
    },
    {
        id: "team_conflict",
        title: "팀원 간 의견 차이나 소통 문제가 있었나요?",
        description: "역할 분담 모호함, 의견 대립, 소통 비효율 등",
        subQuestions: [
            { label: "갈등의 원인은?", options: ["성과 배분 불공정", "우선순위(속도 vs 퀄리티) 대립", "업무 범위(R&R) 중첩", "부적절한 소통 태도"] },
            { label: "해결의 실마리는?", placeholder: "예: 감정적 대응 대신, 각 대안별 예상 기대 효과를 데이터로 산출하여 의사결정권자에게 제안함" }
        ]
    },
    {
        id: "customer_need",
        title: "고객/사용자의 요구사항이나 불만을 해결했나요?",
        description: "타 부서, 외부 고객, 상사 등의 피드백을 반영해 개선한 경우",
        subQuestions: [
            { label: "어떤 피드백이었나요?", placeholder: "예: '회원가입 절차가 너무 복잡해서 3번이나 시도하다가 포기했다'는 실제 고객의 이메일 불만 접수" },
            { label: "개선 목표는?", options: ["이탈률 20% 감소", "재방문율 상향", "상담 문의 건수 감소", "구매 전환율 증대"] }
        ]
    }
];

const ACTION_TOPICS: Topic[] = [
    {
        id: "analysis",
        title: "철저한 분석과 리서치를 선행했나요?",
        description: "문제 해결을 위해 현상을 진단하거나 사례를 파고든 과정",
        subQuestions: [
            { label: "무엇을 분석했나요?", options: ["최근 3년간 매출 추이", "경쟁사 5곳의 기능 비교", "타 업직군 10곳의 성공 사례", "현장 실무자 20명 인터뷰"] },
            { label: "분석을 통해 얻은 인사이트는?", placeholder: "예: 우리 서비스의 이탈 지점이 결제가 아닌, '배송지 입력' 단계에 집중되어 있음을 발견" }
        ]
    },
    {
        id: "process",
        title: "효율적인 시스템이나 체계를 도입했나요?",
        description: "비효율을 줄이기 위해 업무 규칙이나 도구를 개선한 경우",
        subQuestions: [
            { label: "어떤 방식을 도입했나요?", options: ["업무 자동화 자동화(매크로 등)", "통합 협업툴(Slack/Jira) 도입", "표준 매뉴얼(SOP) 제작", "코드 리뷰/피어 리뷰 문화"] },
            { label: "구체적인 실행 내용은?", placeholder: "예: 매일 반복되는 엑셀 데이터 취합 업무를 파이썬 스크립트로 자동화하여, 3시간 걸리던 업무를 1분으로 단축함" }
        ]
    },
    {
        id: "direct_execution",
        title: "직접 핵심 업무를 수행하거나 주도했나요?",
        description: "실질적인 성과물을 만들거나 실무를 이끌어간 행동",
        subQuestions: [
            { label: "어떤 시도를 했나요?", options: ["핵심 UI/UX 디자인 주도", "신규 비즈니스 모델 설계", "마케팅 콘텐츠 30종 제작", "메인 알고리즘 최적화"] },
            { label: "수행 디테일(방법, 도구)은?", placeholder: "예: 피그마를 활용해 20개가 넘는 페이지의 디자인 가이드를 통일하여, 개발팀과의 협업 속도를 1.5배 높임" }
        ]
    },
    {
        id: "collaboration",
        title: "적극적인 소통으로 협력을 이끌어냈나요?",
        description: "이해관계자를 설득하거나 도움을 요청해 성과를 낸 행동",
        subQuestions: [
            { label: "누구와 어떻게 소통했나요?", options: ["유관 부서 합동 회의 주최", "시각화 장표(PT)로 논리적 설득", "멘토/전문가 자문 요청", "적극적인 경청 후 절충안 제시"] },
            { label: "소통의 핵심 포인트는?", placeholder: "예: 개발팀의 업무 부담을 고려하여 기능 구현 순서를 2단계로 나누어 제안함으로써 최종 합의를 이끌어냄" }
        ]
    }
];

const RESULT_TOPICS: Topic[] = [
    {
        id: "quantitative",
        title: "수치적으로 증명할 수 있는 성과가 있나요?",
        description: "시간 단축, 비용 절감, 정확도 향상 등 정량적 결과",
        subQuestions: [
            { label: "어떤 지표가 좋아졌나요?", options: ["매출/수익 20% 증대", "업무 시간 연간 500시간 절감", "검색 결과 정확도 95% 달성", "불량률 0.1%로 감소"] },
            { label: "구체적인 수치(Before -> After)는?", placeholder: "예: 페이지 로딩 속도를 3.5초에서 0.9초로 개선하여, 사용자 이탈률을 45%에서 12%로 낮춤" }
        ]
    },
    {
        id: "qualitative",
        title: "품질, 조직 문화 등 질적인 향상이 있었나요?",
        description: "완성도 향상, 신뢰도 확보, 안정적 운영 환경 조성 등",
        subQuestions: [
            { label: "어떤 부분이 개선되었나요?", options: ["사내 업무 투명성 증대", "결과물 디자인 완성도", "유지보수 용이성 확보", "팀 내 협업 피드백 개선"] },
            { label: "변화된 모습은?", placeholder: "예: 중구난방이던 파일 관리 체계를 노션으로 통합하여, 전 사원이 필요한 정보를 5초 안에 찾을 수 있게 됨" }
        ]
    },
    {
        id: "external",
        title: "외부 기관이나 타인의 인정을 받았나요?",
        description: "상사/고객의 칭찬, 수상, 자격 취득 등",
        subQuestions: [
            { label: "어떤 성과인가요?", options: ["전사 연말 우수 사원 표창", "공모전 금상(도지사상) 수상", "고객 만족도 평가 98점", "특허 2건 출원 완료"] },
            { label: "해당 성과의 명칭이나 반응은?", placeholder: "예: '현업에서 나온 아이디어 중 가장 실용적'이라는 CFO의 특별 코멘트와 함께 예산 추가 승인" }
        ]
    }
];

const LEARNING_TOPICS: Topic[] = [
    {
        id: "professional_growth",
        title: "직무적으로 한 단계 성장했나요?",
        description: "업무의 핵심 원리를 깨닫거나 노하우를 얻은 점",
        subQuestions: [
            { label: "무엇을 깊게 깨달았나요?", placeholder: "예: 단순히 시키는 대로 일하는 것을 넘어, 비즈니스 목표와 내 업무의 연결 고리를 이해하게 됨" },
            { label: "향후 어떻게 기여할 것인가요?", placeholder: "예: 데이터 분석을 통해 가설을 먼저 세우고 검증하는 습관을 들여, 불필요한 시행착오를 20% 이상 줄일 수 있음" }
        ]
    },
    {
        id: "softskill_insight",
        title: "태도나 소통 측면에서 배운 점이 있나요?",
        description: "협업 방식, 마음가짐 등에 대한 회고",
        subQuestions: [
            { label: "어떤 태도가 중요함을 느꼈나요?", options: ["철저한 문서화 기반 공유", "실수를 빠르게 인정하는 자세", "공격적이지 않은 비판적 태도", "작은 디테일의 중요성"] },
            { label: "구체적인 깨달음은?", placeholder: "예: '아는 것'과 '전달하는 것'은 완전히 다른 능력임을 느끼고, 비전공자도 이해할 수 있는 쉬운 용어 사용의 중요성을 배움" }
        ]
    },
    {
        id: "regret",
        title: "아쉬움이 남거나 보완하고 싶은 점이 있다면?",
        description: "다시 돌아간다면 다르게 했을 부분에 대한 솔직한 회고",
        subQuestions: [
            { label: "무엇이 가장 아쉬웠나요?", options: ["일정 산출 시 리스크 미고려", "자존심 때문에 도움 요청 지연", "데이터 대신 감에 의존한 결정", "중간 보고 생략으로 인한 방향성 오해"] },
            { label: "어떻게 보완하고 싶나요?", placeholder: "예: 개발 시작 전 요구사항을 명확히 정의하는 '사전 미팅' 단계를 30분이라도 가졌더라면, 재작업 시간을 이틀이나 아꼈을 것" }
        ]
    }
];


export function DeepDiveStep() {
    const { projects, deepDiveAnswers, updateDeepDiveAnswer } = useInterviewStore();
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);

    const currentProject = projects[activeProjectIndex];
    // Ensure we have a valid answer object
    const currentAnswer = deepDiveAnswers.find(a => a.projectId === currentProject?.id) || {
        projectId: currentProject?.id || '',
        problem: '', obstacleType: '', obstacleDetail: '',
        actionReal: '', actionFirst: '',
        roleType: '', roleDetail: '',
        techStack: '', period: '', teamSize: '',
        result: '', learning: '',
    };

    const handleTopicChange = (field: keyof DeepDiveAnswer, value: string) => {
        updateDeepDiveAnswer({ ...currentAnswer, projectId: currentProject.id, [field]: value });
    };

    if (projects.length === 0) {
        return (
            <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                <p className="text-gray-400 font-medium italic">등록된 경험이 없습니다. 이전 단계에서 경험을 추가해 주세요.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Project Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 rounded-xl overflow-x-auto no-scrollbar">
                {projects.map((p, idx) => (
                    <button
                        key={p.id}
                        onClick={() => setActiveProjectIndex(idx)}
                        className={cn(
                            "whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all shrink-0",
                            activeProjectIndex === idx
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-400 hover:text-gray-600"
                        )}
                    >
                        {p.name || `경험 ${idx + 1}`}
                    </button>
                ))}
            </div>

            <div className="space-y-12">
                {/* 1. Situation (Problem) */}
                <TopicInterview
                    stepNumber={1}
                    title="어떤 상황(문제)이 있었나요?"
                    topics={SITUATION_TOPICS}
                    value={currentAnswer.problem}
                    onChange={(val) => handleTopicChange("problem", val)}
                    projectId={currentProject.id} // Re-mount component on project switch
                />

                {/* 2. Action */}
                <TopicInterview
                    stepNumber={2}
                    title="어떤 구체적인 해결 행동을 했나요?"
                    topics={ACTION_TOPICS}
                    value={currentAnswer.actionReal}
                    onChange={(val) => handleTopicChange("actionReal", val)}
                    projectId={currentProject.id}
                />

                {/* 3. Factual Information (Middle Grid) */}
                <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">수행 기간</label>
                            <input
                                type="text"
                                value={currentAnswer.period}
                                onChange={(e) => handleTopicChange("period", e.target.value)}
                                placeholder="예: 3개월"
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">참여 인원</label>
                            <input
                                type="text"
                                value={currentAnswer.teamSize}
                                onChange={(e) => handleTopicChange("teamSize", e.target.value)}
                                placeholder="예: 5명"
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">주요 도구 / 스킬</label>
                            <input
                                type="text"
                                value={currentAnswer.techStack}
                                onChange={(e) => handleTopicChange("techStack", e.target.value)}
                                placeholder="Excel, Notion, Python 등"
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Result */}
                <TopicInterview
                    stepNumber={3}
                    title="어떤 유의미한 결과로 이어졌나요?"
                    topics={RESULT_TOPICS}
                    value={currentAnswer.result}
                    onChange={(val) => handleTopicChange("result", val)}
                    projectId={currentProject.id}
                />

                {/* 5. Learning */}
                <TopicInterview
                    stepNumber={4}
                    title="솔직한 회고: 무엇을 배웠거나 아쉬웠나요?"
                    topics={LEARNING_TOPICS}
                    value={currentAnswer.learning}
                    onChange={(val) => handleTopicChange("learning", val)}
                    projectId={currentProject.id}
                />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-10 border-t border-gray-100 pb-10">
                <Button variant="outline" size="sm" onClick={() => setActiveProjectIndex(Math.max(0, activeProjectIndex - 1))} disabled={activeProjectIndex === 0} className="rounded-full"><ChevronLeft className="w-4 h-4 mr-1" /> 이전 경험</Button>
                <span className="text-xs font-bold text-gray-400">{activeProjectIndex + 1} / {projects.length}</span>
                <Button variant="outline" size="sm" onClick={() => setActiveProjectIndex(Math.min(projects.length - 1, activeProjectIndex + 1))} disabled={activeProjectIndex === projects.length - 1} className="rounded-full">다음 경험 <ChevronRight className="w-4 h-4 ml-1" /></Button>
            </div>
        </div>
    );
}

// --- Topic Interview Component ---
interface TopicInterviewProps {
    title: string;
    stepNumber?: number;
    topics: Topic[];
    value: string; // The existing compiled string default
    onChange: (val: string) => void;
    projectId: string; // Used to reset internal state when project changes
}

function TopicInterview({ title, stepNumber, topics, value, onChange, projectId }: TopicInterviewProps) {
    // Internal state structure: { [topicId]: { active: boolean, answers: { [subIdx]: { selected: string[], text: string } } } }
    type TopicState = {
        active: boolean;
        answers: Record<number, { selected: string[]; text: string }>;
    };

    const [state, setState] = useState<Record<string, TopicState>>({});

    // Reset state when project changes (simplest approach for MVP)
    useEffect(() => {
        setState({});
    }, [projectId]);

    // Helper: Parse the compiled string back into structured state
    const parseValueToState = (val: string): Record<string, TopicState> => {
        const newState: Record<string, TopicState> = {};
        if (!val || !val.startsWith("[")) return newState;

        const topicBlocks = val.split("\n\n");
        topicBlocks.forEach(block => {
            const topicMatch = block.match(/^\[(.*?)\] (.*)/);
            if (!topicMatch) return;

            const [_, title, content] = topicMatch;
            const topic = topics.find(t => t.title === title);
            if (!topic) return;

            const subAnswers: Record<number, { selected: string[]; text: string }> = {};
            const details = content.split(" / ");

            details.forEach(detail => {
                const subIndex = topic.subQuestions.findIndex(sq => detail.startsWith(sq.label));
                if (subIndex === -1) return;

                const sq = topic.subQuestions[subIndex];
                const rest = detail.slice(sq.label.length).trim();

                let selected: string[] = [];
                let text = rest;

                const optionsMatch = rest.match(/^\[(.*?)\] (.*)/) || rest.match(/^\[(.*?)\]$/);
                if (optionsMatch) {
                    selected = optionsMatch[1].split(", ").map(s => s.trim());
                    text = optionsMatch[2] || "";
                }

                subAnswers[subIndex] = { selected, text };
            });

            newState[topic.id] = { active: true, answers: subAnswers };
        });
        return newState;
    };

    // Load initial data from prop if state is empty
    useEffect(() => {
        if (Object.keys(state).length === 0 && value.startsWith("[")) {
            const parsed = parseValueToState(value);
            if (Object.keys(parsed).length > 0) {
                setState(parsed);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, value]);

    // Update parent when internal state changes (SIDE EFFECT OUTSIDE RENDER)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (Object.keys(state).length === 0) return;

            const text = Object.entries(state)
                .filter(([_, tState]) => tState.active)
                .map(([tId, tState]) => {
                    const topic = topics.find(t => t.id === tId);
                    if (!topic) return "";

                    const details = topic.subQuestions.map((sq, idx) => {
                        const ans = tState.answers[idx];
                        const parts = [];
                        if (ans?.selected?.length > 0) parts.push(`[${ans.selected.join(", ")}]`);
                        if (ans?.text) parts.push(ans.text);
                        if (parts.length === 0) return null;
                        return `${sq.label} ${parts.join(" ")}`;
                    }).filter(Boolean).join(" / ");

                    return `[${topic.title}] ${details}`;
                })
                .filter(Boolean)
                .join("\n\n");

            if (text !== value && text !== "") {
                onChange(text);
            }
        }, 100);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    const handleToggleTopic = (topicId: string, isActive: boolean) => {
        setState(prev => ({
            ...prev,
            [topicId]: { ...prev[topicId], active: isActive, answers: prev[topicId]?.answers || {} }
        }));
    };

    const handleOptionToggle = (topicId: string, subIdx: number, option: string) => {
        setState(prev => {
            const currentTopic = prev[topicId] || { active: true, answers: {} };
            const currentSub = currentTopic.answers[subIdx] || { selected: [], text: "" };
            const newSelected = currentSub.selected.includes(option)
                ? currentSub.selected.filter(o => o !== option)
                : [...currentSub.selected, option];

            return {
                ...prev,
                [topicId]: {
                    ...currentTopic,
                    answers: { ...currentTopic.answers, [subIdx]: { ...currentSub, selected: newSelected } }
                }
            };
        });
    };

    const handleTextChange = (topicId: string, subIdx: number, text: string) => {
        setState(prev => {
            const currentTopic = prev[topicId] || { active: true, answers: {} };
            const currentSub = currentTopic.answers[subIdx] || { selected: [], text: "" };
            return {
                ...prev,
                [topicId]: {
                    ...currentTopic,
                    answers: { ...currentTopic.answers, [subIdx]: { ...currentSub, text } }
                }
            };
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                {stepNumber && <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">{stepNumber}</span>}
                <h3 className="text-lg font-bold text-gray-900">{title} <span className="text-xs text-gray-400 font-normal ml-2">(해당하는 항목을 모두 선택하세요)</span></h3>
            </div>

            <div className="grid gap-3">
                {topics.map((topic) => {
                    const isActive = state[topic.id]?.active;

                    return (
                        <div
                            key={topic.id}
                            className={cn(
                                "rounded-2xl border transition-all overflow-hidden",
                                isActive ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-200" : "bg-white border-gray-100 hover:border-gray-200"
                            )}
                        >
                            <div
                                onClick={() => handleToggleTopic(topic.id, !isActive)}
                                className="p-5 flex items-start gap-4 cursor-pointer select-none"
                            >
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors",
                                    isActive ? "border-blue-600 bg-blue-600" : "border-gray-200 bg-white"
                                )}>
                                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div className="space-y-1 flex-1">
                                    <h4 className={cn("text-sm font-bold", isActive ? "text-blue-700" : "text-gray-700")}>{topic.title}</h4>
                                    <p className="text-xs text-gray-400 font-medium break-keep opacity-80">{topic.description}</p>
                                </div>
                            </div>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-blue-100/50"
                                    >
                                        <div className="p-5 pt-2 space-y-5 bg-white/50">
                                            {topic.subQuestions.map((subQ, idx) => {
                                                const subState = state[topic.id]?.answers[idx] || { selected: [], text: "" };

                                                return (
                                                    <div key={idx} className="space-y-2">
                                                        <label className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                                                            <AlertCircle className="w-3 h-3" /> {subQ.label}
                                                        </label>

                                                        {subQ.options && (
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {subQ.options.map(opt => (
                                                                    <button
                                                                        key={opt}
                                                                        onClick={() => handleOptionToggle(topic.id, idx, opt)}
                                                                        className={cn(
                                                                            "text-[11px] px-3 py-1.5 rounded-lg border font-medium transition-all hover:bg-blue-50",
                                                                            subState.selected.includes(opt)
                                                                                ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/10"
                                                                                : "bg-white text-gray-500 border-gray-100"
                                                                        )}
                                                                    >
                                                                        {opt}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <input
                                                            type="text"
                                                            placeholder={subQ.placeholder || "내용을 입력해주세요."}
                                                            value={subState.text}
                                                            onChange={(e) => handleTextChange(topic.id, idx, e.target.value)}
                                                            className="w-full text-xs p-3 rounded-xl border border-gray-200 bg-white focus:border-blue-400 outline-none placeholder:text-gray-300"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>

            {/* Custom Input (Fallback) */}
            <div className="pt-2">
                <textarea
                    value={value.startsWith("[") ? "" : value} // Only show if user typed custom stuff not via structure, or maybe utilize a separate field? 
                    // For now, let's just allow appending or separate editing. 
                    // Actually, if we use the structured builder, this simple textarea might conflict if binding to same value.
                    // Strategy: If 'value' contains Structured Tags (e.g. [상황: ...]), show a read-only or small preview?
                    // User might want to edit the raw string.
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="위 항목에 없는 내용은 여기에 자유롭게 추가로 작성할 수 있습니다."
                    className="w-full min-h-[60px] p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-xs focus:bg-white outline-none resize-none"
                />
                <p className="text-[10px] text-gray-400 mt-1 pl-1">* 위 선택지에서 선택하면 내용이 자동으로 생성됩니다. 생성된 내용을 직접 수정하고 싶다면 아래 박스를 이용하세요.</p>
            </div>
        </div>
    );
}

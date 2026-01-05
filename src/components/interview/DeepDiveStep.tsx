"use client";

import { useState, useMemo } from "react";
import { useInterviewStore } from "@/lib/store";
import { DeepDiveAnswer } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { ChevronLeft, ChevronRight, RefreshCw, PenLine, HelpCircle } from "lucide-react";

import { cn } from "@/lib/utils";

// Extensive MCQ pool (Expanding to ~20 curated items per category for MVP, can be extended)
const QUESTION_POOL = {
    problem: [
        "기존 방식의 비효율성 개선", "예상치 못한 기술적 에러 발생", "팀원 간의 의견 충돌/소통 부재",
        "촉박한 마감 기한과 자원 부족", "이전에 없던 새로운 기능 구현", "데이터 누락 및 무결성 문제",
        "고객/사용자의 불만 사항 해결", "레거시 코드의 복잡성 해결", "성능 저하 및 최적화 필요",
        "프로세스 가이드라인 부재", "복잡한 요구사항의 이해 부족", "도구/기술 스택 숙련도 부족",
        "시장 트렌드 변화에 대응", "보안 취약점 및 리스크 관리", "부서/조직 간의 협업 마찰"
    ],
    action: [
        "철저한 데이터 분석 및 원인 파악", "새로운 도구/프레임워크 도입", "주기적인 미팅 및 소통 강화",
        "우선순위 재설정 및 일정 조정", "기존 프로세스의 매뉴얼화", "사용자 피드백 수집 및 반영",
        "상세한 테스트 및 검증 수행", "동료와의 협업 및 코드 리뷰", "전문가/상급자의 조언 요청",
        "자동화 툴 개발 및 배포", "기술 문서화 및 지식 공유", "직접 발로 뛰는 현장 확인",
        "반복적인 실험과 프로토타입 제작", "핵심 기능에 집중한 MVP 개발", "유연한 의사결정 방식 도입"
    ],
    result: [
        "작업 효율/속도 20% 이상 개선", "에러/이탈률 유의미한 감소", "팀 내 협업 만족도 향상",
        "목표 기한 내 안정적 배포", "사용자 수/매출액 증가 기록", "기술적 우수성으로 수상/인정",
        "프로세스 표준화 및 매뉴얼 구축", "신규 기능 성공적 런칭", "리소스 및 비용 절감 달성",
        "조직 내 지식 전파 및 공유", "고객 만족도 점수 상승", "시스템 안정성 및 보안 강화"
    ],
    learning: [
        "기술적 완성도에 매몰되어 사용자 편의성을 놓친 점이 아쉬움", "팀원과의 소통 부족으로 일정 지연이 발생한 점을 반성함",
        "철저한 사전 계획보다 실행 후에 수습하느라 에너지를 낭비함", "주관적인 판단으로 데이터를 오독하여 리스크를 키웠던 경험",
        "완벽주의 성향 때문에 프로젝트의 핵심 목표를 놓칠 뻔함", "혼자 해결하려다 팀의 리소스를 효율적으로 활용하지 못함",
        "기술적 난관 앞에서 쉽게 포기하려 했던 태도를 고치게 됨", "비즈니스 목표보다 기술적 호기심을 우선시했던 점을 상기함",
        "구체적인 문서화 없이 진행하여 추후 유지보수가 힘들었던 점", "초기 요구사항 분석을 소홀히 하여 재작업이 많았던 아쉬움"
    ]
};

export function DeepDiveStep() {
    const { projects, deepDiveAnswers, updateDeepDiveAnswer } = useInterviewStore();
    const [activeProjectIndex, setActiveProjectIndex] = useState(0);
    const [editMode, setEditMode] = useState<Record<string, boolean>>({});

    const currentProject = projects[activeProjectIndex];
    const currentAnswer = deepDiveAnswers.find(a => a.projectId === currentProject?.id) || {
        projectId: currentProject?.id || '',
        problem: '', obstacleType: '', obstacleDetail: '',
        actionFirst: '', actionReal: '',
        roleType: '', roleDetail: '',
        techStack: '', period: '', teamSize: '',
        result: '', learning: '',
    };

    const handleChange = (field: keyof DeepDiveAnswer, value: string) => {
        updateDeepDiveAnswer({ ...currentAnswer, projectId: currentProject.id, [field]: value });
    };

    const toggleEdit = (field: string) => {
        setEditMode(prev => ({ ...prev, [field]: !prev[field] }));
    };

    // Helper to shuffle or get subset
    const getSubPool = (key: keyof typeof QUESTION_POOL) => QUESTION_POOL[key].slice(0, 8);

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
                {/* MCQ Question Block */}
                <ChoiceQuestion
                    title="어떤 상황(문제)이 있었나요?"
                    options={getSubPool('problem')}
                    value={currentAnswer.problem}
                    onSelect={(val: string) => handleChange('problem', val)}
                    isEditing={editMode['problem']}
                    onToggleEdit={() => toggleEdit('problem')}
                />

                <ChoiceQuestion
                    title="어떤 구체적인 해결 행동을 했나요?"
                    options={getSubPool('action')}
                    value={currentAnswer.actionReal}
                    onSelect={(val: string) => handleChange('actionReal', val)}
                    isEditing={editMode['actionReal']}
                    onToggleEdit={() => toggleEdit('actionReal')}
                />

                {/* Factual Information Grid */}
                <div className="bg-gray-50/50 p-6 rounded-[24px] border border-gray-100 space-y-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">수행 기간</label>
                            <input
                                type="text"
                                value={currentAnswer.period}
                                onChange={(e) => handleChange('period', e.target.value)}
                                placeholder="예: 3개월"
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">참여 인원</label>
                            <input
                                type="text"
                                value={currentAnswer.teamSize}
                                onChange={(e) => handleChange('teamSize', e.target.value)}
                                placeholder="예: 5명"
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-2 col-span-2">
                            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">주요 도구 / 스택</label>
                            <input
                                type="text"
                                value={currentAnswer.techStack}
                                onChange={(e) => handleChange('techStack', e.target.value)}
                                placeholder="React, Figma, Python 등"
                                className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs outline-none focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">나의 역할</label>
                        <div className="flex gap-2">
                            {["리더 (팀장/PM)", "팀원 (팔로워)", "1인 수행"].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => handleChange('roleType', opt)}
                                    className={cn(
                                        "flex-1 h-10 rounded-xl border text-[11px] font-bold transition-all",
                                        currentAnswer.roleType === opt
                                            ? "bg-primary border-primary text-white shadow-md shadow-blue-500/10"
                                            : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                                    )}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <ChoiceQuestion
                    title="어떤 유의미한 결과로 이어졌나요?"
                    options={getSubPool('result')}
                    value={currentAnswer.result}
                    onSelect={(val: string) => handleChange('result', val)}
                    isEditing={editMode['result']}
                    onToggleEdit={() => toggleEdit('result')}
                />

                <ChoiceQuestion
                    title="솔직한 회고: 무엇을 배웠거나 아쉬웠나요?"
                    options={getSubPool('learning')}
                    value={currentAnswer.learning}
                    onSelect={(val: string) => handleChange('learning', val)}
                    isEditing={editMode['learning']}
                    onToggleEdit={() => toggleEdit('learning')}
                />
            </div>

            {/* Internal Navigation */}
            <div className="flex items-center justify-between pt-10 border-t border-gray-100 pb-10">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveProjectIndex(prev => Math.max(0, prev - 1))}
                    disabled={activeProjectIndex === 0}
                    className="rounded-full"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> 이전 경험
                </Button>
                <span className="text-xs font-bold text-gray-400">{activeProjectIndex + 1} / {projects.length}</span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveProjectIndex(prev => Math.min(projects.length - 1, prev + 1))}
                    disabled={activeProjectIndex === projects.length - 1}
                    className="rounded-full"
                >
                    다음 경험 <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
            </div>
        </div>
    );
}

interface ChoiceQuestionProps {
    title: string;
    options: string[];
    value: string;
    onSelect: (val: string) => void;
    isEditing: boolean;
    onToggleEdit: () => void;
}

function ChoiceQuestion({ title, options, value, onSelect, isEditing, onToggleEdit }: ChoiceQuestionProps) {
    const handleSelect = (opt: string) => {
        onSelect(opt);
        if (!isEditing) onToggleEdit(); // Auto-switch to refinement mode
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-gray-900">{title}</h3>
                <button
                    onClick={onToggleEdit}
                    className={cn("text-xs font-bold flex items-center gap-1 transition-colors", isEditing ? "text-primary" : "text-gray-400 hover:text-gray-600")}
                >
                    {isEditing ? <RefreshCw className="w-3 h-3" /> : <PenLine className="w-3 h-3" />}
                    {isEditing ? "다시 고르기" : "직접 입력하기"}
                </button>
            </div>

            {!isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {options.map((opt: string) => (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            className={cn(
                                "p-4 rounded-xl border text-sm font-medium transition-all text-left break-keep leading-snug hover:border-primary hover:bg-blue-50/30",
                                value === opt
                                    ? "border-primary bg-blue-50 text-blue-700 shadow-md shadow-blue-500/10"
                                    : "border-gray-100 bg-white text-gray-500"
                            )}
                        >
                            {opt}
                        </button>
                    ))}
                    <button
                        onClick={onToggleEdit}
                        className="p-4 rounded-xl border border-dashed border-gray-200 text-sm font-medium text-gray-400 flex items-center justify-center gap-2 hover:bg-gray-50"
                    >
                        기타 (직접 입력하기)
                    </button>
                </div>
            ) : (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-200">
                    <textarea
                        value={value}
                        onChange={(e) => onSelect(e.target.value)}
                        placeholder="여기에 직접 내용을 작성하거나, 선택한 보기를 구체적으로 수정해 주세요."
                        className="w-full min-h-[100px] p-4 rounded-xl border-2 border-primary bg-white outline-none text-sm resize-none shadow-lg shadow-blue-500/5 focus:ring-1 focus:ring-primary"
                        autoFocus
                    />
                    <div className="flex items-start gap-2 text-blue-600 bg-blue-50/50 p-3 rounded-lg">
                        <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-[11px] leading-relaxed font-medium break-keep">
                            Tip: 선택한 문구의 <strong>숫자나 결과(%)를 더 구체적으로</strong> 고쳐보세요. 자소서의 신뢰도가 훨씬 높아집니다!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

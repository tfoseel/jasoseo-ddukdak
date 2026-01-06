"use client";

import { useInterviewStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Sparkles, Lightbulb } from "lucide-react";

const STRENGTH_KEYWORDS = [
    "책임감", "분석력", "소통능력", "도전정신",
    "꼼꼼함", "창의성", "적응력", "추진력",
    "리더십", "공감능력", "문제해결", "성실함"
];

const VISION_EXAMPLES = [
    "데이터를 기반으로 고객의 숨겨진 니즈를 찾아내는 마케터",
    "복잡한 금융 정보를, 누구나 쉽게 이해하도록 돕는 자산 관리 전문가",
    "트렌드를 선도하며 브랜드 가치를 시각적으로 극대화하는 디자이너",
    "팀의 생산성을 최대로 끌어올리는 PM",
    "사용자 경험(UX)을 최우선으로 생각하는 개발자"
];

const WEAKNESS_EXAMPLES = [
    "완벽주의 성향으로 인해 기획 단계에서 시간이 많이 소요되는 편입니다.",
    "거절을 어려워하여 업무량이 과부하될 때가 있습니다.",
    "디테일에 집중하다 보니 전체적인 마감 기한 조율에 신중한 편입니다.",
];

const CORE_VALUE_EXAMPLES = [
    "실패를 두려워하지 않고, 그 안에서 배움을 찾아내는 사람",
    "혼자 빨리 가기보다, 함께 멀리 가는 것을 지향하는 사람",
    "항상 '왜?'라는 질문을 던지며, 본질적인 해결책을 찾는 사람",
];

export function ValueStep() {
    const { userProfile, updateUserProfile } = useInterviewStore();

    const toggleStrength = (keyword: string) => {
        const current = userProfile.strengths || [];
        if (current.includes(keyword)) {
            updateUserProfile({ strengths: current.filter(k => k !== keyword) });
        } else {
            if (current.length >= 3) return;
            updateUserProfile({ strengths: [...current, keyword] });
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="space-y-10">
                {/* 1. Strengths */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">성향 키워드 (최대 3개)</label>
                        <p className="text-sm font-bold text-gray-900 pl-1">나를 가장 잘 표현하는 키워드는 무엇인가요?</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {STRENGTH_KEYWORDS.map((keyword) => {
                            const isSelected = userProfile.strengths?.includes(keyword);
                            return (
                                <button
                                    key={keyword}
                                    onClick={() => toggleStrength(keyword)}
                                    className={cn(
                                        "px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                                        isSelected
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]"
                                            : "bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50"
                                    )}
                                >
                                    {keyword}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Weakness */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">나의 약점 및 보완점</label>
                        <p className="text-sm font-bold text-gray-900 pl-1">솔직한 약점과 극복 노력을 적어주세요.</p>
                    </div>
                    <div className="space-y-3">
                        <textarea
                            value={userProfile.weakness}
                            onChange={(e) => updateUserProfile({ weakness: e.target.value })}
                            placeholder="예: 완벽주의 성향 때문에 시간 조절이 어려울 때가 있지만, 체크리스트를 활용해 보완합니다."
                            className="w-full h-32 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium resize-none shadow-sm"
                        />
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">
                                <Sparkles className="w-3 h-3 text-amber-400" /> 추천 예시
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {WEAKNESS_EXAMPLES.map((example, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => updateUserProfile({ weakness: example })}
                                        className="text-[11px] bg-white text-gray-600 border border-gray-100 px-3 py-2 rounded-xl hover:border-primary hover:text-primary transition-all text-left font-bold shadow-sm"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Vision */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">장기적 비전 (Vision)</label>
                        <p className="text-sm font-bold text-gray-900 pl-1">미래에 어떤 전문가가 되고 싶나요?</p>
                    </div>
                    <div className="space-y-3">
                        <textarea
                            value={userProfile.vision}
                            onChange={(e) => updateUserProfile({ vision: e.target.value })}
                            placeholder="예: 데이터를 기반으로 고객의 숨겨진 니즈를 찾아내는 마케터가 되고 싶습니다."
                            className="w-full h-32 p-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium resize-none shadow-sm"
                        />
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">
                                <Sparkles className="w-3 h-3 text-amber-400" /> 추천 예시
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {VISION_EXAMPLES.map((example, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => updateUserProfile({ vision: example })}
                                        className="text-[11px] bg-white text-gray-600 border border-gray-100 px-3 py-2 rounded-xl hover:border-primary hover:text-primary transition-all text-left font-bold shadow-sm"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Core Value */}
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">핵심 가치 (Core Value)</label>
                        <p className="text-sm font-bold text-gray-900 pl-1">나를 정의하는 단 한 문장의 핵심 메시지</p>
                    </div>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={userProfile.coreValue || ""}
                            onChange={(e) => updateUserProfile({ coreValue: e.target.value })}
                            placeholder="예: 실패를 두려워하지 않고 끊임없이 도전하는 사람"
                            className="w-full h-14 px-5 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold shadow-sm"
                        />
                        <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100 space-y-2">
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-wider pl-0.5">
                                <Sparkles className="w-3 h-3 text-amber-400" /> 추천 예시
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {CORE_VALUE_EXAMPLES.map((example, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => updateUserProfile({ coreValue: example })}
                                        className="text-[11px] bg-white text-gray-600 border border-gray-100 px-3 py-2 rounded-xl hover:border-primary hover:text-primary transition-all text-left font-bold shadow-sm"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tip Zone */}
            <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[32px] flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 flex items-center justify-center shrink-0 shadow-sm">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-black text-blue-900">AI 페르소나 팁</h4>
                    <p className="text-xs text-blue-700/80 leading-relaxed font-medium break-keep">
                        이 정보들은 AI가 자소서를 작성할 때 <strong>지원자의 고유한 말투와 가치관</strong>을 설정하는 데 사용됩니다.
                        솔직하고 구체적으로 적을수록 더 나다운 자소서가 만들어집니다.
                    </p>
                </div>
            </div>
        </div>
    );
}

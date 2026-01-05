"use client";

import { useInterviewStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";
import { motion } from "framer-motion";


const TONES = [
    { id: "logical", label: "차분하고 논리적인", desc: "분석적이고 신뢰감 있는 느낌" },
    { id: "passionate", label: "솔직하고 열정적인", desc: "경험에 대한 진심이 느껴지는 느낌" },
    { id: "soft", label: "부드럽고 유연한", desc: "함께 일하고 싶은 편안한 느낌" },
];

const PURPOSES = [
    { id: "as_is", label: "거의 그대로 제출", desc: "완성도 높은 문장 위주" },
    { id: "edit", label: "직접 일부 수정", desc: "핵심 흐름과 초안 위주" },
    { id: "ref", label: "참고용 아이디어", desc: "다양한 표현의 소스 위주" },
];

const BANNED_WORDS = ["열정", "최선", "압도적", "귀사", "노력", "성실", "글로벌"];

export function ToneStep() {
    const { tone, updateTone } = useInterviewStore();

    const toggleBannedWord = (word: string) => {
        const newWords = tone.bannedWords.includes(word)
            ? tone.bannedWords.filter(w => w !== word)
            : [...tone.bannedWords, word];
        updateTone({ bannedWords: newWords });
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Tone Selection */}
            <section className="space-y-4">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">전체적인 톤 선택</label>
                <div className="grid grid-cols-1 gap-3">
                    {TONES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => updateTone({ selectedTone: t.label })}
                            className={cn(
                                "p-5 rounded-2xl border-2 text-left transition-all relative overflow-hidden group",
                                tone.selectedTone === t.label
                                    ? "border-primary bg-blue-50/50"
                                    : "border-gray-100 hover:border-gray-300"
                            )}
                        >
                            {tone.selectedTone === t.label && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}
                            <h4 className={cn("text-base font-bold", tone.selectedTone === t.label ? "text-primary" : "text-gray-900")}>
                                {t.label}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                        </button>
                    ))}
                </div>
            </section>

            {/* Purpose Selection */}
            <section className="space-y-4">
                <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">생성 목적</label>
                <div className="flex flex-wrap gap-2">
                    {PURPOSES.map(p => (
                        <button
                            key={p.id}
                            onClick={() => updateTone({ usagePurpose: p.label })}
                            className={cn(
                                "px-5 py-3 rounded-full text-sm font-bold border-2 transition-all",
                                tone.usagePurpose === p.label
                                    ? "border-primary bg-primary text-white"
                                    : "border-gray-100 text-gray-400 hover:border-gray-300"
                            )}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Banned Words (The "Cliché" Filter) */}
            <section className="space-y-4">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-tight">금지 표현 필터</label>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1 font-medium italic">
                        <Info className="w-3 h-3" /> 선택한 단어는 가급적 사용하지 않습니다.
                    </span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {BANNED_WORDS.map(word => (
                        <button
                            key={word}
                            onClick={() => toggleBannedWord(word)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-sm font-bold border border-gray-100 transition-all shadow-sm",
                                tone.bannedWords.includes(word)
                                    ? "bg-rose-50 text-rose-500 border-rose-200"
                                    : "bg-white text-gray-400 hover:text-gray-600"
                            )}
                        >
                            {word}
                        </button>
                    ))}
                </div>
            </section>

            {/* Subtitle Toggle */}
            <section className="space-y-4">
                <div className="flex justify-between items-center bg-gray-50/50 p-5 rounded-3xl border border-gray-100">
                    <div>
                        <h4 className="text-base font-bold text-gray-900">소제목 포함 여부</h4>
                        <p className="text-xs text-gray-400 mt-0.5">문항마다 핵심을 담은 소제목을 붙여줍니다.</p>
                    </div>
                    <button
                        onClick={() => updateTone({ includeSubtitles: !tone.includeSubtitles })}
                        className={cn(
                            "w-14 h-8 rounded-full transition-all relative p-1",
                            tone.includeSubtitles ? "bg-primary" : "bg-gray-200"
                        )}
                    >
                        <motion.div
                            className="w-6 h-6 bg-white rounded-full shadow-sm"
                            animate={{ x: tone.includeSubtitles ? 24 : 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </button>
                </div>
            </section>

            {/* Final Notice */}
            <div className="bg-gray-50 p-6 rounded-3xl space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    인터뷰 결과를 바탕으로 세상에 하나뿐인 초안을 생성합니다. <br />
                    결제 완료 직후 문항별 초안을 바로 확인하실 수 있으며, 작성 파일은 24시간 동안 보관된 후 폐기됩니다.
                </p>
            </div>

        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { useInterviewStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import {
    Check,
    Copy,
    Download,
    Mail,
    RefreshCcw,
    Sparkles,
    CheckCircle2,
    ChevronRight,
    Loader2,
    AlertCircle
} from "lucide-react";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SuccessPage() {
    const { basicInfo, projects, deepDiveAnswers, tone, strategy, setStrategy, generatedDrafts, updateGeneratedDrafts, updateDraftAtIndex, userProfile, reset } = useInterviewStore();
    const [isGenerating, setIsGenerating] = useState(!generatedDrafts || generatedDrafts.length === 0);
    const [generatingStatus, setGeneratingStatus] = useState<"STRATEGY" | "CONTENT">("STRATEGY");
    const [generatingIndex, setGeneratingIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isGenerating && basicInfo.questions.length > 0) {
            const generateFullFlow = async () => {
                try {
                    setError(null);

                    let currentStrategy = strategy;

                    // Step 1: Strategize (if not already done)
                    if (!currentStrategy || currentStrategy.length === 0) {
                        setGeneratingStatus("STRATEGY");
                        const stratRes = await fetch("/api/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                data: { basicInfo, projects, deepDiveAnswers, tone, userProfile },
                                mode: "STRATEGIZE"
                            }),
                        });
                        const stratResult = await stratRes.json();
                        if (stratResult.strategy) {
                            currentStrategy = stratResult.strategy;
                            setStrategy(currentStrategy);
                        } else {
                            throw new Error("소재 배치 전략 수립에 실패했습니다.");
                        }
                    }

                    // Step 2: Generate Content
                    setGeneratingStatus("CONTENT");
                    if (!generatedDrafts || generatedDrafts.length === 0) {
                        updateGeneratedDrafts(new Array(basicInfo.questions.length).fill(""));
                    }

                    for (let i = 0; i < basicInfo.questions.length; i++) {
                        if (generatedDrafts && generatedDrafts[i]) continue;

                        setGeneratingIndex(i);

                        const response = await fetch("/api/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                data: { basicInfo, projects, deepDiveAnswers, tone, strategy: currentStrategy, userProfile },
                                questionIndex: i,
                                mode: "GENERATE"
                            }),
                        });

                        const result = await response.json();

                        if (result.draft) {
                            updateDraftAtIndex(i, result.draft);
                        } else if (result.error) {
                            throw new Error(`문항 ${i + 1} 생성 실패: ${result.error}`);
                        }
                    }
                } catch (err: any) {
                    console.error("Generation failed:", err);
                    setError(err.message || "생성 도중 오류가 발생했습니다. 다시 시도해주세요.");
                } finally {
                    setIsGenerating(false);
                }
            };

            generateFullFlow();
        }
    }, [isGenerating, basicInfo, projects, deepDiveAnswers, tone, strategy, setStrategy, updateGeneratedDrafts, updateDraftAtIndex, userProfile]);


    const handleRegenerate = () => {
        updateGeneratedDrafts([]);
        setStrategy([]);
        setIsGenerating(true);
    };


    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleHomeClick = (e: React.MouseEvent) => {
        if (confirm("정말로 완료하시겠습니까? 초기화 후 홈으로 이동합니다.")) {
            reset();
        } else {
            e.preventDefault();
        }
    };


    if (isGenerating) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center space-y-8">
                <div className="relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 rounded-full border-4 border-dashed border-blue-200"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-blue-600 animate-pulse" />
                    </div>
                </div>
                <div className="space-y-3 max-w-sm">
                    <h1 className="text-2xl font-black text-gray-900 leading-tight">
                        {generatingStatus === "STRATEGY" ? (
                            <>문항별 최적 소재를<br />배치하고 있습니다</>
                        ) : (
                            <>{generatingIndex + 1}번째 문항을<br />생성하고 있습니다</>
                        )}
                    </h1>
                    <p className="text-gray-500 text-sm font-medium break-keep">
                        {generatingStatus === "STRATEGY" ? (
                            "전체 문항의 흐름을 분석하여 가장 임팩트 있는 경험을 매칭하는 전략 단계입니다."
                        ) : (
                            `전체 ${basicInfo.questions.length}개 문항 중 ${generatingIndex + 1}번째 답변을 작성 중입니다. 최적의 문장 조합을 위해 문항당 약 10~15초가 소요됩니다.`
                        )}
                    </p>
                </div>


                <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-2 h-2 rounded-full bg-blue-600"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-2">
                        <Link href="/" onClick={handleHomeClick}>
                            <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl px-5">
                                처음으로 돌아가기
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
                <section className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-bold uppercase tracking-wider">Drafts Generated Successfully</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900">생성된 초안을 확인해보세요.</h1>
                    <p className="text-gray-500 font-medium break-keep">
                        선택하신 &apos;{tone.selectedTone}&apos; 톤으로 {generatedDrafts?.length}개의 맞춤 답변이 생성되었습니다.<br />
                        이 초안은 참고용이며, 본인의 언어로 조금만 다듬으면 완벽한 자소서가 됩니다!
                    </p>

                    {error && (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> {error}
                            <button onClick={handleRegenerate} className="underline ml-auto">다시 시도</button>
                        </div>
                    )}
                </section>

                <section className="grid gap-8">
                    {generatedDrafts?.map((draft, idx) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={idx}
                            className="group relative bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all overflow-hidden"
                        >
                            <div className="p-8 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md">QUESTION {idx + 1}</span>
                                        <h2 className="text-lg font-bold text-gray-900 mt-2">{basicInfo.questions[idx].content}</h2>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className={cn("rounded-full", copiedIndex === idx && "bg-green-50 border-green-200 text-green-600")}
                                            onClick={() => handleCopy(draft, idx)}
                                        >
                                            {copiedIndex === idx ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                            {copiedIndex === idx ? "복사됨" : "복사하기"}
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 leading-relaxed text-gray-700 whitespace-pre-wrap text-sm font-medium">
                                        {draft}
                                    </div>
                                    <div className="flex justify-end pr-2">
                                        <div className="text-[10px] font-bold text-gray-400">
                                            LENGTH: <span className={cn(
                                                draft.length >= (basicInfo.questions[idx].maxChars * 0.9) ? "text-green-600" : "text-amber-500"
                                            )}>
                                                {draft.length.toLocaleString()}자
                                            </span>
                                            <span className="opacity-50 mx-1">/</span>
                                            {basicInfo.questions[idx].maxChars.toLocaleString()}자
                                        </div>
                                    </div>
                                </div>


                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex gap-4">
                                        <div className="text-[10px] font-bold text-gray-400">
                                            TARGET: <span className="text-gray-700">{basicInfo.company}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-gray-400">
                                            TONE: <span className="text-gray-700">{tone.selectedTone}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRegenerate}
                                        className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                                    >
                                        다른 버전으로 다시 생성 <RefreshCcw className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Sparkles className="w-4 h-4 text-blue-200" />
                            </div>
                        </motion.div>
                    ))}
                </section>


                <section className="bg-blue-600 rounded-[40px] p-10 text-white flex flex-col items-center justify-center text-center gap-6 shadow-2xl shadow-blue-200">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold">초안이 마음에 드시나요?</h3>
                        <p className="text-blue-100 text-sm opacity-80 max-w-md mx-auto">
                            복사한 문항을 바탕으로 나만의 어조를 한 스푼만 얹어보세요. <br className="hidden sm:block" />
                            당신의 합격을 자소서 뚝딱이 진심으로 응원합니다!
                        </p>
                    </div>
                    <Link href="/" onClick={handleHomeClick}>
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 rounded-2xl">
                            완료하고 홈으로 가기
                        </Button>
                    </Link>
                </section>
            </main>

            <footer className="py-12 text-center text-[10px] text-gray-400 space-y-2">
                <p>문의: smilelee9@naver.com</p>
                <p>© 2026 Leesoft. All rights reserved.</p>
            </footer>
        </div>
    );
}

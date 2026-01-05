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
    Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SuccessPage() {
    const { basicInfo, projects, tone, generatedDrafts, updateGeneratedDrafts } = useInterviewStore();
    const [isGenerating, setIsGenerating] = useState(generatedDrafts?.length === 0);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isGenerating) {
            // Mock generation delay
            const timer = setTimeout(() => {
                const mockDrafts = basicInfo.questions.map((q, idx) => {
                    const project = projects[idx % projects.length];
                    return `저는 ${project?.name} 프로젝트 당시 ${project?.type === "실무" ? "실무자" : "팀원"}로서 ${idx % 2 === 0 ? "기술적 완성도" : "사용자 경험"}를 최우선으로 고려했습니다. 특히 ${idx % 3 === 0 ? "부족한 리소스" : "촉박한 마감 기한"}이라는 제약 사항 속에서도 포기하지 않고 성과를 냈습니다. 

이 과정에서 가장 중요하게 배운 것은 ${idx % 2 === 0 ? "데이터에 기반한 의사결정" : "동료와의 원활한 소통"}의 중요성이었습니다. 비록 초기에는 아쉬운 점도 있었지만, 이를 보완하기 위해 직접 발로 뛰며 문제를 해결하려 노력했습니다. 

${basicInfo.company}의 ${basicInfo.role}로서 이러한 저의 ${tone.selectedTone === "Logical" ? "논리적 분석력" : "열정적인 태도"}를 바탕으로 팀의 성장에 기여하고 싶습니다.`;
                });
                updateGeneratedDrafts(mockDrafts);
                setIsGenerating(false);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [isGenerating, basicInfo, projects, tone, updateGeneratedDrafts]);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
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
                        당신만의 특별한 초안을<br />생성하고 있습니다
                    </h1>
                    <p className="text-gray-500 text-sm font-medium break-keep">
                        인터뷰 내용을 바탕으로 AI가 최적의 문장을 조립하고 있습니다. 약 10초 정도 소요될 수 있습니다.
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
                        <Button variant="outline" size="sm" className="hidden sm:flex" onClick={() => window.print()}>
                            <Download className="w-4 h-4 mr-2" /> 정식 PDF 저장
                        </Button>
                        <Link href="/">
                            <Button size="sm" className="bg-gray-900 text-white hover:bg-gray-800">
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
                        선택하신 '{tone.selectedTone}' 톤으로 {generatedDrafts?.length}개의 맞춤 답변이 생성되었습니다.<br />
                        이 초안은 참고용이며, 본인의 언어로 조금만 다듬으면 완벽한 자소서가 됩니다!
                    </p>
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
                                        <h2 className="text-lg font-bold text-gray-900 mt-2">{basicInfo.questions[idx]}</h2>
                                    </div>
                                    <div className="flex gap-2">
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

                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-50 leading-relaxed text-gray-700 whitespace-pre-wrap text-sm font-medium">
                                    {draft}
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
                                    <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
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

                <section className="bg-blue-600 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-2xl font-bold">결과물이 마음에 드시나요?</h3>
                        <p className="text-blue-100 text-sm opacity-80">이메일로 초안 전체를 전송해 드릴까요?</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Button size="lg" className="flex-1 md:flex-none bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 rounded-2xl">
                            <Mail className="w-5 h-5 mr-2" /> 이메일로 받기
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="py-12 text-center text-[10px] text-gray-400">
                <p>© 2026 Leesoft. All rights reserved.</p>
            </footer>
        </div>
    );
}

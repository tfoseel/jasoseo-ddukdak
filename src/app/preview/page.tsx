"use client";

import { useInterviewStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { KakaoPayButton } from "@/components/payment/KakaoPayButton";
import { StripeButton } from "@/components/payment/StripeButton";
import { Logo } from "@/components/ui/Logo";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, CreditCard, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PreviewPage() {
    const { basicInfo, projects, deepDiveAnswers, userProfile, tone, strategy, setStrategy, reset } = useInterviewStore();
    const [isAnalyzing, setIsAnalyzing] = useState(true);
    const router = useRouter();

    // Calculate total character count and pricing
    const totalChars = basicInfo.questions.reduce((sum, q) => sum + (q.maxChars || 0), 0);
    const calculatePrice = () => {
        if (totalChars <= 1500) return { price: 1900, original: 3900 };
        if (totalChars <= 3000) return { price: 2900, original: 5900 };
        if (totalChars <= 5000) return { price: 3900, original: 7900 };
        return { price: 4900, original: 9900 };
    };
    const { price, original } = calculatePrice();

    // Quality Assessment
    const qualityScore = () => {
        let score = 0;
        const maxScore = projects.length * 4; // 4 key fields per project
        deepDiveAnswers.forEach(answer => {
            if (answer.problem?.trim().length > 20) score++;
            if (answer.actionReal?.trim().length > 20) score++;
            if (answer.result?.trim().length > 20) score++;
            if (answer.learning?.trim().length > 10) score++;
        });
        return maxScore > 0 ? score / maxScore : 0;
    };
    const quality = qualityScore();
    const showQualityWarning = quality < 0.6;

    // 결제 전 데이터 백업 및 전략 수립
    useEffect(() => {
        const initializePreview = async () => {
            try {
                // 1. Safety Backup
                await fetch("/api/safety-log", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: basicInfo.email,
                        data: { basicInfo, projects, deepDiveAnswers, userProfile, tone, strategy }
                    })
                });

                // 2. Fetch AI Strategy (Real-time analysis)
                if (!strategy || strategy.length === 0) {
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
                        setStrategy(stratResult.strategy);
                    }
                }
            } catch (err) {
                console.error("Initialization failed", err);
            } finally {
                setIsAnalyzing(false);
            }
        };
        initializePreview();
    }, []);

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/interview">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> 인터뷰 수정하기
                        </Button>
                    </Link>
                    <Logo />
                    <div className="w-20" /> {/* Spacer */}
                </div>
            </header>

            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12 space-y-12">
                <section className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-2">
                        <Sparkles className="w-8 h-8 fill-blue-600/20" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 break-keep">
                        {isAnalyzing ? "인터뷰 내용을 분석 중입니다..." : "인터뷰 분석이 완료되었습니다."}
                    </h1>
                    <p className="text-gray-500 font-medium break-keep">
                        {isAnalyzing
                            ? "Claude AI가 가장 임팩트 있는 경험을 각 문항에 배치하고 있습니다."
                            : `입력해주신 ${projects.length}개의 경험을 토대로 ${basicInfo.questions.length}개 문항(총 ${totalChars.toLocaleString()}자)에 최적화된 초안 생성이 가능합니다.`
                        }
                    </p>
                </section>

                {/* Quality Warning */}
                {!isAnalyzing && showQualityWarning && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3"
                    >
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <span className="text-amber-600 text-lg">⚠️</span>
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-sm font-bold text-amber-900">경험 정보가 부족해요</h4>
                            <p className="text-xs text-amber-700 leading-relaxed break-keep">
                                일부 경험의 상세 내용(문제 상황, 실제 행동, 결과 등)이 충분히 작성되지 않았습니다.<br />
                                <strong>초안 품질이 낮아질 수 있으니</strong>, 인터뷰를 더 구체적으로 작성해 보세요.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Draft Teasers */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">초안 미리보기</h2>
                    <div className="space-y-4">
                        {basicInfo.questions.map((q, idx) => {
                            const targetStrategy = strategy?.find(s => s.questionIndex === idx);
                            const assignedProjects = projects.filter(p => targetStrategy?.projectIds.includes(p.id));

                            return (
                                <div key={idx} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 overflow-hidden relative">
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-blue-500 uppercase">Question {idx + 1}</span>
                                            {isAnalyzing && (
                                                <div className="flex gap-1">
                                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" />
                                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{q.content || "입력된 문항이 없습니다."}</h3>
                                    </div>

                                    {/* Blurred Content */}
                                    <div className="relative group">
                                        <div className="space-y-2 blur-[6px] select-none opacity-40">
                                            <div className="h-4 bg-gray-200 rounded-full w-[95%]" />
                                            <div className="h-4 bg-gray-200 rounded-full w-[80%]" />
                                            <div className="h-4 bg-gray-200 rounded-full w-[40%]" />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100 shadow-xl flex items-center gap-2">
                                                <Lock className="w-3 h-3 text-blue-600" />
                                                <span className="text-xs font-bold text-gray-900">결제 후 즉시 공개</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Sentence Teaser (Now uses real AI Strategy) */}
                                    <div className="pt-4 border-t border-dashed border-gray-100 italic text-xs text-blue-600 font-medium break-keep min-h-[40px]">
                                        {isAnalyzing ? (
                                            <div className="h-4 bg-blue-50 animate-pulse rounded w-3/4" />
                                        ) : (
                                            <>
                                                "이 문항에는 <strong>{assignedProjects.map(p => p.name).join(", ")}</strong> 경험의 {targetStrategy?.reasoning || "내용이 적절히 배치될 예정입니다."}"
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Pricing Card */}
                <div className="p-8 rounded-[40px] bg-gray-900 text-white shadow-2xl space-y-8 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-50" />
                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/30">Pricing Plans</span>

                            <div className="grid grid-cols-1 gap-2 max-w-sm mx-auto">
                                {[
                                    { range: "1,500자 이하", price: 1900 },
                                    { range: "1,501자 ~ 3,000자", price: 2900 },
                                    { range: "3,001자 ~ 5,000자", price: 3900 },
                                    { range: "5,001자 이상", price: 4900 },
                                ].map((tier, i) => {
                                    const isCurrent = (totalChars <= 1500 && i === 0) ||
                                        (totalChars > 1500 && totalChars <= 3000 && i === 1) ||
                                        (totalChars > 3000 && totalChars <= 5000 && i === 2) ||
                                        (totalChars > 5000 && i === 3);

                                    return (
                                        <div key={i} className={`flex justify-between items-center px-4 py-2 rounded-xl text-xs border ${isCurrent ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}>
                                            <span>{tier.range}</span>
                                            <span className="font-bold">{tier.price.toLocaleString()}원</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-col items-center gap-1 pt-4">
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-5xl font-black text-white">{price.toLocaleString()}원</h3>
                                    <span className="text-gray-500 line-through text-lg">{original.toLocaleString()}원</span>
                                </div>
                                <p className="text-blue-400 text-sm font-bold">현재 고객님은 '{totalChars.toLocaleString()}자' 플랜이 적용되었습니다.</p>
                            </div>
                        </div>

                        <div className="grid gap-3">
                            <div className="flex flex-col gap-3">
                                <KakaoPayButton
                                    itemName="자기소개서 초안 생성"
                                    amount={price}
                                    userId={basicInfo.email}
                                    onError={(msg: string) => alert(msg)}
                                />
                                {/* <StripeButton price={price} /> */}
                            </div>
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                    if (confirm("정말로 종료하시겠습니까? 작성하신 모든 데이터가 안전하게 삭제됩니다.")) {
                                        reset();
                                        router.push("/");
                                    }
                                }}
                                className="w-full h-14 rounded-2xl border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white font-bold text-sm"
                            >
                                결제하지 않고 종료하기
                            </Button>
                            <p className="text-[10px] text-gray-500 font-medium">
                                * 종료 시 현재까지 입력된 모든 인터뷰 데이터는 보안을 위해 즉시 파기됩니다.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

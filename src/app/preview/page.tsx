"use client";

import { useInterviewStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft, CreditCard, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PreviewPage() {
    const { basicInfo, projects } = useInterviewStore();

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
                        인터뷰 데이터를 기반으로<br />
                        고품질 초안 생성이 가능합니다.
                    </h1>
                    <p className="text-gray-500 font-medium">
                        입력해주신 {projects.length}개의 경험을 바탕으로 {basicInfo.questions.length}개 문항에 최적화된 답변을 작성합니다.
                    </p>
                </section>

                {/* Draft Teasers */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">초안 미리보기</h2>
                    <div className="space-y-4">
                        {basicInfo.questions.map((q, idx) => (
                            <div key={idx} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-4 overflow-hidden relative">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-blue-500 uppercase">Question {idx + 1}</span>
                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{q || "입력된 문항이 없습니다."}</h3>
                                </div>

                                {/* Blurred Content */}
                                <div className="relative group">
                                    <div className="space-y-2 blur-[6px] select-none opacity-40">
                                        <div className="h-4 bg-gray-200 rounded-full w-[95%]" />
                                        <div className="h-4 bg-gray-200 rounded-full w-[80%]" />
                                        <div className="h-4 bg-gray-200 rounded-full w-[90%]" />
                                        <div className="h-4 bg-gray-100 rounded-full w-[40%]" />
                                    </div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-gray-100 shadow-xl flex items-center gap-2">
                                            <Lock className="w-3 h-3 text-blue-600" />
                                            <span className="text-xs font-bold text-gray-900">결제 후 즉시 공개</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Key Sentence Teaser (Rule based mock) */}
                                <div className="pt-4 border-t border-dashed border-gray-100 italic text-xs text-blue-600 font-medium break-keep">
                                    "이 답변에서는 {projects[idx % projects.length]?.name || "경험"}에서 겪은 {idx % 2 === 0 ? "기술적 해결 능력" : "위기 대처 방식"}을 중심으로 성과를 강조할 예정입니다."
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Pricing Card */}
                <div className="p-8 rounded-[40px] bg-gray-900 text-white shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-50" />
                    <div className="relative z-10 space-y-6">
                        <div className="space-y-2">
                            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Special Price</span>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black">3,900원</h3>
                                <span className="text-gray-400 line-through text-sm">9,900원</span>
                            </div>
                            <p className="text-sm text-gray-300 break-keep">
                                커피 한 잔 가격으로 10시간의 자소서 고민을 끝내세요. <br />
                                <strong>사람 냄새 나는 솔직한 초안</strong>이 여러분을 기다립니다.
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-300">
                                <CheckCircle className="w-4 h-4 text-blue-500" /> 문항별 맞춤형 초안 3~5개 생성
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-300">
                                <CheckCircle className="w-4 h-4 text-blue-500" /> 1회 결제 시 24시간 무제한 확인
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-300">
                                <CheckCircle className="w-4 h-4 text-blue-500" /> 이메일/텍스트 다운로드 제공
                            </div>
                        </div>

                        <Link href="/success">
                            <Button size="lg" className="w-full h-16 rounded-2xl bg-blue-600 hover:bg-blue-500 text-lg font-bold shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all">
                                <CreditCard className="w-5 h-5 mr-2" /> 지금 바로 초안 받기
                            </Button>
                        </Link>
                        <p className="text-center text-[10px] text-gray-500">
                            * 현재는 UX 테스트 중으로 클릭 시 바로 성공 페이지로 이동합니다.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="py-12 text-center text-[10px] text-gray-400 border-t border-gray-50">
                <p>© 2026 Leesoft. All rights reserved.</p>
            </footer>
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

"use client";

import { useInterviewStore } from "@/lib/store";
import { INTERVIEW_STEPS } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { BasicInfoStep } from "@/components/interview/BasicInfoStep";
import { ProjectSelectionStep } from "@/components/interview/ProjectSelectionStep";
import { DeepDiveStep } from "@/components/interview/DeepDiveStep";
import { ToneStep } from "@/components/interview/ToneStep";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPage() {
    const { currentStepIndex, prevStep, nextStep } = useInterviewStore();
    const currentStep = INTERVIEW_STEPS[currentStepIndex];

    const renderStep = () => {
        switch (currentStep.id) {
            case "basic":
                return <BasicInfoStep />;
            case "projects":
                return <ProjectSelectionStep />;
            case "deep_dive":
                return <DeepDiveStep />;
            case "tone":
                return <ToneStep />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <header className="border-b border-gray-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <div className="text-sm font-medium text-gray-400">
                        {currentStepIndex + 1} / {INTERVIEW_STEPS.length}
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1 bg-gray-100">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStepIndex + 1) / INTERVIEW_STEPS.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="mb-8">
                            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 block">
                                {currentStep.title}
                            </span>
                            <h2 className="text-2xl font-bold text-gray-900 break-keep">
                                {getStepTitle(currentStep.id)}
                            </h2>
                        </div>

                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer Controls */}
            <footer className="border-t border-gray-100 bg-white p-6 sticky bottom-0">
                <div className="max-w-2xl mx-auto flex justify-between gap-4">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStepIndex === 0}
                        className="text-gray-500"
                    >
                        <ArrowLeft className="mr-2 w-4 h-4" /> 이전으로
                    </Button>

                    {currentStepIndex < INTERVIEW_STEPS.length - 1 ? (
                        <Button onClick={nextStep} className="px-8 rounded-full">
                            다음 단계로 <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={async () => {
                                try {
                                    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
                                    if (!publishableKey) {
                                        alert("Stripe Publishable Key가 설정되지 않았습니다. .env.local을 확인해주세요.");
                                        return;
                                    }

                                    const res = await fetch("/api/checkout", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ items: [] }),
                                    });
                                    const data = await res.json();

                                    if (data.error) {
                                        alert(data.error);
                                        return;
                                    }

                                    const stripe = (window as any).Stripe(publishableKey);
                                    await stripe.redirectToCheckout({ sessionId: data.sessionId });
                                } catch (err) {
                                    console.error("Checkout failed:", err);
                                    alert("결제 페이지로 이동하는 중 오류가 발생했습니다.");
                                }
                            }}
                            className="px-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        >
                            인터뷰 완료 및 초안 결제하기
                        </Button>

                    )}

                </div>
            </footer>
        </div>
    );
}

function getStepTitle(stepId: string) {
    switch (stepId) {
        case "basic": return "지원하시는 기업과 문항을 알려주세요.";
        case "projects": return "자소서에 쓸 경험(프로젝트)을 나열해 볼까요?";
        case "deep_dive": return "각 경험을 구체적으로 회고해 봅시다.";
        case "tone": return "어떤 느낌의 글을 원하시나요?";
        default: return "";
    }
}

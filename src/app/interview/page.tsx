"use client";

import { useInterviewStore } from "@/lib/store";
import { INTERVIEW_STEPS } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";

import Link from "next/link";
import { BasicInfoStep } from "@/components/interview/BasicInfoStep";
import { ProjectSelectionStep } from "@/components/interview/ProjectSelectionStep";
import { DeepDiveStep } from "@/components/interview/DeepDiveStep";
import { ToneStep } from "@/components/interview/ToneStep";
import { ValueStep } from "@/components/interview/ValueStep";
import { motion, AnimatePresence } from "framer-motion";

export default function InterviewPage() {
    const {
        currentStepIndex,
        prevStep,
        nextStep,
        basicInfo,
        userProfile,
        projects,
        deepDiveAnswers,
        tone
    } = useInterviewStore();
    const currentStep = INTERVIEW_STEPS[currentStepIndex];

    const validateStep = () => {
        switch (currentStep.id) {
            case "basic":
                return (
                    basicInfo.company.trim() !== "" &&
                    basicInfo.role.trim() !== "" &&
                    basicInfo.questions.length > 0 &&
                    basicInfo.questions.every(q => q.content.trim() !== "")
                );
            case "value":
                return (
                    userProfile.strengths.length > 0 &&
                    userProfile.weakness.trim() !== "" &&
                    userProfile.vision.trim() !== "" &&
                    userProfile.coreValue.trim() !== ""
                );
            case "projects":
                return projects.length > 0;
            case "deep_dive":
                // At least ONE project must have problem + result filled
                if (projects.length === 0) return false;
                return projects.some(proj => {
                    const answer = deepDiveAnswers.find(a => a.projectId === proj.id);
                    if (!answer) return false;
                    return (
                        answer.problem.trim() !== "" &&
                        answer.result.trim() !== ""
                    );
                });
            case "tone":
                return tone.selectedTone !== "";
            default:
                return true;
        }
    };

    const isStepValid = validateStep();

    // Get hint for missing fields
    const getMissingFieldsHint = (): string | null => {
        if (isStepValid) return null;
        switch (currentStep.id) {
            case "basic":
                const missing = [];
                if (!basicInfo.company.trim()) missing.push("지원 회사명");
                if (!basicInfo.role.trim()) missing.push("지원 직무");
                if (basicInfo.questions.length === 0 || basicInfo.questions.some(q => !q.content.trim())) missing.push("자소서 문항");
                return `다음 항목을 입력해 주세요: ${missing.join(", ")}`;
            case "value":
                const valueMissing = [];
                if (userProfile.strengths.length === 0) valueMissing.push("성향 키워드");
                if (!userProfile.weakness.trim()) valueMissing.push("약점 및 보완점");
                if (!userProfile.vision.trim()) valueMissing.push("장기적 비전");
                if (!userProfile.coreValue?.trim()) valueMissing.push("핵심 가치");
                return `다음 항목을 입력해 주세요: ${valueMissing.join(", ")}`;
            case "projects":
                return "최소 1개 이상의 경험을 등록해 주세요.";
            case "deep_dive":
                return "최소 1개 경험에 '문제 상황'과 '결과'를 입력해 주세요.";
            case "tone":
                return "톤을 선택해 주세요.";
            default:
                return null;
        }
    };

    const validationHint = getMissingFieldsHint();

    const renderStep = () => {
        switch (currentStep.id) {
            case "basic":
                return <BasicInfoStep />;
            case "value":
                return <ValueStep />;
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
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                if (confirm("정말 모든 데이터를 초기화하시겠습니까? 작성 중인 내용이 모두 삭제됩니다.")) {
                                    useInterviewStore.getState().reset();
                                    window.location.href = "/";
                                }
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            전체 초기화
                        </button>
                        <div className="text-sm font-medium text-gray-400">
                            {currentStepIndex + 1} / {INTERVIEW_STEPS.length}
                        </div>
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
                            {validationHint && (
                                <p className="text-xs text-amber-600 font-medium mt-2 flex items-center gap-1">
                                    <span>⚠️</span> {validationHint}
                                </p>
                            )}
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
                        <Button
                            onClick={nextStep}
                            disabled={!isStepValid}
                            className="px-8 rounded-full"
                        >
                            다음 단계로 <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    ) : (
                        <Link href={isStepValid ? "/preview" : "#"} onClick={(e) => !isStepValid && e.preventDefault()}>
                            <Button
                                disabled={!isStepValid}
                                className="px-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none"
                            >
                                인터뷰 분석 및 미리보기 <ChevronRight className="ml-2 w-4 h-4" />
                            </Button>
                        </Link>
                    )}

                </div>
            </footer>
        </div>
    );
}

function getStepTitle(stepId: string) {
    switch (stepId) {
        case "basic": return "지원하시는 기업과 문항을 알려주세요.";
        case "value": return "어떤 가치관을 가진 분인지 궁금해요.";
        case "projects": return "자소서에 쓸 경험(프로젝트)을 나열해 볼까요?";
        case "deep_dive": return "각 경험을 구체적으로 회고해 봅시다.";
        case "tone": return "어떤 느낌의 글을 원하시나요?";
        default: return "";
    }
}

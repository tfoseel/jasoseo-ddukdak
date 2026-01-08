"use client";

import { useInterviewStore } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";

export function BasicInfoStep() {
    const { basicInfo, updateBasicInfo } = useInterviewStore();

    const handleQuestionChange = (index: number, content: string) => {
        const newQuestions = [...basicInfo.questions];
        newQuestions[index] = { ...newQuestions[index], content };
        updateBasicInfo({ questions: newQuestions });
    };

    const handleMaxCharsChange = (index: number, maxChars: number) => {
        const newQuestions = [...basicInfo.questions];
        newQuestions[index] = { ...newQuestions[index], maxChars };
        updateBasicInfo({ questions: newQuestions });
    };

    const addQuestion = () => {
        updateBasicInfo({ questions: [...basicInfo.questions, { content: "", maxChars: 1000 }] });
    };

    const removeQuestion = (index: number) => {
        if (basicInfo.questions.length <= 1) return;
        const newQuestions = basicInfo.questions.filter((_, i) => i !== index);
        updateBasicInfo({ questions: newQuestions });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">지원 회사명</label>
                    <input
                        type="text"
                        value={basicInfo.company}
                        onChange={(e) => updateBasicInfo({ company: e.target.value })}
                        placeholder="예: 삼성전자"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">지원 부서 (선택)</label>
                    <input
                        type="text"
                        value={basicInfo.department}
                        onChange={(e) => updateBasicInfo({ department: e.target.value })}
                        placeholder="예: 클라우드 사업부"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">소속 팀 (선택)</label>
                    <input
                        type="text"
                        value={basicInfo.team}
                        onChange={(e) => updateBasicInfo({ team: e.target.value })}
                        placeholder="예: 플랫폼 서비스팀"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
                <div className="space-y-2 lg:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">지원 직무 / 직책</label>
                    <input
                        type="text"
                        value={basicInfo.role}
                        onChange={(e) => updateBasicInfo({ role: e.target.value })}
                        placeholder="예: 프론트엔드 개발자"
                        className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {[
                        { label: "지원 동기", q: "회사를 지원하게 된 동기와 입사 후 포부에 대해 기술해 주십시오." },
                        { label: "성장 과정", q: "본인의 성장 과정과 가치관에 가장 큰 영향을 미친 사건에 대해 기술해 주십시오." },
                        { label: "장단점", q: "자신의 장점과 단점을 사례를 들어 설명하고, 단점을 보완하기 위한 노력을 기술해 주십시오." },
                        { label: "성장 계획", q: "입사 후 5년, 10년 뒤의 커리어 로드맵과 성장 계획에 대해 기술해 주십시오." },
                        { label: "인상깊은 경험", q: "살면서 가장 도전적이었거나 인상 깊었던 경험과 그를 통해 얻은 교훈을 기술해 주십시오." },
                        { label: "의사소통", q: "조직 내에서 갈등을 해결하거나 효과적으로 의사소통을 했던 경험을 기술해 주십시오." },
                    ].map((sample, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => {
                                // Find first empty question or add new one
                                const emptyIndex = basicInfo.questions.findIndex(q => q.content.trim() === "");
                                if (emptyIndex !== -1) {
                                    handleQuestionChange(emptyIndex, sample.q);
                                } else if (basicInfo.questions.length < 5) {
                                    updateBasicInfo({ questions: [...basicInfo.questions, { content: sample.q, maxChars: 1000 }] });
                                } else {
                                    alert("최대 5개 문항까지 입력 가능합니다.");
                                }
                            }}
                            className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                        >
                            + {sample.label}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center pt-2">
                    <label className="text-sm font-semibold text-gray-700">자소서 문항 (최대 5개)</label>
                    <span className="text-xs text-gray-400">{basicInfo.questions.length} / 5</span>
                </div>

                <div className="space-y-3">
                    {basicInfo.questions.map((q, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="flex-1 relative">
                                <span className="absolute left-4 top-4 text-xs font-bold text-gray-300">Q{index + 1}</span>
                                <textarea
                                    value={q.content}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                    placeholder="자기소개서 문항을 그대로 붙여넣어 주세요."
                                    className="w-full min-h-[100px] pt-10 pb-4 px-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm resize-none"
                                />
                                <div className="absolute right-4 top-3 flex items-center gap-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">글자 수 제한</label>
                                    <input
                                        type="number"
                                        step="100"
                                        min="0"
                                        max="3000"
                                        value={q.maxChars.toString()}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            const clamped = Math.min(3000, Math.max(0, isNaN(val) ? 0 : val));
                                            handleMaxCharsChange(index, clamped);
                                        }}
                                        className="w-16 h-7 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-center focus:border-primary outline-none"
                                        placeholder="1000"
                                    />
                                </div>
                            </div>
                            {basicInfo.questions.length > 1 && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeQuestion(index)}
                                    className="mt-2 text-gray-300 hover:text-rose-500"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>

                {basicInfo.questions.length < 5 && (
                    <Button
                        variant="outline"
                        onClick={addQuestion}
                        className="w-full border-dashed border-2 py-8 rounded-2xl text-gray-400 hover:text-primary hover:border-primary transition-all"
                    >
                        <Plus className="w-4 h-4 mr-2" /> 문항 추가하기
                    </Button>
                )}
            </div>
        </div>
    );
}

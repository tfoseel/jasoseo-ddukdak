import { useInterviewStore } from "@/lib/store";
import { ProjectType, COMPETENCIES } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { Plus, X, GraduationCap, Briefcase, User, Users, Trophy, AlertCircle, CheckCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const PROJECT_TYPES: { label: ProjectType; icon: any }[] = [
    { label: "실무", icon: Briefcase },
    { label: "연구/과제", icon: GraduationCap },
    { label: "개인프로젝트", icon: User },
    { label: "대외활동/동아리", icon: Users },
    { label: "대회/공모전", icon: Trophy },
];

export function ProjectSelectionStep() {
    const { basicInfo, projects, setProjects } = useInterviewStore();
    const minProjects = basicInfo.questions.length + 1;

    const addProject = () => {
        setProjects([
            ...projects,
            { id: Math.random().toString(36).substr(2, 9), name: "", type: "실무" as ProjectType, appealPoints: [] }
        ]);
    };

    const updateProject = (id: string, updates: any) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const toggleAppealPoint = (projectId: string, point: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        const currentPoints = project.appealPoints || [];
        const newPoints = currentPoints.includes(point)
            ? currentPoints.filter(p => p !== point)
            : [...currentPoints, point];

        updateProject(projectId, { appealPoints: newPoints });
    };

    const removeProject = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    // Competency Analysis
    const allSelectedPoints = projects.flatMap(p => p.appealPoints || []);
    const missingCore = COMPETENCIES.slice(0, 3).filter(c => !allSelectedPoints.includes(c.label));

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Unified Status & Guidance Zone */}
            <div className="space-y-3">
                {/* 1. Competency Balance */}
                {projects.length >= 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "p-5 rounded-[24px] border flex items-start gap-4 transition-all shadow-sm",
                            missingCore.length > 0 ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"
                        )}
                    >
                        {missingCore.length > 0 ? (
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                            <h4 className={cn("text-sm font-black", missingCore.length > 0 ? "text-amber-900" : "text-green-900")}>
                                {missingCore.length > 0 ? "나의 경험 역량 리포트" : "완벽한 경험 밸런스입니다!"}
                            </h4>
                            <p className={cn("text-xs leading-relaxed break-keep font-medium", missingCore.length > 0 ? "text-amber-700" : "text-green-700")}>
                                {missingCore.length > 0 ? (
                                    <>현재 초안에 <strong>{missingCore.map(c => c.label).join(", ")}</strong> 포인트가 부족해요. 어필 포인트를 추가해 보세요!</>
                                ) : (
                                    "모든 주요 역량이 골고루 포함되었습니다."
                                )}
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* 2. Project Count Guidance */}
                <div className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all",
                    projects.length < minProjects ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"
                )}>
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black",
                            projects.length < minProjects ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        )}>
                            {projects.length}/{minProjects}
                        </div>
                        <p className={cn(
                            "text-xs font-bold break-keep",
                            projects.length < minProjects ? "text-red-700" : "text-blue-700"
                        )}>
                            {projects.length < minProjects
                                ? `최소 ${minProjects}개의 경험이 필요합니다. (문항수+1)`
                                : "충분한 경험이 등록되었습니다!"}
                        </p>
                    </div>
                    {projects.length < minProjects && (
                        <span className="text-[10px] font-black bg-white/50 px-2 py-1 rounded-lg text-red-500 animate-pulse">필수</span>
                    )}
                </div>
            </div>


            <div className="space-y-4">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-5 relative group"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProject(project.id)}
                            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 text-gray-400 font-bold" />
                        </Button>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">어떤 성격의 경험인가요?</label>
                                <div className="flex flex-wrap gap-2">
                                    {PROJECT_TYPES.map(({ label, icon: Icon }) => (
                                        <button
                                            key={label}
                                            onClick={() => updateProject(project.id, { type: label })}
                                            className={cn(
                                                "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all",
                                                project.type === label
                                                    ? "bg-gray-900 border-gray-900 text-white shadow-lg shadow-gray-200"
                                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300"
                                            )}
                                        >
                                            <Icon className="w-3.5 h-3.5" />
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">경험명</label>
                                <input
                                    type="text"
                                    value={project.name}
                                    onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                    placeholder="예: 00커머스 앱 리뉴얼 인턴"
                                    className="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-bold"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">핵심 어필 포인트 (중복 선택 가능)</label>
                                <div className="flex flex-wrap gap-1.5">
                                    {COMPETENCIES.map(c => (
                                        <button
                                            key={c.id}
                                            onClick={() => toggleAppealPoint(project.id, c.label)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all",
                                                project.appealPoints?.includes(c.label)
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/10"
                                                    : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                                            )}
                                        >
                                            {c.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}


                <Button
                    variant="outline"
                    onClick={addProject}
                    className="w-full border-dashed border-2 py-10 rounded-3xl text-gray-400 hover:text-primary hover:border-primary transition-all flex flex-col gap-2 group"
                >
                    <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-black">새로운 경험 추가하기</span>
                </Button>
            </div>
        </div>
    );
}



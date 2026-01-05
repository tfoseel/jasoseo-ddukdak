"use client";

import { useInterviewStore } from "@/lib/store";
import { ProjectType } from "@/lib/schema";
import { Button } from "@/components/ui/Button";
import { Plus, X, GraduationCap, Briefcase, User, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

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
            { id: Math.random().toString(36).substr(2, 9), name: "", type: "개인프로젝트" }
        ]);
    };

    const updateProject = (id: string, updates: any) => {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    };

    const removeProject = (id: string) => {
        setProjects(projects.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-6">
                <p className="text-sm text-blue-700 leading-relaxed break-keep font-medium">
                    💡 입력하신 자소서 문항이 {basicInfo.questions.length}개입니다. <br className="hidden sm:block" />
                    최소 <strong>{minProjects}개</strong>의 경험을 등록하시면 문항별로 겹치지 않는 초안 생성이 가능합니다.
                </p>
            </div>

            <div className="space-y-4">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all space-y-4 relative group"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeProject(project.id)}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-4 h-4 text-gray-400 font-bold" />
                        </Button>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">분류</label>
                            <div className="flex flex-wrap gap-2">
                                {PROJECT_TYPES.map(({ label, icon: Icon }) => (
                                    <button
                                        key={label}
                                        onClick={() => updateProject(project.id, { type: label })}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                                            project.type === label
                                                ? "bg-primary border-primary text-white shadow-md shadow-blue-500/20"
                                                : "bg-white border-gray-200 text-gray-500 hover:border-blue-200"
                                        )}
                                    >
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">프로젝트/경험명</label>
                            <input
                                type="text"
                                value={project.name}
                                onChange={(e) => updateProject(project.id, { name: e.target.value })}
                                placeholder="예: 00커머스 앱 리뉴얼, 00기업 인턴 수행..."
                                className="w-full h-11 px-4 rounded-xl border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium"
                            />
                        </div>
                    </div>
                ))}

                <Button
                    variant="outline"
                    onClick={addProject}
                    className="w-full border-dashed border-2 py-10 rounded-3xl text-gray-400 hover:text-primary hover:border-primary transition-all flex flex-col gap-2"
                >
                    <div className="p-2 rounded-full bg-gray-50 group-hover:bg-blue-50">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold">경험 추가하기</span>
                </Button>
            </div>

            {projects.length < minProjects && (
                <p className="text-center text-xs text-amber-600 font-medium">
                    * 문항 수보다 많은 경험을 등록하는 것을 권장합니다. (현재 {projects.length}개)
                </p>
            )}
        </div>
    );
}

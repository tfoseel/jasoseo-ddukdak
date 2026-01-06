import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InterviewData, ProjectEntry, DeepDiveAnswer, UserProfile } from './schema';

interface InterviewState extends InterviewData {
    currentStepIndex: number;

    // Actions
    setStep: (index: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    updateBasicInfo: (info: Partial<InterviewData['basicInfo']>) => void;
    updateUserProfile: (profile: Partial<UserProfile>) => void;
    setProjects: (projects: ProjectEntry[]) => void;
    updateDeepDiveAnswer: (answer: DeepDiveAnswer) => void;
    updateTone: (tone: Partial<InterviewData['tone']>) => void;
    updateGeneratedDrafts: (drafts: string[]) => void;
    updateDraftAtIndex: (index: number, draft: string) => void;
    setStrategy: (strategy: InterviewData['strategy']) => void;

    reset: () => void;
}


const initialState: InterviewData = {
    basicInfo: {
        company: "",
        department: "",
        team: "",
        role: "",
        email: "",
        questions: [
            {
                content: "",
                maxChars: 1000,
            },
        ],
    },
    userProfile: {
        strengths: [],
        weakness: "",
        vision: "",
        coreValue: "",
    },
    projects: [],
    deepDiveAnswers: [],
    tone: {
        selectedTone: "논리적/분석적",
        usagePurpose: "직접 일부 수정",
        bannedWords: [],
        includeSubtitles: true,
    },
    generatedDrafts: [],
};


export const useInterviewStore = create<InterviewState>()(
    persist(
        (set) => ({
            ...initialState,
            currentStepIndex: 0,

            setStep: (index) => set({ currentStepIndex: index }),
            nextStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex + 1 })),
            prevStep: () => set((state) => ({ currentStepIndex: state.currentStepIndex - 1 })),

            updateBasicInfo: (info) =>
                set((state) => ({
                    basicInfo: { ...state.basicInfo, ...info },
                })),

            updateUserProfile: (profile) =>
                set((state) => ({
                    userProfile: { ...state.userProfile, ...profile },
                })),

            setProjects: (projects) => set({ projects }),

            updateDeepDiveAnswer: (answer) =>
                set((state) => {
                    const index = state.deepDiveAnswers.findIndex((a) => a.projectId === answer.projectId);
                    const newAnswers = [...state.deepDiveAnswers];
                    if (index >= 0) {
                        newAnswers[index] = answer;
                    } else {
                        newAnswers.push(answer);
                    }
                    return { deepDiveAnswers: newAnswers };
                }),

            updateTone: (tone) =>
                set((state) => ({
                    tone: { ...state.tone, ...tone },
                })),

            updateGeneratedDrafts: (drafts) => set({ generatedDrafts: drafts }),

            updateDraftAtIndex: (index, draft) =>
                set((state) => {
                    const newDrafts = [...(state.generatedDrafts || [])];
                    newDrafts[index] = draft;
                    return { generatedDrafts: newDrafts };
                }),

            setStrategy: (strategy) => set({ strategy }),

            reset: () => set({ ...initialState, currentStepIndex: 0 }),
        }),
        {
            name: 'jasoseo-ddukdak-storage-v4',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

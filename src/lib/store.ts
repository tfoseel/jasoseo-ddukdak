import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { InterviewData, ProjectEntry, DeepDiveAnswer } from './schema';

interface InterviewState extends InterviewData {
    currentStepIndex: number;

    // Actions
    setStep: (index: number) => void;
    nextStep: () => void;
    prevStep: () => void;

    updateBasicInfo: (info: Partial<InterviewData['basicInfo']>) => void;
    setProjects: (projects: ProjectEntry[]) => void;
    updateDeepDiveAnswer: (answer: DeepDiveAnswer) => void;
    updateTone: (tone: Partial<InterviewData['tone']>) => void;
    updateGeneratedDrafts: (drafts: string[]) => void; // Added this action

    reset: () => void;
}

const initialState: InterviewData = {
    basicInfo: {
        company: '',
        department: '',
        team: '',
        role: '',
        email: '',
        questions: [''],
    },
    projects: [],
    deepDiveAnswers: [],
    tone: {
        selectedTone: 'Confident & Professional',
        usagePurpose: 'Edit slightly',
        bannedWords: [],
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

            reset: () => set({ ...initialState, currentStepIndex: 0 }),
        }),
        {
            name: 'jasoseo-ddukdak-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

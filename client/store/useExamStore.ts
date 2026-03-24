import { create } from "zustand";

export type Exam = {
  id: string;
  title: string;
  duration: number;
  createdBy: string;
  examCode: string;
  createdAt: string;
};

type ExamState = {
  exams: Exam[];
  addExam: (exam: Exam) => void;
  setExams: (exams: Exam[]) => void;
};

export const useExamStore = create<ExamState>((set) => ({
  exams: [],
  addExam: (exam) => set((state) => ({ exams: [exam, ...state.exams] })),
  setExams: (exams) => set({ exams }),
}));

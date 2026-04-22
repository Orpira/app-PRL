// @ts-ignore
import { create, StateCreator } from "zustand";
import type { Question } from "../types";

interface ExamState {
	questions: Question[];
	answers: number[];
	index: number;
	start: (qs: Question[]) => void;
	answer: (i: number) => void;
	next: () => void;
	finish: () => any;
}

const useExamStore = create<ExamState>((set, get) => ({
  questions: [],
  answers: [],
  index: 0,

  start: (qs: Question[]) =>
    set({
      questions: qs,
      answers: new Array(qs.length).fill(null),
      index: 0,
    }),

  answer: (i: number) => {
    const { answers, index } = get();
    const newA = [...answers];
    newA[index] = i;
    set({ answers: newA });
  },

  next: () => {
    const { index } = get();
    set({ index: index + 1 });
  },

  finish: () => {
    const { questions, answers } = get();

    let ok = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.r) ok++;
    });

    const pct = Math.round((ok / questions.length) * 100);

    return {
      ok,
      total: questions.length,
      pct,
      passed: pct >= 60,
    };
  },
}));

export default useExamStore;

export interface Question {
	id: number;
	cat: string;
	q: string;
	ops: string[];
	r: number;
}

export interface ExamResult {
	ok: number;
	tot: number;
	pct: number;
	p: boolean;
	date: string;
}

declare global {
  interface Window {
    practiceQsGlobal?: any;
    setPracticeQsGlobal?: any;
  }
}
export {};
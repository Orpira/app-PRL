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

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface Source {
  id: string;
  name: string;
  type: 'pdf' | 'json';
  categories: string[];
  uploaded_by: string;
  created_at: string;
  file_url?: string;
  text?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

declare global {
  interface Window {
    practiceQsGlobal?: any;
    setPracticeQsGlobal?: any;
    setStudyCatGlobal?: any;
  }
}

export {};

declare global {
  interface Window {
    practiceQsGlobal?: any;
    setPracticeQsGlobal?: any;
  }
}
export {};
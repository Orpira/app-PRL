export interface Question {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

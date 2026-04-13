/** Coding problem payload from API / Claude */
export type Problem = {
  title: string;
  description: string;
  difficulty: string;
  hints?: string[];
  steps?: SolutionStep[];
  ideSetup?: string[];
  thinkingProcess?: string[];
  commonMistakes?: string[];
  complexity?: { time?: string; space?: string };
  fullSolution?: string;
  platformNotes?: string;
  seniorTip?: string;
  constraints?: string[];
  realWorldContext?: string;
};

export type SolutionStep = {
  step: number;
  title: string;
  explanation: string;
  code: string;
};

export type Platform = {
  id: string;
  name: string;
  color: string;
  icon: string;
  tagline?: string;
  timeLimit?: number;
  focus: string;
  categories: string[];
};

export type Language = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type ScreeningCategory = {
  id: string;
  name: string;
  color: string;
  icon: string;
  topics: string[];
};

export type ScreeningTypeOption = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export type ScreeningQuestion = {
  title: string;
  type?: string;
  difficulty?: string;
  category?: string;
  question: string;
  context?: string;
  codeSnippet?: string;
  answer: {
    summary: string;
    detailed: string;
    codeExample?: string;
    realWorldScenario?: string;
  };
  whatInterviewersWant?: string;
  commonWrongAnswers?: string[];
  followUpQuestions?: string[];
  seniorTip?: string;
  hints?: string[];
};

export type MockSessionConfig = {
  platform: Platform;
  language: Language;
  difficulty: string;
  count: number;
  timeLimitMinutes: number;
};

export type ProblemListRow = {
  id: number;
  platform: string;
  language: string;
  category: string;
  difficulty: string;
  title: string | null;
  created_at: string;
};

export type ProblemDetailResponse = ProblemListRow & {
  response_json: Problem;
};

export type ScreeningListRow = {
  id: number;
  category: string;
  topic: string;
  type: string;
  difficulty: string;
  title: string | null;
  created_at: string;
  response_json?: ScreeningQuestion;
};

export type ScreeningDetailResponse = Omit<ScreeningListRow, "response_json"> & {
  response_json: ScreeningQuestion;
};

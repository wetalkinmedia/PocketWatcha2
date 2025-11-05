export interface MediaAsset {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  thumbnail?: string;
  title: string;
  description?: string;
  duration?: number; // for video/audio in seconds
  size: number; // in bytes
  mimeType: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface VideoChapter {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime: number;
  description?: string;
  thumbnail?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'hotspot';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string | string[] | number[];
  explanation?: string;
  points: number;
  media?: MediaAsset;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number; // percentage
  allowRetakes: boolean;
  showCorrectAnswers: boolean;
}

export interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  content: string;
  type: 'info' | 'question' | 'link' | 'media';
  media?: MediaAsset;
  link?: string;
}

export interface InteractiveImage {
  id: string;
  imageUrl: string;
  hotspots: Hotspot[];
  title: string;
  description?: string;
}

export interface DragDropItem {
  id: string;
  content: string;
  type: 'draggable' | 'dropzone';
  correctMatches?: string[]; // IDs of correct drop zones
  media?: MediaAsset;
}

export interface DragDropActivity {
  id: string;
  title: string;
  instructions: string;
  items: DragDropItem[];
  feedback: {
    correct: string;
    incorrect: string;
  };
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'image' | 'quiz' | 'interactive-image' | 'drag-drop' | 'code' | 'file-download';
  content: any; // varies by type
  order: number;
  settings?: {
    fullWidth?: boolean;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
  };
}

export interface CourseLesson {
  id: string;
  title: string;
  description?: string;
  duration: number; // estimated minutes
  contentBlocks: ContentBlock[];
  completed: boolean;
  locked: boolean;
  prerequisites?: string[]; // lesson IDs
  resources?: MediaAsset[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  completed: boolean;
  locked: boolean;
  order: number;
  estimatedDuration: number; // total minutes
  createdAt: string;
  updatedAt: string;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedModules: string[];
  quizScores: Record<string, number>;
  timeSpent: number; // total minutes
  lastAccessedAt: string;
  certificateEarned: boolean;
  certificateIssuedAt?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: {
    id: string;
    name: string;
    bio: string;
    avatar: string;
    credentials: string[];
  };
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  studentCount: string;
  skills: string[];
  modules: CourseModule[];
  certificate: boolean;
  enrolled: boolean;
  progress: number;
  emoji: string;
  thumbnail: string;
  trailer?: MediaAsset;
  category: string;
  tags: string[];
  language: string;
  subtitles: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  targetAudience: string[];
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CourseTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  modules: Omit<CourseModule, 'id' | 'createdAt' | 'updatedAt'>[];
  thumbnail: string;
  estimatedSetupTime: number; // minutes
}

export interface AuthoringSession {
  courseId: string;
  userId: string;
  lastSaved: string;
  autoSaveEnabled: boolean;
  collaborators: string[];
}
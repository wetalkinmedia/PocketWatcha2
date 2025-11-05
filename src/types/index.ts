export interface AllocationItem {
  percentage: number;
  name: string;
  emoji: string;
}

export interface Allocations {
  necessities: AllocationItem;
  savings: AllocationItem;
  investments: AllocationItem;
  entertainment: AllocationItem;
  personal: AllocationItem;
}

export type AgeGroup = "18-25" | "26-35" | "36-45" | "46-55" | "56+";
export type LivingSituation = "student" | "single" | "couple" | "family" | "retiree";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  flag: string;
}

export interface City {
  value: string;
  name: string;
  multiplier: number;
  country: string;
  flag: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  salary: number;
  zipCode: string;
  relationshipStatus: 'single' | 'married' | 'divorced' | 'widowed' | 'in-relationship';
  occupation: string;
  phoneNumber: string;
  email: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  contentBlocks: ContentBlock[];
  videoUrl?: string;
  completed: boolean;
}

export interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'image' | 'quiz' | 'interactive-image' | 'drag-drop';
  content: {
    html?: string;
    videoUrl?: string;
    imageUrl?: string;
    alt?: string;
    questions?: any[];
    hotspots?: any[];
    items?: any[];
  };
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: CourseLesson[];
  completed: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  originalPrice?: number;
  rating: number;
  students: string;
  skills: string[];
  modules: CourseModule[];
  certificate: boolean;
  enrolled: boolean;
  progress: number;
  emoji: string;
  website: string;
}
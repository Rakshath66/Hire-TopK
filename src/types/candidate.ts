export interface WorkExperience {
  company: string;
  roleName: string;
}

export interface Degree {
  degree: string;
  subject: string;
  school: string;
  gpa: number;
  isTop50: boolean;
}

export interface Education {
  highest_level: string;
  degrees: Degree[];
}

export interface Candidate {
  name: string;
  email: string;
  location: string;
  annual_salary_expectation: {
    'full-time': string;
  };
  work_experiences: WorkExperience[];
  education: Education;
  skills: string[];
  work_availability: string[];
  scores?: {
    technical: number;
    experience: number;
    education: number;
    leadership: number;
    costEfficiency: number;
    total: number;
  };
} 
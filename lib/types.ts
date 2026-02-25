// Auth
export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

// User
export interface User {
  id: number;
  username: string;
  role: "ROLE_USER" | "ROLE_ADMIN";
}

// Routine
export interface RoutineRequest {
  name: string;
  description: string;
}

export interface RoutineResponse {
  id: number;
  name: string;
  description: string;
  userId: number;
  username: string;
}

// Exercise
export interface ExerciseRequest {
  routineId: number;
  name: string;
  sets: number;
  reps: number;
}

export interface ExerciseResponse {
  id: number;
  name: string;
  sets: number;
  reps: number;
  routineId: number;
}

// Progress
export interface ProgressRequest {
  exerciseId: number;
  date?: string;
  note: string;
}

export interface ProgressResponse {
  id: number;
  date: string;
  note: string;
  exerciseId: number;
}

import type {
  AuthRequest,
  AuthResponse,
  RoutineRequest,
  RoutineResponse,
  ExerciseRequest,
  ExerciseResponse,
  ProgressRequest,
  ProgressResponse,
  User,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => "Request failed");
    throw new Error(errorText || `HTTP ${res.status}`);
  }
  // 204 No Content or empty body
  if (res.status === 204) return undefined as T;
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return undefined as T;
  }
  const text = await res.text();
  if (!text || text.trim().length === 0) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}
// Auth
export const auth = {
  register: (data: AuthRequest) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  login: (data: AuthRequest) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Routines
export const routines = {
  getAll: () => request<RoutineResponse[]>("/api/routines"),
  getById: (id: number) => request<RoutineResponse>(`/api/routines/${id}`),
  create: (data: RoutineRequest) =>
    request<RoutineResponse>("/api/routines", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: RoutineRequest) =>
    request<RoutineResponse>(`/api/routines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/api/routines/${id}`, { method: "DELETE" }),
};

// Exercises
export const exercises = {
  getByRoutine: (routineId: number) =>
    request<ExerciseResponse[]>(`/api/exercises/routine/${routineId}`),
  create: (data: ExerciseRequest) =>
    request<ExerciseResponse>("/api/exercises", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Omit<ExerciseRequest, "routineId">) =>
    request<ExerciseResponse>(`/api/exercises/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/api/exercises/${id}`, { method: "DELETE" }),
};

// Progress
export const progress = {
  getByExercise: (exerciseId: number) =>
    request<ProgressResponse[]>(`/api/progress/exercise/${exerciseId}`),
  create: (data: ProgressRequest) =>
    request<ProgressResponse>("/api/progress", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    request<void>(`/api/progress/${id}`, { method: "DELETE" }),
};

// Admin
export const admin = {
  getUsers: () => request<User[]>("/admin/users"),
  getRoutines: () => request<RoutineResponse[]>("/admin/routines"),
  deleteUser: (id: number) =>
    request<void>(`/admin/users/${id}`, { method: "DELETE" }),

  updateRoutine: (id: number, data: RoutineRequest) =>
    request<RoutineResponse>(`/admin/routines/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteRoutine: (id: number) =>
    request<void>(`/admin/routines/${id}`, { method: "DELETE" }),
};

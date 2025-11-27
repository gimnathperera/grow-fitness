import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (set by the store)
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both localStorage and cookie on 401
      localStorage.removeItem("auth_token");
      document.cookie =
        "auth-storage=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
};

// Users API
export const usersApi = {
  getAll: (role?: string) => api.get("/users", { params: { role } }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: {
    email: string;
    name: string;
    password: string;
    role: "admin" | "coach" | "parent";
    phone?: string;
  }) => api.post("/users", data),
  update: (
    id: string,
    data: {
      email?: string;
      name?: string;
      phone?: string;
    }
  ) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

// Sessions API
export const sessionsApi = {
  getAll: (filters?: {
    coachId?: string;
    childId?: string;
    startDate?: string;
    endDate?: string;
    status?: "booked" | "canceled" | "completed";
  }) => api.get("/sessions", { params: filters }),
  getById: (id: string) => api.get(`/sessions/${id}`),
  create: (data: {
    type: "individual" | "group";
    coachId: string;
    childIds: string[];
    locationId: string;
    startAt: Date;
    endAt: Date;
    notes?: string;
  }) => api.post("/sessions", data),
  update: (
    id: string,
    data: {
      type?: "individual" | "group";
      coachId?: string;
      childIds?: string[];
      locationId?: string;
      startAt?: Date;
      endAt?: Date;
      notes?: string;
      status?: "booked" | "canceled" | "completed";
    }
  ) => api.patch(`/sessions/${id}`, data),
  delete: (id: string) => api.delete(`/sessions/${id}`),
};

// Requests API
export const requestsApi = {
  getAll: (status?: "pending" | "approved" | "rejected") =>
    api.get("/requests", { params: { status } }),
  getById: (id: string) => api.get(`/requests/${id}`),
  approve: (id: string, data: { adminNote?: string }) =>
    api.post(`/requests/${id}/approve`, data),
  reject: (id: string, data: { reason: string }) =>
    api.post(`/requests/${id}/reject`, data),
};

// Notifications API
export const notificationsApi = {
  getAll: () => api.get("/notifications"),
  markAsRead: (id: string) => api.patch(`/notifications/${id}/read`),
};

// Locations API
export const locationsApi = {
  getAll: () => api.get("/locations"),
  getById: (id: string) => api.get(`/locations/${id}`),
  create: (data: { label: string }) => api.post("/locations", data),
  update: (id: string, data: { label?: string }) =>
    api.patch(`/locations/${id}`, data),
  delete: (id: string) => api.delete(`/locations/${id}`),
};

// Invoices API
export const invoicesApi = {
  getAll: (filters?: {
    parentId?: string;
    status?: "pending" | "paid" | "overdue";
    startDate?: string;
    endDate?: string;
  }) => api.get("/invoices", { params: filters }),
  getById: (id: string) => api.get(`/invoices/${id}`),
  markPaid: (id: string, data: { paidDate?: Date }) =>
    api.post(`/invoices/${id}/mark-paid`, data),
  generate: (data: { parentId: string; month: string; year: string }) =>
    api.post("/invoices/generate", data),
};

// Reports API
export const reportsApi = {
  getDashboardStats: (filters?: {
    startDate?: string;
    endDate?: string;
    coachId?: string;
  }) => api.get("/reports/dashboard", { params: filters }),
  getSessionsReport: (filters?: {
    startDate?: string;
    endDate?: string;
    coachId?: string;
    locationId?: string;
  }) => api.get("/reports/sessions", { params: filters }),
  getRevenueReport: (filters?: { startDate?: string; endDate?: string }) =>
    api.get("/reports/revenue", { params: filters }),
};

// Children API (for managing children records)
export const childrenApi = {
  getAll: (parentId?: string) => api.get("/children", { params: { parentId } }),
  getById: (id: string) => api.get(`/children/${id}`),
  create: (data: {
    name: string;
    parentId: string;
    age: number;
    medicalCondition?: string;
    gender: string;
    goals?: string[];
  }) => api.post("/children", data),
  update: (
    id: string,
    data: {
      name?: string;
      age?: number;
      medicalCondition?: string;
      gender?: string;
      goals?: string[];
    }
  ) => api.patch(`/children/${id}`, data),
  delete: (id: string) => api.delete(`/children/${id}`),
};

// Coaches API
export const coachesApi = {
  getAll: () => api.get("/users", { params: { role: "coach" } }),
  getById: (id: string) => api.get(`/users/${id}`),
  create: (data: {
    email: string;
    name: string;
    password: string;
    phone?: string;
    specialties?: string[];
    bio?: string;
  }) => api.post("/users", { ...data, role: "coach" }),
  update: (
    id: string,
    data: {
      email?: string;
      name?: string;
      phone?: string;
      specialties?: string[];
      bio?: string;
    }
  ) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export default api;

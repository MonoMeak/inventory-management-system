export interface User {
  id: number;
  username: string;
  email?: string;
  role: "ADMIN" | "USER";
  active?: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  role?: "ADMIN" | "USER";
  active?: boolean;
}

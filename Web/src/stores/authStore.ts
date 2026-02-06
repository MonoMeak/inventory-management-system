import { defineStore } from "pinia";
import api from "../api/api";
import type {
  LoginResponse,
  User,
  CreateUserRequest,
  UpdateUserRequest,
} from "../types/auth";

export const useAuthStore = defineStore("auth", {
  state: () => {
    // Restore user data from localStorage on initialization
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    return {
      user: storedUser ? (JSON.parse(storedUser) as User) : null,
      token: storedToken,
      isAuthenticated: !!storedToken,
    };
  },

  getters: {
    isAdmin: (state) => state.user?.role === "ADMIN",
  },

  actions: {
    async login(username: string, password: string) {
      const response = await api.post<LoginResponse>("/login", {
        username,
        password,
      });

      this.user = response.user;
      this.token = response.token;
      this.isAuthenticated = true;

      // Store both token and user in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    },

    async checkSession() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const user = await api.get<User>("/admin/session");
        this.user = user;
        this.isAuthenticated = true;

        // Update user in localStorage
        localStorage.setItem("user", JSON.stringify(user));
      } catch (error) {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },

    async logout() {
      try {
        await api.post<{ message: string }>("/logout");
      } catch (error) {
        // Ignore errors on logout
      }

      localStorage.removeItem("user");
      this.user = null;
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
    },

    // Admin user management
    async getUsers() {
      return await api.get<User[]>("/admin/users");
    },

    async createUser(userData: CreateUserRequest) {
      return await api.post<{ message: string }>("/admin/users", userData);
    },

    async updateUser(id: number, userData: UpdateUserRequest) {
      return await api.post<{ message: string }>(
        `/admin/users/${id}`,
        userData
      );
    },

    async deactivateUser(id: number) {
      return await api.post<{ message: string }>(
        `/admin/users/${id}/deactivate`
      );
    },

    async deleteUser(id: number) {
      return await api.post<{ message: string }>(`/admin/users/${id}/delete`);
    },
  },
});

import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/api";

export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserFormData {
  username: string;
  email?: string;
  password?: string;
  role: string;
}

interface SortInfo {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: SortInfo;
  offset: number;
  unpaged: boolean;
  paged: boolean;
}

export interface UserPageResponse {
  content: User[];
  pageable: Pageable;
  totalPages: number;
  last: boolean;
  totalElements: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: SortInfo;
  empty: boolean;
}

export const useUserStore = defineStore("user", () => {
  const users = ref<User[]>([]);
  const loading = ref(false);
  const currentPage = ref(1);
  const pageSize = ref(10);
  const totalElements = ref(0);
  const totalPages = ref(1);

  const fetchUsers = async (
    keyword?: string,
    role?: string,
    page: number = 1,
    size: number = 10
  ) => {
    loading.value = true;
    try {
      const params = new URLSearchParams({
        page: (page - 1).toString(),
        size: size.toString(),
      });

      if (keyword) params.append("keyword", keyword);
      if (role) params.append("role", role);

      const response = await api.get<UserPageResponse>(
        `/admin/users?${params}`
      );
      users.value = response.content || [];
      totalElements.value = response.totalElements || 0;
      totalPages.value = response.totalPages || 1;
      currentPage.value = page;
      pageSize.value = size;
    } catch (error) {
      console.error("Failed to fetch users:", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (userData: UserFormData) => {
    try {
      const response = await api.post("/admin/users", userData);
      return response;
    } catch (error) {
      console.error("Failed to create user:", error);
      throw error;
    }
  };

  const updateUser = async (
    userId: number,
    userData: Partial<UserFormData>
  ) => {
    try {
      const response = await api.post(`/admin/users/${userId}`, userData);
      return response;
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await api.post(`/admin/users/${userId}/delete`);
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  return {
    users,
    loading,
    currentPage,
    pageSize,
    totalElements,
    totalPages,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
});

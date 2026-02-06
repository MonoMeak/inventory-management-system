<template>
  <PageLayout
    :user="authStore.user"
    :isAdmin="authStore.isAdmin"
    @logout="handleLogout"
  >
    <div class="min-h-screen" style="background-color: #fff9e5">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="User Management"
          description="Manage system users and their roles"
        >
          <template #actions>
            <button
              v-if="authStore.isAdmin"
              @click="openCreateModal"
              class="px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl hover:cursor-pointer transform hover:-translate-y-0.5"
              style="background: linear-gradient(to right, #004030, #4a9782)"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span class="font-semibold">Add User</span>
            </button>
          </template>
        </PageHeader>

        <!-- Search Section -->
        <div class="mt-6 bg-white rounded-lg shadow-sm p-4">
          <div class="flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <input
                type="text"
                v-model="searchKeyword"
                @input="debouncedSearch"
                placeholder="Search by username..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
              />
            </div>
            <select
              v-model="roleFilter"
              @change="applyFilters"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
              style="color: #004030"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
        </div>

        <!-- Users Table -->
        <div class="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div v-if="userStore.loading" class="p-8">
            <div class="animate-pulse space-y-4">
              <div class="h-12 bg-gray-200 rounded"></div>
              <div class="h-12 bg-gray-200 rounded"></div>
              <div class="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>

          <div v-else-if="userStore.users.length === 0" class="p-8">
            <EmptyState
              title="No users found"
              description="No users match your search criteria"
            />
          </div>

          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead style="background-color: #004030">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    Username
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="user in userStore.users"
                  :key="user.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-3">
                      <div
                        class="h-10 w-10 rounded-full flex items-center justify-center"
                        style="
                          background: linear-gradient(
                            to right,
                            #004030,
                            #4a9782
                          );
                        "
                      >
                        <svg
                          class="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span
                        class="text-sm font-medium"
                        style="color: #004030"
                        >{{ user.username }}</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="user.role === 'ADMIN'"
                      class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      style="background-color: #dcd0a8; color: #004030"
                    >
                      Admin
                    </span>
                    <span
                      v-else
                      class="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600"
                    >
                      Staff
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <button
                      @click="openEditModal(user)"
                      class="text-white px-3 py-1.5 rounded-lg hover:opacity-80 transition-all mr-2"
                      style="
                        background: linear-gradient(to right, #004030, #4a9782);
                      "
                    >
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(user)"
                      class="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-all"
                      :disabled="user.id === authStore.user?.id"
                      :class="{
                        'opacity-50 cursor-not-allowed':
                          user.id === authStore.user?.id,
                      }"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="!userStore.loading && userStore.users.length > 0"
          class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg shadow-sm p-4"
        >
          <div class="text-sm" style="color: #004030">
            Showing
            {{ (userStore.currentPage - 1) * userStore.pageSize + 1 }} to
            {{
              Math.min(
                userStore.currentPage * userStore.pageSize,
                userStore.totalElements
              )
            }}
            of {{ userStore.totalElements }} users
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="previousPage"
              :disabled="userStore.currentPage === 1"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="
                userStore.currentPage === 1
                  ? 'bg-gray-100 text-gray-400'
                  : 'text-white hover:opacity-80'
              "
              :style="
                userStore.currentPage === 1
                  ? ''
                  : 'background: linear-gradient(to right, #004030, #4a9782);'
              "
            >
              Previous
            </button>
            <span
              class="px-4 py-2 text-sm font-semibold"
              style="color: #004030"
            >
              {{ userStore.currentPage }} / {{ userStore.totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="userStore.currentPage === userStore.totalPages"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :class="
                userStore.currentPage === userStore.totalPages
                  ? 'bg-gray-100 text-gray-400'
                  : 'text-white hover:opacity-80'
              "
              :style="
                userStore.currentPage === userStore.totalPages
                  ? ''
                  : 'background: linear-gradient(to right, #004030, #4a9782);'
              "
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background-color: rgba(0, 64, 48, 0.5); backdrop-filter: blur(4px)"
      @click.self="closeModal"
    >
      <div
        class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="p-6">
          <h3 class="text-2xl font-bold mb-6" style="color: #004030">
            {{ isEditing ? "Edit User" : "Create New User" }}
          </h3>
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Username
              </label>
              <input
                type="text"
                v-model="userForm.username"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Email
              </label>
              <input
                type="text"
                v-model="userForm.email"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
              />
            </div>
            <div v-if="!isEditing">
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Password
              </label>
              <input
                type="password"
                v-model="userForm.password"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Role
              </label>
              <select
                v-model="userForm.role"
                required
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
                style="color: #004030"
              >
                <option value="STAFF">Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div class="flex gap-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                style="color: #004030"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="flex-1 px-4 py-2 text-white rounded-lg font-semibold hover:opacity-80 transition-all disabled:opacity-50"
                style="background: linear-gradient(to right, #004030, #4a9782)"
              >
                {{ submitting ? "Saving..." : isEditing ? "Update" : "Create" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      style="background-color: rgba(0, 64, 48, 0.5); backdrop-filter: blur(4px)"
      @click.self="closeDeleteModal"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 class="text-2xl font-bold mb-4" style="color: #004030">
          Confirm Delete
        </h3>
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete user
          <span class="font-semibold" style="color: #004030">{{
            userToDelete?.username
          }}</span
          >? This action cannot be undone.
        </p>
        <div class="mb-6">
          <label
            class="block text-sm font-semibold mb-2"
            style="color: #004030"
          >
            Type <span class="font-bold">DELETE</span> to confirm
          </label>
          <input
            type="text"
            v-model="deleteVerification"
            placeholder="Type DELETE"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4a9782] focus:border-transparent transition-all"
            @input="deleteVerification = deleteVerification.toUpperCase()"
          />
        </div>
        <div class="flex gap-3">
          <button
            type="button"
            @click="closeDeleteModal"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            style="color: #004030"
          >
            Cancel
          </button>
          <button
            @click="deleteUser"
            :disabled="submitting || deleteVerification !== 'DELETE'"
            class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ submitting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </PageLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import { useToastStore } from "../stores/toastStore";
import { useUserStore, type User } from "../stores/userStore";
import PageLayout from "../components/PageLayout.vue";
import PageHeader from "../components/PageHeader.vue";
import EmptyState from "../components/EmptyState.vue";

const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();
const userStore = useUserStore();

const submitting = ref(false);
const searchKeyword = ref("");
const roleFilter = ref("");

const showModal = ref(false);
const isEditing = ref(false);
const showDeleteModal = ref(false);
const userToDelete = ref<User | null>(null);
const deleteVerification = ref("");

const userForm = ref({
  id: 0,
  username: "",
  email: "",
  password: "",
  role: "USER",
});

let searchTimeout: ReturnType<typeof setTimeout> | null = null;

const debouncedSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchUsers();
  }, 500);
};

const applyFilters = () => {
  fetchUsers();
};

const fetchUsers = async (page: number = 1) => {
  try {
    await userStore.fetchUsers(
      searchKeyword.value,
      roleFilter.value,
      page,
      userStore.pageSize
    );
  } catch (error: any) {
    toastStore.error(error.response?.data?.message || "Failed to fetch users");
  }
};

const openCreateModal = () => {
  isEditing.value = false;
  userForm.value = {
    id: 0,
    username: "",
    email: "",
    password: "",
    role: "STAFF",
  };
  showModal.value = true;
};

const openEditModal = (user: User) => {
  isEditing.value = true;
  userForm.value = {
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    role: user.role,
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  userForm.value = {
    id: 0,
    username: "",
    email: "",
    password: "",
    role: "STAFF",
  };
};

const saveUser = async () => {
  submitting.value = true;
  try {
    if (isEditing.value) {
      await userStore.updateUser(userForm.value.id, {
        username: userForm.value.username,
        role: userForm.value.role,
      });
      toastStore.success("User updated successfully");
    } else {
      await userStore.createUser(userForm.value);
      toastStore.success("User created successfully");
    }
    closeModal();
    fetchUsers(userStore.currentPage);
  } catch (error: any) {
    toastStore.error(error.response?.data?.message || "Failed to save user");
  } finally {
    submitting.value = false;
  }
};

const confirmDelete = (user: User) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  userToDelete.value = null;
  deleteVerification.value = "";
};

const deleteUser = async () => {
  if (!userToDelete.value) return;

  submitting.value = true;
  try {
    await userStore.deleteUser(userToDelete.value.id);
    toastStore.success("User deleted successfully");
    closeDeleteModal();
    fetchUsers(userStore.currentPage);
  } catch (error: any) {
    toastStore.error(error.response?.data?.message || "Failed to delete user");
  } finally {
    submitting.value = false;
  }
};

const previousPage = () => {
  if (userStore.currentPage > 1) {
    fetchUsers(userStore.currentPage - 1);
  }
};

const nextPage = () => {
  if (userStore.currentPage < userStore.totalPages) {
    fetchUsers(userStore.currentPage + 1);
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

onMounted(() => {
  fetchUsers();
});
</script>

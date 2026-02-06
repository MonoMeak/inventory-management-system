<template>
  <page-layout :user="auth.user" :isAdmin="auth.isAdmin" @logout="handleLogout">
    <!-- Header -->
    <page-header
      title="Categories"
      description="Organize your products into categories"
    >
      <template #actions>
        <button
          v-if="auth.isAdmin"
          @click="openCreateModal"
          class="px-6 py-3 text-white rounded-xl hover:opacity-90 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
          <span class="font-semibold">Add Category</span>
        </button>
      </template>

      <template #badges>
        <stats-badge icon="category">
          {{ items.categoriesPagination.totalElements }} Categories
        </stats-badge>
        <stats-badge icon="product">
          {{ totalProductCount }} Products
        </stats-badge>
      </template>
    </page-header>

    <!-- Search Bar -->
    <div class="mb-6 bg-white p-4 rounded-lg shadow">
      <div class="flex gap-4">
        <div class="flex-1">
          <input
            v-model="searchKeyword"
            @input="handleSearch"
            type="text"
            placeholder="Search categories by name..."
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none"
            style="--tw-ring-color: #4a9782"
          />
        </div>
      </div>
    </div>

    <!-- Categories Grid -->
    <category-skeleton v-if="items.loading" :count="12" />

    <empty-state
      v-else-if="items.categories.length === 0"
      title="No categories yet"
      description="Get started by creating your first category to organize your products efficiently."
      icon="category"
      :show-action="auth.isAdmin"
      action-label="Create First Category"
      @action="openCreateModal"
    />

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <category-card
        v-for="category in items.categories"
        :key="category.id"
        :category="category"
        :show-actions="auth.isAdmin"
        @edit="openEditModal"
        @delete="handleDelete(category.id)"
      />
    </div>

    <!-- Pagination -->
    <div
      v-if="items.categories.length > 0"
      class="flex justify-center items-center gap-2 mt-8"
    >
      <button
        @click="changePage(items.categoriesPagination.currentPage - 1)"
        :disabled="items.categoriesPagination.currentPage === 0"
        class="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition"
        style="border-color: #4a9782; color: #004030"
      >
        Previous
      </button>
      <span class="px-4 py-2" style="color: #004030">
        Page {{ items.categoriesPagination.currentPage + 1 }} of
        {{ items.categoriesPagination.totalPages }}
      </span>
      <span class="text-sm text-gray-500">
        ({{ items.categoriesPagination.totalElements }} total categories)
      </span>
      <button
        @click="changePage(items.categoriesPagination.currentPage + 1)"
        :disabled="
          items.categoriesPagination.currentPage >=
          items.categoriesPagination.totalPages - 1
        "
        class="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition"
        style="border-color: #4a9782; color: #004030"
      >
        Next
      </button>
    </div>

    <!-- Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 flex items-center justify-center p-4 z-50"
      style="background-color: rgba(0, 64, 48, 0.3); backdrop-filter: blur(4px)"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Create Category</h2>

        <form @submit.prevent="handleCreate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name *</label>
            <input
              v-model="form.name"
              required
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
              :style="{ '--tw-ring-color': '#4A9782' }"
              placeholder="Category name"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:outline-none"
              :style="{ '--tw-ring-color': '#4A9782' }"
              placeholder="Category description (optional)"
            ></textarea>
          </div>

          <div class="flex gap-3 pt-6">
            <button
              type="submit"
              class="flex-1 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-all font-semibold shadow-md hover:shadow-lg"
              style="background: linear-gradient(to right, #004030, #4a9782)"
            >
              Create Category
            </button>
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 px-4 py-3 border-2 rounded-lg transition-all font-semibold"
              style="border-color: #dcd0a8; color: #004030"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 flex items-center justify-center p-4 z-50"
      style="background-color: rgba(0, 64, 48, 0.3); backdrop-filter: blur(4px)"
      @click.self="showEditModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 class="text-2xl font-bold mb-4">Edit Category</h2>

        <form @submit.prevent="handleCreate" class="space-y-5">
          <div>
            <label
              class="block text-sm font-semibold mb-2"
              style="color: #004030"
            >
              Name *
            </label>
            <input
              v-model="form.name"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
              style="--tw-ring-color: #4a9782"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label
              class="block text-sm font-semibold mb-2"
              style="color: #004030"
            >
              Description
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
              style="--tw-ring-color: #4a9782"
              placeholder="Enter category description"
            ></textarea>
          </div>

          <div class="flex gap-2 pt-4">
            <button
              type="submit"
              class="flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90"
              style="background-color: #004030"
            >
              Update
            </button>
            <button
              type="button"
              @click="showEditModal = false"
              class="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </page-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useItemStore } from "../stores/itemStore";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types/item";
import CategoryCard from "../components/CategoryCard.vue";
import CategorySkeleton from "../components/CategorySkeleton.vue";
import EmptyState from "../components/EmptyState.vue";
import PageLayout from "../components/PageLayout.vue";
import PageHeader from "../components/PageHeader.vue";
import StatsBadge from "../components/StatsBadge.vue";
import { useToastStore } from "../stores/toastStore";

const items = useItemStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();

const searchKeyword = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedCategoryId = ref<number>(0);
const currentPage = ref(0);
const totalProductCount = ref(0);

let searchTimeout: NodeJS.Timeout;

const form = ref({
  name: "",
  description: "",
  productCount: 0,
});

onMounted(async () => {
  await loadCategories();
  // Fetch products to get total count
  await items.fetchProducts(undefined, undefined, { size: 1 });
  totalProductCount.value = items.productsPagination.totalElements;
});

async function loadCategories() {
  await items.fetchCategories(searchKeyword.value, {
    page: currentPage.value,
    size: items.categoriesPagination.pageSize,
  });
}

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    currentPage.value = 0; // Reset to first page on search
    await loadCategories();
  }, 500);
}

function changePage(newPage: number) {
  currentPage.value = newPage;
  loadCategories();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function getProductCount(categoryId: number): number {
  return items.products.filter((p) => p.categoryId === categoryId).length;
}

async function handleCreate() {
  try {
    const categoryData: CreateCategoryRequest = {
      name: form.value.name,
      description: form.value.description || undefined,
    };

    await items.createCategory(categoryData);
    toast.success("Category created successfully");
    showCreateModal.value = false;
    resetForm();
  } catch (error: any) {
    toast.error(error.message || "Failed to create category");
  }
}

function openEditModal(category: Category) {
  form.value = {
    name: category.name,
    description: category.description || "",
    productCount: category.productCount || 0,
  };
  selectedCategoryId.value = category.id;
  showEditModal.value = true;
}

async function handleUpdate() {
  try {
    const categoryData: UpdateCategoryRequest = {
      name: form.value.name,
      description: form.value.description || undefined,
    };

    await items.updateCategory(selectedCategoryId.value, categoryData);
    toast.success("Category updated successfully");
    showEditModal.value = false;
    resetForm();
  } catch (error: any) {
    toast.error(error.message || "Failed to update category");
  }
}

async function handleDelete(categoryId: number) {
  const productCount = getProductCount(categoryId);

  if (productCount > 0) {
    if (
      !confirm(
        `This category has ${productCount} products. Are you sure you want to delete it?`
      )
    ) {
      return;
    }
  } else {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }
  }

  try {
    await items.deleteCategory(categoryId);
    toast.success("Category deleted successfully");
  } catch (error: any) {
    toast.error(error.message || "Failed to delete category");
  }
}

function resetForm() {
  form.value = {
    name: "",
    description: "",
    productCount: 0,
  };
}

function openCreateModal() {
  resetForm();
  showCreateModal.value = true;
}

const handleLogout = async () => {
  await auth.logout();
  router.push("/login");
};
</script>

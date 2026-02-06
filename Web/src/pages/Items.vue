<template>
  <page-layout :user="auth.user" :isAdmin="auth.isAdmin" @logout="handleLogout">
    <!-- Header -->
    <page-header title="Products" description="Manage your product inventory">
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
            <span class="font-semibold">Add Product</span>
          </button>
        </template>
        <template #badges>
          <stats-badge icon="product">
            {{ itemStore.productsPagination.totalElements }} Products
          </stats-badge>
          <stats-badge icon="category">
            {{ itemStore.categories.length }} Categories
          </stats-badge>
        </template>
      </page-header>

      <!-- Search and Filter -->
      <div class="mb-6 bg-white p-4 rounded-lg shadow">
        <div class="flex gap-4">
          <div class="flex-1">
            <input
              v-model="searchKeyword"
              @input="handleSearch"
              type="text"
              placeholder="Search products by name or code..."
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none"
              style="--tw-ring-color: #4a9782"
            />
          </div>
          <select
            v-model="selectedCategoryId"
            @change="handleCategoryFilter"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none"
            style="--tw-ring-color: #4a9782"
          >
            <option :value="undefined">All Categories</option>
            <option
              v-for="category in itemStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Products Grid -->
      <product-skeleton v-if="itemStore.loading" :count="12" />

      <empty-state
        v-else-if="itemStore.products.length === 0"
        title="No products found"
        description="Get started by creating a new product."
        icon="product"
        :show-action="auth.isAdmin"
        action-label="Create First Product"
        @action="openCreateModal"
      />

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <product-card
          v-for="product in itemStore.products"
          :key="product.id"
          :product="product"
          :image-url="getProductImageUrl(product.image)"
          :show-actions="auth.isAdmin"
          @edit="openEditModal(product.code)"
          @delete="handleDelete(product.code)"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="itemStore.products.length > 0"
        class="flex justify-center items-center gap-2 mt-8"
      >
        <button
          @click="changePage(itemStore.productsPagination.currentPage - 1)"
          :disabled="itemStore.productsPagination.currentPage === 0"
          class="px-4 py-2 border rounded-lg hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed transition"
          style="border-color: #4a9782; color: #004030"
        >
          Previous
        </button>
        <span class="px-4 py-2" style="color: #004030">
          Page {{ itemStore.productsPagination.currentPage + 1 }} of
          {{ itemStore.productsPagination.totalPages }}
        </span>
        <span class="text-sm text-gray-500">
          ({{ itemStore.productsPagination.totalElements }} total items)
        </span>
        <button
          @click="changePage(itemStore.productsPagination.currentPage + 1)"
          :disabled="
            itemStore.productsPagination.currentPage >=
            itemStore.productsPagination.totalPages - 1
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
        style="
          background-color: rgba(0, 64, 48, 0.3);
          backdrop-filter: blur(4px);
        "
        @click.self="showCreateModal = false"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <h2 class="text-2xl font-bold mb-6" style="color: #004030">
            Create Product
          </h2>

          <form @submit.prevent="handleCreate" class="space-y-5">
            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Product Code *
              </label>
              <input
                v-model="form.productCode"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
                placeholder="e.g., PROD001"
              />
            </div>

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
                placeholder="Product name"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Price *
              </label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Category
              </label>
              <select
                v-model="form.categoryId"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
              >
                <option :value="undefined">No category</option>
                <option
                  v-for="category in itemStore.categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Image *
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
              />
              <p class="text-xs text-gray-500 mt-1">
                Max 5MB, JPEG/PNG/GIF/WebP
              </p>
            </div>

            <div class="flex gap-3 pt-6">
              <button
                type="submit"
                class="flex-1 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-all font-semibold shadow-md hover:shadow-lg"
                style="background: linear-gradient(to right, #004030, #4a9782)"
              >
                Create Product
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
        style="
          background-color: rgba(0, 64, 48, 0.3);
          backdrop-filter: blur(4px);
        "
        @click.self="showEditModal = false"
      >
        <div
          class="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <h2 class="text-2xl font-bold mb-6" style="color: #004030">
            Edit Product
          </h2>

          <form @submit.prevent="handleUpdate" class="space-y-5">
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
                placeholder="Product name"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Price *
              </label>
              <input
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
                placeholder="0.00"
              />
            </div>

            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                Category
              </label>
              <select
                v-model="form.categoryId"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
              >
                <option :value="undefined">No category</option>
                <option
                  v-for="category in itemStore.categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div>
              <label
                class="block text-sm font-semibold mb-2"
                style="color: #004030"
              >
                New Image (optional)
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:border-transparent focus:outline-none transition-all"
                style="--tw-ring-color: #4a9782"
              />
              <p class="text-xs text-gray-500 mt-1">
                Max 5MB, JPEG/PNG/GIF/WebP
              </p>
            </div>

            <div class="flex gap-3 pt-6">
              <button
                type="submit"
                class="flex-1 px-4 py-3 text-white rounded-lg hover:opacity-90 transition-all font-semibold shadow-md hover:shadow-lg"
                style="background: linear-gradient(to right, #004030, #4a9782)"
              >
                Update Product
              </button>
              <button
                type="button"
                @click="showEditModal = false"
                class="flex-1 px-4 py-3 border-2 rounded-lg transition-all font-semibold"
                style="border-color: #dcd0a8; color: #004030"
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
import type { CreateProductRequest, UpdateProductRequest } from "../types/item";
import {
  getProductImageUrl,
  getDefaultProductImage,
} from "../utils/imageUtils";
import ProductCard from "../components/ProductCard.vue";
import ProductSkeleton from "../components/ProductSkeleton.vue";
import EmptyState from "../components/EmptyState.vue";
import PageLayout from "../components/PageLayout.vue";
import PageHeader from "../components/PageHeader.vue";
import StatsBadge from "../components/StatsBadge.vue";
import { useToastStore } from "../stores/toastStore";

const itemStore = useItemStore();
const auth = useAuthStore();
const router = useRouter();
const toast = useToastStore();

const searchKeyword = ref("");
const selectedCategoryId = ref<number | undefined>();
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedProductCode = ref("");
const currentPage = ref(0);

const form = ref({
  productCode: "",
  name: "",
  price: 0,
  categoryId: undefined as number | undefined,
});
const selectedFile = ref<File | null>(null);

let searchTimeout: NodeJS.Timeout;

// Handle image loading errors with fallback
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (img.src !== getDefaultProductImage()) {
    img.src = getDefaultProductImage();
  }
}

onMounted(async () => {
  // Load categories first for filter dropdown
  await itemStore.fetchCategories(undefined, { size: 100 });
  // Then load products
  await loadProducts();
});

async function loadProducts() {
  await itemStore.fetchProducts(searchKeyword.value, selectedCategoryId.value, {
    page: currentPage.value,
    size: itemStore.productsPagination.pageSize,
  });
}

function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    currentPage.value = 0; // Reset to first page on search
    await loadProducts();
  }, 500);
}

function handleCategoryFilter() {
  currentPage.value = 0; // Reset to first page on filter
  loadProducts();
}

function changePage(newPage: number) {
  currentPage.value = newPage;
  loadProducts();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  selectedFile.value = file || null;

  if (file && file.size > 5 * 1024 * 1024) {
    toast.error("File size must be less than 5MB");
    selectedFile.value = null;
  }
}

async function handleCreate() {
  if (!selectedFile.value) {
    toast.error("Please select an image");
    return;
  }

  try {
    const productData: CreateProductRequest = {
      productCode: form.value.productCode,
      name: form.value.name,
      price: form.value.price,
      image: selectedFile.value,
      categoryId: form.value.categoryId,
    };

    await itemStore.createProduct(productData);
    toast.success("Product created successfully");
    showCreateModal.value = false;
    resetForm();
  } catch (error: any) {
    toast.error(error.message || "Failed to create product");
  }
}

async function openEditModal(productCode: string) {
  await itemStore.fetchProductByCode(productCode);
  if (itemStore.selectedProduct) {
    form.value = {
      productCode: itemStore.selectedProduct.code,
      name: itemStore.selectedProduct.name,
      price: itemStore.selectedProduct.price,
      categoryId: itemStore.selectedProduct.categoryId,
    };
    selectedProductCode.value = productCode;
    showEditModal.value = true;
  }
}

async function handleUpdate() {
  try {
    const productData: UpdateProductRequest = {
      name: form.value.name,
      price: form.value.price,
      categoryId: form.value.categoryId,
    };

    if (selectedFile.value) {
      productData.image = selectedFile.value;
    }

    await itemStore.updateProduct(selectedProductCode.value, productData);
    toast.success("Product updated successfully");
    showEditModal.value = false;
    resetForm();
  } catch (error: any) {
    toast.error(error.message || "Failed to update product");
  }
}

async function handleDelete(productCode: string) {
  if (!confirm("Are you sure you want to delete this product?")) {
    return;
  }

  try {
    await itemStore.deleteProduct(productCode);
    toast.success("Product deleted successfully");
  } catch (error: any) {
    toast.error(error.message || "Failed to delete product");
  }
}

function resetForm() {
  form.value = {
    productCode: "",
    name: "",
    price: 0,
    categoryId: undefined,
  };
  selectedFile.value = null;
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

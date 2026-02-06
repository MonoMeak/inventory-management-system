<template>
  <page-layout :user="auth.user" :isAdmin="auth.isAdmin" @logout="handleLogout">
    <page-header
      title="Dashboard"
      :description="`Welcome back, ${auth.user?.username}!`"
    >
      <template #badges>
        <stats-badge icon="product">
          {{ summary.totalItems }} Products
        </stats-badge>
        <stats-badge icon="category">
          {{ itemStore.categories.length }} Categories
        </stats-badge>
      </template>
    </page-header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <stats-card
        title="Total Products"
        :value="summary.totalItems"
        icon="products"
      />
      <stats-card
        title="Low Stock Items"
        :value="summary.lowStock"
        icon="lowStock"
      />
      <stats-card
        title="Total Stock Value"
        :value="summary.stockValue.toFixed(2)"
        icon="value"
        prefix="$"
      />
    </div>

    <!-- Recent Products -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <h3 class="text-lg font-semibold" style="color: #004030">
          Recent Products
        </h3>
      </div>
      <div v-if="loading" class="p-6">
        <dashboard-skeleton />
      </div>
      <div
        v-else-if="recentProducts.length === 0"
        class="p-6 text-center text-gray-500"
      >
        No products found.
        <router-link
          to="/products"
          class="hover:underline"
          style="color: #4a9782"
          >Add your first product</router-link
        >
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Image
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Code
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="product in recentProducts"
              :key="product.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <img
                  :src="getProductImageUrl(product.image)"
                  :alt="product.name"
                  @error="handleImageError($event)"
                  class="h-10 w-10 rounded object-cover"
                  loading="lazy"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ product.code }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ product.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.category?.name || "N/A" }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold"
              >
                {{ product.quantity || 1 }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold"
              >
                ${{ product.price.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-4 border-t border-gray-200 text-center">
        <router-link
          to="/products"
          class="text-sm font-medium hover:opacity-80"
          style="color: #4a9782"
        >
          View all products →
        </router-link>
      </div>
    </div>
  </page-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useItemStore } from "../stores/itemStore";
import { useRouter } from "vue-router";
import type { Product } from "../types/item";
import { reportsApi } from "../api/reportsApi";
import {
  getProductImageUrl,
  getDefaultProductImage,
} from "../utils/imageUtils";
import PageLayout from "../components/PageLayout.vue";
import StatsCard from "../components/StatsCard.vue";
import DashboardSkeleton from "../components/DashboardSkeleton.vue";
import PageHeader from "../components/PageHeader.vue";
import StatsBadge from "../components/StatsBadge.vue";

const auth = useAuthStore();
const items = useItemStore();
const itemStore = useItemStore();
const router = useRouter();

const loading = ref(true);
const recentProducts = ref<Product[]>([]);
const summary = ref({
  totalItems: 0,
  lowStock: 0,
  stockValue: 0,
});

// Handle image loading errors with fallback
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  if (img.src !== getDefaultProductImage()) {
    img.src = getDefaultProductImage();
  }
}

onMounted(async () => {
  try {
    // Fetch dashboard summary from reports API
    summary.value = await reportsApi.getSummary();

    // Fetch limited products and categories for dashboard
    await Promise.all([
      items.fetchProducts(undefined, undefined, { page: 0, size: 5 }),
      items.fetchCategories(undefined, { page: 0, size: 100 }),
    ]);

    // Show the fetched products
    recentProducts.value = items.products;
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  } finally {
    loading.value = false;
  }
});

const handleLogout = async () => {
  try {
    await auth.logout();
    router.push("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
</script>

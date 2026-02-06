<template>
  <div
    class="bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group"
  >
    <!-- Product Image -->
    <div
      class="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 relative"
    >
      <img
        :src="imageUrl"
        :alt="product.name"
        @error="handleImageError"
        class="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
      <div
        v-if="product.category"
        class="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
        style="background-color: rgba(220, 208, 168, 0.9); color: #004030"
      >
        {{ product.category.name }}
      </div>
    </div>

    <!-- Product Info -->
    <div class="p-4">
      <p class="text-xs text-gray-500 mb-1 uppercase tracking-wide">
        {{ product.code }}
      </p>
      <h3
        class="text-lg font-semibold mb-2 truncate group-hover:text-opacity-80 transition-colors"
        style="color: #004030"
      >
        {{ product.name }}
      </h3>

      <div class="flex items-center justify-between mb-4">
        <p class="text-2xl font-bold" style="color: #004030">
          ${{ product.price.toFixed(2) }}
        </p>
        <div
          v-if="showStock"
          class="flex items-center gap-1 text-sm"
          :class="stockStatus.color"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <span>{{ product.quantity || 1 }}</span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="showActions" class="flex gap-2">
        <button
          @click="$emit('edit', product)"
          class="flex-1 px-3 py-2 text-white rounded-lg hover:opacity-90 transition text-sm font-medium flex items-center justify-center gap-2"
          style="background-color: #4a9782"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </button>
        <button
          @click="$emit('delete', product)"
          class="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center justify-center gap-2"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "../types/item";

interface Props {
  product: Product;
  imageUrl: string;
  showActions?: boolean;
  showStock?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
  showStock: false,
});

defineEmits<{
  edit: [product: Product];
  delete: [product: Product];
}>();

const stockStatus = computed(() => {
  const qty = props.product.quantity || 0;
  if (qty === 0) return { color: "text-red-600", label: "Out of stock" };
  if (qty < 10) return { color: "text-yellow-600", label: "Low stock" };
  return { color: "text-green-600", label: "In stock" };
});

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='14' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
};
</script>

<template>
  <div
    class="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-opacity-50 transform hover:-translate-y-1"
    :style="{ borderColor: '#DCD0A8' }"
  >
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1 min-w-0">
        <h3
          class="text-xl font-bold mb-2 truncate group-hover:opacity-80 transition-opacity"
          style="color: #004030"
        >
          {{ category.name }}
        </h3>
        <p class="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {{ category.description || "No description provided" }}
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div class="flex items-center justify-between mb-4">
      <div
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        style="background-color: #dcd0a8"
      >
        <svg
          class="w-4 h-4"
          style="color: #004030"
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
        <span class="text-sm font-semibold" style="color: #004030">
          {{ category.productCount || 0 }}
          <span class="font-normal">{{
            category.productCount === 1 ? "item" : "items"
          }}</span>
        </span>
      </div>
      <div
        class="p-3 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
        style="background: linear-gradient(to bottom right, #4a9782, #004030)"
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
      </div>
    </div>

    <!-- Actions -->
    <div
      v-if="showActions"
      class="flex gap-2 mt-4 pt-4 border-t border-gray-100"
    >
      <button
        @click="$emit('edit', category)"
        class="flex-1 px-4 py-2.5 text-white rounded-lg hover:opacity-90 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
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
        @click="$emit('delete', category)"
        class="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md flex items-center justify-center gap-2"
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
</template>

<script setup lang="ts">
import type { Category } from "../types/item";

interface Props {
  category: Category;
  showActions?: boolean;
}

withDefaults(defineProps<Props>(), {
  showActions: true,
});

defineEmits<{
  edit: [category: Category];
  delete: [category: Category];
}>();
</script>

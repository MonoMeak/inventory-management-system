<template>
  <div class="space-y-6">
    <!-- Header Skeleton -->
    <div class="mb-8">
      <div class="animate-pulse">
        <div class="h-10 bg-gray-200 rounded w-48 mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-64"></div>
      </div>
      <div class="flex gap-3 mt-4">
        <div class="animate-pulse h-8 bg-gray-200 rounded-full w-32"></div>
        <div class="animate-pulse h-8 bg-gray-200 rounded-full w-32"></div>
      </div>
    </div>

    <!-- Search Bar Skeleton -->
    <div class="bg-white p-4 rounded-lg shadow animate-pulse">
      <div class="h-10 bg-gray-200 rounded w-full"></div>
    </div>

    <!-- Grid Skeleton -->
    <div
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <div
        v-for="i in count"
        :key="i"
        class="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
      >
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <div class="h-12 w-12 bg-gray-200 rounded-lg"></div>
            <div class="h-8 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div class="h-6 bg-gray-200 rounded w-3/4"></div>
          <div class="h-4 bg-gray-200 rounded w-full"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number;
}

withDefaults(defineProps<Props>(), {
  count: 8,
});
</script>

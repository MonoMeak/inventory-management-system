<template>
  <div class="space-y-6">
    <!-- Stats Grid Skeleton -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-white rounded-xl shadow-md p-6 animate-pulse"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="h-4 bg-gray-200 rounded w-32"></div>
          <div class="h-10 w-10 bg-gray-200 rounded-lg"></div>
        </div>
        <div class="h-8 bg-gray-200 rounded w-24"></div>
      </div>
    </div>

    <!-- Recent Products Table Skeleton -->
    <div class="bg-white rounded-lg shadow">
      <div class="p-6 border-b border-gray-200">
        <div class="animate-pulse h-6 bg-gray-200 rounded w-40"></div>
      </div>
      <div class="p-6 space-y-4">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-center gap-4 animate-pulse"
        >
          <div class="h-12 w-12 bg-gray-200 rounded"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-gray-200 rounded w-1/4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
          <div class="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

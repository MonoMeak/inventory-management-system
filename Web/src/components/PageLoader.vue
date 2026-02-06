<template>
  <transition name="fade">
    <div
      v-if="loading"
      class="fixed inset-0 z-[9998] flex items-center justify-center"
      style="background-color: rgba(0, 64, 48, 0.1); backdrop-filter: blur(2px)"
    >
      <div class="text-center">
        <div class="relative">
          <!-- Spinning loader -->
          <div
            class="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"
            style="border-top-color: #4a9782"
          ></div>
          <!-- Inner circle -->
          <div
            class="absolute inset-0 m-auto w-12 h-12 border-4 border-gray-100 rounded-full animate-spin"
            style="
              border-top-color: #004030;
              animation-direction: reverse;
              animation-duration: 0.8s;
            "
          ></div>
        </div>
        <p class="mt-4 text-sm font-medium" style="color: #004030">
          Loading...
        </p>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  loading: boolean;
}>();
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

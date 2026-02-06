<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2">
    <transition-group name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="min-w-[320px] max-w-md rounded-lg shadow-lg p-4 flex items-start gap-3 backdrop-blur-sm"
        :class="toastClasses(toast.type)"
        role="alert"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          <svg
            v-if="toast.type === 'success'"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'error'"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            v-else-if="toast.type === 'warning'"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <svg
            v-else
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <!-- Message -->
        <div class="flex-1 text-sm font-medium">
          {{ toast.message }}
        </div>

        <!-- Close Button -->
        <button
          @click="toastStore.removeToast(toast.id)"
          class="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from "../stores/toastStore";

const toastStore = useToastStore();

function toastClasses(type: string) {
  const baseClasses = "border-l-4";

  switch (type) {
    case "success":
      return `${baseClasses} bg-green-50 border-green-500 text-green-800`;
    case "error":
      return `${baseClasses} bg-red-50 border-red-500 text-red-800`;
    case "warning":
      return `${baseClasses} bg-yellow-50 border-yellow-500 text-yellow-800`;
    default:
      return `${baseClasses} bg-blue-50 border-blue-500 text-blue-800`;
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>

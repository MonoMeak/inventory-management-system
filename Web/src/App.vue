<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import ToastContainer from "./components/ToastContainer.vue";
import PageLoader from "./components/PageLoader.vue";

const router = useRouter();
const isNavigating = ref(false);

// Show loader on route change
router.beforeEach((to, from, next) => {
  if (to.path !== from.path) {
    isNavigating.value = true;
  }
  next();
});

router.afterEach(() => {
  // Small delay to ensure smooth transition
  setTimeout(() => {
    isNavigating.value = false;
  }, 300);
});
</script>

<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <toast-container />
  <page-loader :loading="isNavigating" />
</template>

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

<template>
  <div class="text-center py-12">
    <div
      class="inline-block animate-spin rounded-full h-12 w-12 border-b-2"
      style="border-color: #004030"
    ></div>
    <p class="mt-4 text-gray-600">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

withDefaults(defineProps<Props>(), {
  message: "Loading...",
});
</script>

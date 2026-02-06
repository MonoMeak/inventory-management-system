<template>
  <div
    class="flex items-center gap-2 px-3 py-1.5 rounded-lg"
    style="background-color: #dcd0a8"
  >
    <slot name="icon">
      <svg
        class="w-5 h-5"
        style="color: #004030"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          :d="iconPath"
        />
      </svg>
    </slot>
    <span class="text-sm font-semibold" style="color: #004030">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  icon?: "product" | "category" | "chart" | "tag";
}

const props = withDefaults(defineProps<Props>(), {
  icon: "product",
});

const iconPath = computed(() => {
  const paths = {
    product: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    category:
      "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    chart:
      "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    tag: "M7 20l4-16m2 16l4-16M6 9h14M4 15h14",
  };
  return paths[props.icon];
});
</script>

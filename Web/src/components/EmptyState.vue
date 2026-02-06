<template>
  <div class="text-center py-20 bg-white rounded-xl shadow-md">
    <div class="max-w-md mx-auto">
      <div
        class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
        style="background-color: #dcd0a8"
      >
        <component
          :is="iconComponent"
          class="w-10 h-10"
          style="color: #004030"
        />
      </div>
      <h3 class="text-2xl font-bold mb-2" style="color: #004030">
        {{ title }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ description }}
      </p>
      <button
        v-if="showAction"
        @click="$emit('action')"
        class="px-6 py-3 text-white rounded-lg hover:opacity-90 transition inline-flex items-center gap-2"
        style="background: linear-gradient(to right, #004030, #4a9782)"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        {{ actionLabel }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

interface Props {
  title: string;
  description: string;
  icon?: "product" | "category" | "search";
  showAction?: boolean;
  actionLabel?: string;
}

const props = withDefaults(defineProps<Props>(), {
  icon: "product",
  showAction: true,
  actionLabel: "Create New",
});

defineEmits<{
  action: [];
}>();

const iconComponent = computed(() => {
  const icons = {
    product: h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4",
      })
    ),
    category: h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
      })
    ),
    search: h(
      "svg",
      {
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      h("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        "stroke-width": "2",
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      })
    ),
  };
  return icons[props.icon];
});
</script>

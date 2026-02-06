<template>
  <div
    class="bg-white rounded-xl shadow-md  p-6 group"
  >
    <div class="flex items-center">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-1">{{ title }}</p>
        <p class="text-3xl font-bold mt-2" style="color: #004030">
          {{ formattedValue }}
        </p>
        <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
      </div>
      <div
        class="p-4 rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300"
        :style="iconBackground"
      >
        <component
          :is="iconComponent"
          class="w-8 h-8"
          :style="{ color: iconColor }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h } from "vue";

interface Props {
  title: string;
  value: number | string;
  icon: "products" | "lowStock" | "value" | "categories";
  subtitle?: string;
  prefix?: string;
  suffix?: string;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: "",
  suffix: "",
});

const formattedValue = computed(() => {
  return `${props.prefix}${props.value}${props.suffix}`;
});

const iconBackground = computed(() => {
  const colors = {
    products: "background: linear-gradient(to bottom right, #4A9782, #004030);",
    lowStock: "background: linear-gradient(to bottom right, #DCD0A8, #4A9782);",
    value: "background: linear-gradient(to bottom right, #004030, #4A9782);",
    categories:
      "background: linear-gradient(to bottom right, #4A9782, #DCD0A8);",
  };
  return colors[props.icon];
});

const iconColor = computed(() => {
  return props.icon === "lowStock" ? "#004030" : "#FFF9E5";
});

const iconComponent = computed(() => {
  const icons = {
    products: h(
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
        d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      })
    ),
    lowStock: h(
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
        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
      })
    ),
    value: h(
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
        d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      })
    ),
    categories: h(
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
  };
  return icons[props.icon];
});
</script>

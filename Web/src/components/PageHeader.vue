<template>
  <div class="mb-8">
    <div class="flex justify-between items-center mb-4">
      <div>
        <h1 class="text-4xl font-bold mb-2" style="color: #004030">
          {{ title }}
        </h1>
        <p v-if="description" class="text-gray-600">{{ description }}</p>
      </div>
      <slot name="actions"></slot>
    </div>
    <div v-if="$slots.badges" class="flex items-center gap-4 mt-3">
      <slot name="badges"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description?: string;
}

defineProps<Props>();
</script>

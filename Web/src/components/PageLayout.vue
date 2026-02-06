<template>
  <div class="min-h-screen" style="background-color: #fff9e5">
    <!-- Navigation -->
    <nav-bar :user="user" :isAdmin="isAdmin" @logout="$emit('logout')" />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from "./NavBar.vue";

defineProps<{
  user?: any;
  isAdmin?: boolean;
}>();

defineEmits(["logout"]);
</script>

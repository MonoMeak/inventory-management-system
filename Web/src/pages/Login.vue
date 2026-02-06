<template>
  <div
    class="min-h-screen flex items-center justify-center"
    style="background: linear-gradient(to bottom right, #dcd0a8, #fff9e5)"
  >
    <div class="bg-white p-8 shadow-2xl rounded-lg w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold" style="color: #004030">
          Inventory System
        </h1>
        <p class="text-gray-600 mt-2">Sign in to your account</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div
          v-if="errorMessage"
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
        >
          {{ errorMessage }}
        </div>

        <div>
          <label
            for="username"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:border-transparent transition focus:outline-none"
            style="--tw-ring-color: #4a9782"
            placeholder="Enter your username"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:border-transparent transition focus:outline-none"
            style="--tw-ring-color: #4a9782"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full text-white font-semibold p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
          style="background-color: #004030"
        >
          {{ isLoading ? "Signing in..." : "Sign In" }}
        </button>

        <div class="text-center text-sm text-gray-500">
          Default: admin / admin123
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";
import { logTokenInfo } from "../api/tokenUtils";

const username = ref("admin");
const password = ref("admin123");
const errorMessage = ref("");
const isLoading = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = "";
  isLoading.value = true;

  try {
    await auth.login(username.value, password.value);

    // Log token info for debugging
    logTokenInfo();

    router.push("/dashboard");
  } catch (error: any) {
    errorMessage.value =
      error.message || "Login failed. Please check your credentials.";
  } finally {
    isLoading.value = false;
  }
};
</script>

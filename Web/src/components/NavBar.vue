<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div
          class="flex items-center space-x-3 hover:cursor-pointer"
          @click="GoToDashboard"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-10"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
            />
          </svg>

          <h1 class="text-xl font-bold hidden sm:block" style="color: #004030">
            Inventory Management
          </h1>
          <h1 class="text-lg font-bold sm:hidden" style="color: #004030">
            IMS
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <router-link
            to="/dashboard"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/dashboard'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-2">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </div>
          </router-link>
          <router-link
            to="/products"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/products'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-2">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Products</span>
            </div>
          </router-link>
          <router-link
            to="/categories"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/categories'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-2">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>Categories</span>
            </div>
          </router-link>
          <router-link
            v-if="isAdmin"
            to="/users"
            class="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/users'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-2">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Users</span>
            </div>
          </router-link>
          <div v-if="user" class="relative ml-3">
            <button
              @click="ShowOption"
              class="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
              style="color: #004030"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>

            <!-- Dropdown -->
            <div
              v-if="showMenu"
              class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div class="px-4 py-4 border-b border-gray-200">
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="h-10 w-10 rounded-full flex items-center justify-center"
                    style="
                      background: linear-gradient(to right, #004030, #4a9782);
                    "
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold" style="color: #004030">
                      {{ user.username }}
                    </p>
                    <span
                      v-if="isAdmin"
                      class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full"
                      style="background-color: #dcd0a8; color: #004030"
                    >
                      Admin
                    </span>
                    <span
                      v-else
                      class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600"
                    >
                      User
                    </span>
                  </div>
                </div>
              </div>

              <button
                @click="onLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
              >
                <div class="flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>

                  <p>Logout</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu button -->
        <div class="flex md:hidden items-center space-x-2">
          <div v-if="user" class="relative">
            <button
              @click="ShowOption"
              class="flex items-center gap-2 focus:outline-none hover:opacity-80 transition-opacity"
              style="color: #004030"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-7"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </button>

            <!-- Mobile User Dropdown -->
            <div
              v-if="showMenu"
              class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden"
            >
              <div class="px-4 py-4 border-b border-gray-200">
                <div class="flex items-center gap-3 mb-2">
                  <div
                    class="h-10 w-10 rounded-full flex items-center justify-center"
                    style="
                      background: linear-gradient(to right, #004030, #4a9782);
                    "
                  >
                    <svg
                      class="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-bold" style="color: #004030">
                      {{ user.username }}
                    </p>
                    <span
                      v-if="isAdmin"
                      class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full"
                      style="background-color: #dcd0a8; color: #004030"
                    >
                      Admin
                    </span>
                    <span
                      v-else
                      class="inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-600"
                    >
                      User
                    </span>
                  </div>
                </div>
              </div>

              <button
                @click="onLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg transition-colors"
              >
                <div class="flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>

                  <p>Logout</p>
                </div>
              </button>
            </div>
          </div>
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-lg hover:bg-gray-100 focus:outline-none"
            style="color: #004030"
          >
            <svg
              v-if="!showMobileMenu"
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            @click="toggleMobileMenu"
            class="block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/dashboard'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-3">
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Dashboard</span>
            </div>
          </router-link>
          <router-link
            to="/products"
            @click="toggleMobileMenu"
            class="block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/products'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-3">
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
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Products</span>
            </div>
          </router-link>
          <router-link
            to="/categories"
            @click="toggleMobileMenu"
            class="block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/categories'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-3">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>Categories</span>
            </div>
          </router-link>
          <router-link
            v-if="isAdmin"
            to="/users"
            @click="toggleMobileMenu"
            class="block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
            active-class="text-white"
            :style="
              $route.path === '/users'
                ? 'background: linear-gradient(to right, #004030, #4a9782);'
                : 'color: #004030;'
            "
          >
            <div class="flex items-center gap-3">
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span>Users</span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";

defineProps({
  user: {
    type: Object,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
});

const showMenu = ref(false);
const showMobileMenu = ref(false);

const ShowOption = () => {
  showMenu.value = !showMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const emit = defineEmits(["logout"]);
const onLogout = () => {
  showMenu.value = false;
  emit("logout");
};

const router = useRouter();
const GoToDashboard = () => {
  router.push("/dashboard");
};

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".relative")) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
